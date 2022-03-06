import {FluxFramework} from '@nlabs/arkhamjs/lib';
import {ApiError, graphqlQuery, HunterOptionsType, HunterQueryType, post} from '@nlabs/rip-hunter';
import camelCase from 'lodash/camelCase';
import isEmpty from 'lodash/isEmpty';
import startCase from 'lodash/startCase';
import {DateTime} from 'luxon';

import {Users} from '../actions/Users';
import {Config} from '../config';
import {API_NETWORK_ERROR, API_NETWORK_SUCCESS} from '../stores/appStore';
import {SESSION_UPDATE_SUCCESS, USER_SESSION_UPDATE_ERROR} from '../stores/userStore';

export interface ApiOptions {
  readonly onSuccess?: any;
  readonly variables?: any;
}

export interface ApiQueryVariableType {
  readonly type: string;
  readonly value: any;
}

export interface ApiQueryVariables {
  readonly [key: string]: ApiQueryVariableType;
}

export interface ApiResultsType {
  readonly [key: string]: any;
}

export interface RetryType {
  query: HunterQueryType | HunterQueryType[];
  responseMethod: (results: any) => {};
}

export const appUrl: string = Config.get('api.app');
export const publicUrl: string = Config.get('api.public');
export const uploadImageUrl: string = Config.get('api.uploadImage');

export const getGraphql = async (
  flux: FluxFramework,
  url: string,
  authenticate: boolean,
  query: HunterQueryType | HunterQueryType[],
  options
): Promise<any> => {
  const {onSuccess} = options;
  const retry: RetryType = {query, responseMethod: onSuccess};
  const networkType: string = flux.getState('app.networkType');

  if(networkType === 'none') {
    return flux.dispatch({retry, type: API_NETWORK_ERROR});
  }

  const now: number = Date.now();
  const {expires = now, issued = now, token: currentToken} = flux.getState('user.session') || {};
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
        const {session: updatedSession} = (await refreshSession(flux, currentToken, sessionMin)) || {};
        const {token: newToken} = updatedSession || {};
        console.log({newToken});
        if(!newToken) {
          Promise.reject(new ApiError(['invalid_session'], 'invalid_session'));
        }

        token = newToken;
      }
    }
  }

  return graphqlQuery(url, query, {token})
    .then(async (results) => {
      await flux.dispatch({type: API_NETWORK_SUCCESS});
      console.log('GraphqlApi::results', results);
      return results;
    })
    .then((data) => (onSuccess ? onSuccess(data) : data))
    .catch(async (error) => {
      const {errors = []} = error;

      console.log({error});
      if(onSuccess && errors.includes('network_error')) {
        await flux.dispatch({retry, type: API_NETWORK_ERROR});
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
  variables: ApiQueryVariables = {},
  returnProperties: string[] = [],
  type = 'query'
) => {
  const queryVariables = variables || {};
  const variableKeys = Object.keys(queryVariables);
  const queryName = name.replace(/ /g, '');
  const query = `${type} ${startCase(camelCase(queryName))}${
    variableKeys.length ? `(${variableKeys.map((key) => `$${key}: ${queryVariables[key].type}`).join(', ')})` : ''
  } {
    ${camelCase(queryName)}(${variableKeys.length ? `(${variableKeys.map((key) => `${key}: ${key}`).join(', ')})` : ''}
    ${returnProperties?.length ? `{${returnProperties.join(', ')}}` : ''}
  }`;

  return {query, variables: variableKeys.map((key) => ({[key]: queryVariables[key].value}))};
};

export const createMutation = (name: string, variables: ApiQueryVariables = {}, returnProperties: string[] = []) =>
  createQuery(name, variables, returnProperties, 'mutation');

export const appQuery = (
  flux: FluxFramework,
  name: string,
  queryVariables: ApiQueryVariables,
  returnProperties: string[],
  options: ApiOptions = {}
): Promise<any> => {
  const query = createQuery(name, queryVariables, returnProperties);
  return getGraphql(flux, appUrl, true, query, options);
};

export const appMutation = (
  flux: FluxFramework,
  name: string,
  queryVariables: ApiQueryVariables,
  returnProperties: string[],
  options: ApiOptions = {}
): Promise<any> => {
  const query = createMutation(name, queryVariables, returnProperties);
  return getGraphql(flux, appUrl, true, query, options);
};

export const publicQuery = (
  flux: FluxFramework,
  name: string,
  queryVariables: ApiQueryVariables,
  returnProperties: string[],
  options: ApiOptions = {}
): Promise<any> => {
  const query = createQuery(name, queryVariables, returnProperties);
  return getGraphql(flux, publicUrl, false, query, options);
};

export const publicMutation = (
  flux: FluxFramework,
  name: string,
  queryVariables: ApiQueryVariables,
  returnProperties: string[],
  options: ApiOptions = {}
): Promise<any> => {
  const query = createMutation(name, queryVariables, returnProperties);
  return getGraphql(flux, publicUrl, false, query, options);
};

export const uploadImage = (image, options: HunterOptionsType = {}): Promise<any> => {
  const {flux} = Config;
  const token = flux.getState('user.session.token');
  const headers = new Headers();
  headers.set('Authorization', `Bearer ${token}`);
  return post(uploadImageUrl, image, {headers, ...options});
};

export const refreshSession = async (flux: FluxFramework,token: string, expires: number = 15): Promise<any> => {
  if(isEmpty(token)) {
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
    const onSuccess = (data: ApiResultsType = {}) => {
      const {refreshSession = {}} = data;
      return flux.dispatch({session: new Users(refreshSession), type: SESSION_UPDATE_SUCCESS});
    };

    return await publicMutation(flux, 'refreshSession', queryVariables, ['expires', 'issued', 'token'], {
      onSuccess
    });
  } catch(error) {
    return flux.dispatch({error, type: USER_SESSION_UPDATE_ERROR});
  }
};