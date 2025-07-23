/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {DateTime} from 'luxon';

import {validateProfileInput, type ProfileType} from '../../adapters/profileAdapter/profileAdapter';
import {validateUserInput} from '../../adapters/userAdapter/userAdapter';
import {PROFILE_CONSTANTS} from '../../stores';
import {USER_CONSTANTS} from '../../stores/userStore';
import {appMutation, publicMutation, refreshSession} from '../../utils/api';
import {createBaseActions} from '../../utils/baseActionFactory';

import type {User} from '../../adapters/userAdapter/userAdapter';
import type {ApiResultsType, ReaktorDbCollection, SessionType} from '../../utils/api';
import type {BaseAdapterOptions} from '../../utils/validatorFactory';
import type {FluxAction, FluxFramework} from '@nlabs/arkhamjs';

const DATA_TYPE: ReaktorDbCollection = 'users';

export type UserAdapterOptions = BaseAdapterOptions;

export type UserProfileAdapterOptions = BaseAdapterOptions;

export interface UserActionsOptions {
  readonly userAdapter?: (input: unknown, options?: UserAdapterOptions) => any;
  readonly profileAdapter?: (input: unknown, options?: UserProfileAdapterOptions) => any;
  readonly userAdapterOptions?: UserAdapterOptions;
  readonly profileAdapterOptions?: UserProfileAdapterOptions;
}

export interface UserApiResultsType {
  readonly users: {
    readonly activeCount?: number;
    readonly add?: Partial<User>;
    readonly confirmCode?: boolean;
    readonly deactivate?: Partial<User>;
    readonly forgotPassword?: boolean;
    readonly itemById?: Partial<User>;
    readonly itemBySession?: Partial<User>;
    readonly itemByToken?: Partial<User>;
    readonly itemByUsername?: Partial<User>;
    readonly list?: User[];
    readonly listByConnection?: User[];
    readonly listByLatest?: User[];
    readonly listByReactions?: User[];
    readonly listByTags?: User[];
    readonly refreshSession?: SessionType;
    readonly remove?: Partial<User>;
    readonly resetPassword?: boolean;
    readonly session?: Partial<User>;
    readonly signIn?: Partial<User>;
    readonly signUp?: Partial<User>;
    readonly update?: Partial<User>;
    readonly updatePassword?: Partial<boolean>;
    readonly updateProfile?: Partial<ProfileType>;
  };
}

const defaultUserValidator = (input: unknown, options?: UserAdapterOptions) => {
  const validated = validateUserInput(input);

  if(options?.strict && !validated.username) {
    throw new Error('Username is required in strict mode');
  }

  return validated;
};

const defaultProfileValidator = (input: unknown, options?: UserProfileAdapterOptions) => validateProfileInput(input);

export interface userActions {
  add: (userInput: Partial<User>, userProps?: string[]) => Promise<User>;
  confirmCode: (type: 'email' | 'phone', code: number) => Promise<boolean>;
  remove: (userId: string) => Promise<User>;
  session: (userProps?: string[]) => Promise<User>;
  itemById: (userId: string, userProps?: string[]) => Promise<User>;
  listByLatest: (username?: string, from?: number, to?: number, userProps?: string[]) => Promise<User[]>;
  listByConnection: (userId: string, from?: number, to?: number, userProps?: string[]) => Promise<User[]>;
  listByReactions: (
    username: string,
    reactionNames: string[],
    from?: number,
    to?: number,
    profileProps?: string[]
  ) => Promise<User[]>;
  listByTags: (
    username: string,
    tagNames: string[],
    from?: number,
    to?: number,
    profileProps?: string[]
  ) => Promise<User[]>;
  isLoggedIn: () => boolean;
  refreshSession: (token?: string, expires?: number) => Promise<SessionType>;
  signIn: (username: string, password: string, expires?: number) => Promise<SessionType>;
  signOut: () => Promise<boolean>;
  confirmSignUp: (code: string, type: 'email' | 'phone') => Promise<boolean>;
  forgotPassword: (username: string) => Promise<boolean>;
  resetPassword: (username: string, password: string, code: string, type: 'email' | 'phone') => Promise<boolean>;
  updatePassword: (password: string, newPassword: string) => Promise<boolean>;
  updateUser: (userInput: Partial<User>, userProps?: string[]) => Promise<User>;
  updateProfile: (profileInput: Partial<ProfileType>) => Promise<ProfileType>;
  signUp: (userInput: Partial<User>, userProps?: string[]) => Promise<User>;
  updateUserAdapter: (adapter: (input: unknown, options?: UserAdapterOptions) => any) => void;
  updateProfileAdapter: (adapter: (input: unknown, options?: UserProfileAdapterOptions) => any) => void;
  updateUserAdapterOptions: (options: UserAdapterOptions) => void;
  updateProfileAdapterOptions: (options: UserProfileAdapterOptions) => void;
}

export const createUserActions = (
  flux: FluxFramework,
  options?: UserActionsOptions
): userActions => {
  const userBase = createBaseActions(flux, defaultUserValidator, {
    adapter: options?.userAdapter,
    adapterOptions: options?.userAdapterOptions
  });

  const profileBase = createBaseActions(flux, defaultProfileValidator, {
    adapter: options?.profileAdapter,
    adapterOptions: options?.profileAdapterOptions
  });
  const add = async (userInput: Partial<User>, userProps: string[] = []): Promise<User> => {
    const queryVariables = {
      user: {
        type: 'UserInput',
        value: userBase.validator(userInput)
      }
    };

    const onSuccess = (data: UserApiResultsType): Promise<FluxAction> => {
      const {users: {add = {}}} = data;
      return flux.dispatch({
        type: USER_CONSTANTS.ADD_ITEM_SUCCESS,
        user: add
      });
    };

    const {users: {add: user = {}}} = await publicMutation<UserApiResultsType>(
      flux,
      'add',
      DATA_TYPE,
      queryVariables,
      userProps || [
        'added',
        'address',
        'dob',
        'city',
        'country',
        'gender',
        'imageUrl',
        'latitude',
        'longitude',
        'mailingList',
        'modified',
        'state',
        'tags {id, name, tagId}',
        'thumbUrl',
        'userAccess',
        'userId',
        'username'
      ],
      {onSuccess}
    );

    flux.dispatch({type: USER_CONSTANTS.ADD_ITEM_SUCCESS, user});
    return user as User;
  };

  const signUp = async (userInput: Partial<User>, userProps: string[] = []): Promise<User> => {
    const queryVariables = {
      user: {
        type: 'UserInput!',
        value: userBase.validator(userInput)
      }
    };

    const onSuccess = (data: UserApiResultsType): Promise<FluxAction> => {
      const {users: {signUp = {}}} = data;
      return flux.dispatch({
        type: USER_CONSTANTS.SIGN_UP_SUCCESS,
        user: signUp
      });
    };

    try {
      const {users: {signUp: user = {}}} = await publicMutation<UserApiResultsType>(
        flux,
        'signUp',
        DATA_TYPE,
        queryVariables,
        [
          'added',
          'city',
          'country',
          'dob',
          'firstName',
          'gender',
          'imageCount',
          'imageUrl',
          'latitude',
          'lastName',
          'longitude',
          'mailingList',
          'modified',
          'name',
          'state',
          'tags {id, name, tagId}',
          'thumbUrl',
          'userAccess',
          'userId',
          'username',
          ...userProps
        ],
        {onSuccess}
      );
      return user as User;
    } catch(error) {
      flux.dispatch({error, type: USER_CONSTANTS.SIGN_UP_ERROR});
      throw error;
    }
  };

  const updateUser = async (userInput: Partial<User>, userProps: string[] = []): Promise<User> => {
    const queryVariables = {
      user: {
        type: 'UserUpdateInput!',
        value: userBase.validator(userInput)
      }
    };

    const onSuccess = (data: ApiResultsType = {}) => {
      const {users: {update = {}}} = data as unknown as UserApiResultsType;
      return flux.dispatch({
        type: USER_CONSTANTS.UPDATE_ITEM_SUCCESS,
        user: update
      });
    };

    const {user} = await appMutation(
      flux,
      'update',
      DATA_TYPE,
      queryVariables,
      [
        'added',
        'address',
        'birthdate',
        'city',
        'country',
        'gender',
        'imageCount',
        'imageUrl',
        'latitude',
        'longitude',
        'mailingList',
        'modified',
        'state',
        'tags {id, name, tagId}',
        'thumbUrl',
        'userAccess',
        'userId',
        'username',
        ...userProps
      ],
      {onSuccess}
    );
    return user as User;
  };

  const updateProfile = async (profileInput: Partial<ProfileType>): Promise<ProfileType> => {
    const queryVariables = {
      profile: {
        type: 'ProfileUpdateInput!',
        value: profileBase.validator(profileInput)
      }
    };

    const onSuccess = (data: ApiResultsType = {}) => {
      const {users: {updateProfile = {}}} = data as unknown as UserApiResultsType;
      return flux.dispatch({profile: updateProfile, type: PROFILE_CONSTANTS.UPDATE_ITEM_SUCCESS});
    };

    const {profile} = await appMutation(flux, 'updateProfile', DATA_TYPE, queryVariables, [], {onSuccess});
    return profile as ProfileType;
  };


  const confirmCode = async (type: 'email' | 'phone', code: number): Promise<boolean> =>
    true
  ;

  const remove = async (userId: string): Promise<User> => {
    const queryVariables = {
      userId: {
        type: 'String!',
        value: userId
      }
    };

    const onSuccess = (data: ApiResultsType = {}) => {
      const {users: {remove = {}}} = data as unknown as UserApiResultsType;
      return flux.dispatch({type: USER_CONSTANTS.REMOVE_ITEM_SUCCESS, user: remove});
    };

    const {user} = await appMutation(flux, 'remove', DATA_TYPE, queryVariables, [], {onSuccess});
    return user as User;
  };

  const session = async (userInput: string[] = []): Promise<User> => {
    const queryVariables = {
      user: {
        type: 'UserInput!',
        value: userBase.validator(userInput)
      }
    };

    const onSuccess = (data: ApiResultsType = {}) => {
      const {users: {session = {}}} = data as unknown as UserApiResultsType;
      return flux.dispatch({type: USER_CONSTANTS.GET_SESSION_SUCCESS, user: session});
    };

    const {user} = await appMutation(flux, 'session', DATA_TYPE, queryVariables, [], {onSuccess});
    return user as User;
  };

  const itemById = async (userId: string, userProps: string[] = []): Promise<User> => {
    const queryVariables = {
      userId: {
        type: 'String!',
        value: userId
      }
    };

    const onSuccess = (data: ApiResultsType = {}) => {
      const {users: {itemById = {}}} = data as unknown as UserApiResultsType;
      return flux.dispatch({type: USER_CONSTANTS.GET_ITEM_SUCCESS, user: itemById});
    };

    const {user} = await appMutation(flux, 'itemById', DATA_TYPE, queryVariables, [], {onSuccess});
    return user as User;
  };

  const listByLatest = async (
    username: string = '',
    from: number = 0,
    to: number = 10,
    userProps: string[] = []
  ): Promise<User[]> =>
    []
  ;

  const listByConnection = async (
    userId: string,
    from: number = 0,
    to: number = 10,
    userProps: string[] = []
  ): Promise<User[]> =>
    []
  ;

  const listByReactions = async (
    username: string,
    reactionNames: string[],
    from: number = 0,
    to: number = 10,
    profileProps: string[] = []
  ): Promise<User[]> =>
    []
  ;

  const listByTags = async (
    username: string,
    tagNames: string[],
    from: number = 0,
    to: number = 10,
    profileProps: string[] = []
  ): Promise<User[]> =>
    []
  ;

  const isLoggedIn = (): boolean => {
    const expires: number = flux.getState('user.session.expires') as number;

    if(!expires) {
      return false;
    }

    const expireDate = DateTime.fromMillis(expires);
    const expiredDiff: number = Math.round(expireDate.diff(DateTime.local(), 'minutes').toObject().minutes);

    return expiredDiff > 0;
  };

  const refreshSessionAction = async (token?: string, expires: number = 15): Promise<SessionType> => {
    const result = await refreshSession(flux, token, expires);
    return (result?.refreshSession || {}) as SessionType;
  };

  const signIn = async (username: string, password: string, expires: number = 15): Promise<SessionType> => {
    const queryVariables = {
      expires: {
        type: 'Int',
        value: expires
      },
      password: {
        type: 'String!',
        value: password
      },
      username: {
        type: 'String!',
        value: username
      }
    };

    const onSuccess = (data: ApiResultsType = {}): Promise<FluxAction> => {
      const users = (data as any)?.users;
      const sessionData = users?.signIn || {};
      return flux.dispatch({
        session: sessionData,
        type: USER_CONSTANTS.SIGN_IN_SUCCESS
      });
    };

    try {
      await publicMutation<UserApiResultsType>(
        flux,
        'signIn',
        DATA_TYPE,
        queryVariables,
        ['expires', 'issued', 'token', 'userId', 'username'],
        {onSuccess}
      );

      const sessionData = flux.getState('user.session') || {};
      return sessionData as SessionType;
    } catch(error) {
      flux.dispatch({error, type: USER_CONSTANTS.SIGN_IN_ERROR});
      throw error;
    }
  };

  const signOut = async (): Promise<boolean> =>
    true
  ;

  const confirmSignUp = async (code: string, type: 'email' | 'phone'): Promise<boolean> =>
    true
  ;

  const forgotPassword = async (username: string): Promise<boolean> =>
    true
  ;

  const resetPassword = async (
    username: string,
    password: string,
    code: string,
    type: 'email' | 'phone'
  ): Promise<boolean> =>
    true
  ;

  const updatePassword = async (password: string, newPassword: string): Promise<boolean> =>
    true
  ;

  return {
    add,
    confirmCode,
    confirmSignUp,
    forgotPassword,
    isLoggedIn,
    itemById,
    listByConnection,
    listByLatest,
    listByReactions,
    listByTags,
    refreshSession: refreshSessionAction,
    remove,
    resetPassword,
    session,
    signIn,
    signOut,
    signUp,
    updatePassword,
    updateProfile,
    updateProfileAdapter: profileBase.updateAdapter,
    updateProfileAdapterOptions: profileBase.updateOptions,
    updateUser,
    updateUserAdapter: userBase.updateAdapter,
    updateUserAdapterOptions: userBase.updateOptions
  };
};
