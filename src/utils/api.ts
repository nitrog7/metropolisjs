import {ApiError, graphqlQuery, HunterOptionsType, HunterQueryType, post} from '@nlabs/rip-hunter';
import camelCase from 'lodash/camelCase';
import isEmpty from 'lodash/isEmpty';
import upperFirst from 'lodash/upperFirst';
import {DateTime} from 'luxon';

import {Config} from '../config';
import {APP_CONSTANTS} from '../stores/appStore';
import {USER_CONSTANTS} from '../stores/userStore';

import type {FluxAction, FluxFramework} from '@nlabs/arkhamjs';

export interface ApiOptions {
  readonly onSuccess?: (data: unknown) => Promise<FluxAction>;
  readonly variables?: Record<string, unknown>;
}

export type ReaktorDbCollection =
  'apps' |
  'conversations' |
  'files' |
  'groups' |
  'images' |
  'locations' |
  'messages' |
  'notifications' |
  'payments' |
  'posts' |
  'reactions' |
  'subscriptions' |
  'tags' |
  'users';

export interface ApiQueryVariableType {
  readonly type: string;
  readonly value: unknown;
}

export interface ApiQueryVariables {
  readonly [key: string]: ApiQueryVariableType;
}

export interface ApiResultsType {
  readonly [key: string]: unknown;
}

export interface RetryType {
  readonly query: HunterQueryType | HunterQueryType[];
  readonly responseMethod: (results: ApiResultsType) => void;
}

export interface SessionType {
  readonly expires?: number;
  readonly issued?: number;
  readonly token?: string;
  readonly userId?: string;
  readonly username?: string;
}

export const getGraphql = async (
  flux: FluxFramework,
  url: string,
  authenticate: boolean,
  query: HunterQueryType | HunterQueryType[],
  options: ApiOptions
): Promise<ApiResultsType> => {
  const {onSuccess} = options;
  const retry: RetryType = {query, responseMethod: onSuccess};
  const networkType: string = flux.getState('app.networkType');

  if(networkType === 'none') {
    return flux.dispatch({retry, type: APP_CONSTANTS.API_NETWORK_ERROR});
  }

  const now: number = Date.now();
  const {expires = now, issued = now, token: currentToken} = (flux.getState('user.session') || {}) as SessionType;
  let token: string;

  console.log('getGraphql::authenticate', {authenticate, currentToken});
  if(authenticate) {
    const nowDate: DateTime = DateTime.local();
    const expiresDate: DateTime = DateTime.fromMillis(expires);
    const expiredDiff: number = Math.round(expiresDate.diff(nowDate, 'minutes').toObject().minutes);
    token = currentToken;

    console.log('getGraphql::expiredDiff', expiredDiff);
    if(expiredDiff > 0) {
      const sessionMin: number = Config.get('app.session.minMinutes', 0);
      const issuedDate: DateTime = DateTime.fromMillis(expires);
      const issuedDiff: number = Math.round(nowDate.diff(issuedDate, 'minutes').toObject().minutes);

      console.log({issued, issuedDiff, sessionMin});
      if(issuedDiff >= sessionMin) {
        const {
          session: updatedSession = {token: undefined}
        } = (await refreshSession(flux, currentToken, sessionMin)) || {} as FluxAction;
        const {token: newToken} = (updatedSession || {}) as SessionType;

        console.log({newToken});
        if(!newToken) {
          Promise.reject(new ApiError(['invalid_session'], 'invalid_session'));
        }

        token = newToken;
      }
    }
  }

  console.log('getGraphql::query', {query, token, url});
  return graphqlQuery(url, query, {token})
    .then(async (results) => {
      await flux.dispatch({type: APP_CONSTANTS.API_NETWORK_SUCCESS});
      console.log('GraphqlApi::results', results);
      return results;
    })
    .then((data) => (onSuccess ? onSuccess(data) : data))
    .catch(async (error) => {
      const {errors = []} = error;

      console.log({error});
      if(onSuccess && errors.includes('network_error')) {
        await flux.dispatch({retry, type: APP_CONSTANTS.API_NETWORK_ERROR});
        return Promise.reject(error);
      } else if(errors.includes('invalid_session')) {
        await flux.clearAppData();
        return Promise.resolve({});
      }

      return Promise.reject(error);
    });
};

export const createQuery = (
  name: string,
  dataType: ReaktorDbCollection,
  variables: ApiQueryVariables = {},
  returnProperties: string[] = [],
  type = 'query'
) => {
  const queryVariables = variables || {};
  const variableKeys = Object.keys(queryVariables);
  const queryName = name.replace(/ /g, '');
  const query = `${type} ${upperFirst(camelCase(`${dataType}_${queryName}`))}${variableKeys.length
    ? `(${variableKeys.map((key) => `$${key}: ${queryVariables[key].type}`).join(', ')})`
    : ''} {
      ${dataType} {
        ${camelCase(queryName)}${variableKeys.length ? `(${variableKeys.map((key) => `${key}: $${key}`).join(', ')})` : ''}
        ${returnProperties?.length ? `{${returnProperties.join(', ')}}` : ''}
      }
    }`;

  return {query, variables: variableKeys.reduce((queryData, key) => {
    queryData[key] = queryVariables[key].value;

    return queryData;
  }, {} as Record<string, unknown>
  )};
};

export const createMutation = (name: string, dataType: ReaktorDbCollection, variables: ApiQueryVariables = {}, returnProperties: string[] = []) =>
  createQuery(name, dataType, variables, returnProperties, 'mutation');

export const appQuery = (
  flux: FluxFramework,
  name: string,
  dataType: ReaktorDbCollection,
  queryVariables: ApiQueryVariables,
  returnProperties: string[],
  options: ApiOptions = {}
): Promise<ApiResultsType> => {
  const query = createQuery(name, dataType, queryVariables, returnProperties);
  const appUrl: string = Config.get('app.api.url');
  return getGraphql(flux, appUrl, true, query, options);
};

export const appMutation = (
  flux: FluxFramework,
  name: string,
  dataType: ReaktorDbCollection,
  queryVariables: ApiQueryVariables,
  returnProperties: string[],
  options: ApiOptions = {}
): Promise<ApiResultsType> => {
  const query = createMutation(name, dataType, queryVariables, returnProperties);
  const appUrl: string = Config.get('app.api.url');
  return getGraphql(flux, appUrl, true, query, options);
};

export const publicQuery = (
  flux: FluxFramework,
  name: string,
  dataType: ReaktorDbCollection,
  queryVariables: ApiQueryVariables,
  returnProperties: string[],
  options: ApiOptions = {}
): Promise<ApiResultsType> => {
  const query = createQuery(name, dataType, queryVariables, returnProperties);
  const publicUrl: string = Config.get('app.api.public');
  return getGraphql(flux, publicUrl, false, query, options);
};

export const publicMutation = <T>(
  flux: FluxFramework,
  name: string,
  dataType: ReaktorDbCollection,
  queryVariables: ApiQueryVariables,
  returnProperties: string[],
  options: ApiOptions = {}
): Promise<T> => {
  const query = createMutation(name, dataType, queryVariables, returnProperties);
  const publicUrl: string = Config.get('app.api.public');
  return getGraphql(flux, publicUrl, false, query, options) as Promise<T>;
};

export const uploadImage = (flux: FluxFramework, image, options: HunterOptionsType = {}): Promise<ApiResultsType> => {
  const token = flux.getState('user.session.token');
  const headers = new Headers();
  headers.set('Authorization', `Bearer ${token}`);
  const uploadImageUrl: string = Config.get('app.api.uploadImage');
  return post(uploadImageUrl, image, {headers, ...options});
};

export const refreshSession = async (flux: FluxFramework, token?: string, expires: number = 15): Promise<ApiResultsType> => {
  const refreshToken = isEmpty(token) ? token : flux.getState('user.session.token');

  if(isEmpty(refreshToken)) {
    return null;
  }

  try {
    const queryVariables = {
      expires: {
        type: 'Int',
        value: expires
      },
      token: {
        type: 'String!',
        value: token
      }
    };
    const onSuccess = (data: ApiResultsType = {}): Promise<FluxAction> => {
      const {refreshSession: sessionData = {}} = data;
      return flux.dispatch({session: sessionData, type: USER_CONSTANTS.UPDATE_SESSION_SUCCESS});
    };

    return await publicMutation(flux, 'refreshSession', 'users', queryVariables, ['expires', 'issued', 'token'], {
      onSuccess
    });
  } catch(error) {
    flux.dispatch({error, type: USER_CONSTANTS.GET_SESSION_ERROR});
    return null;
  }
};