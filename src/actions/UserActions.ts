/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {DateTime} from 'luxon';

import {Persona} from '../adapters/Persona';
import {User} from '../adapters/User';
import {UserConstants} from '../stores/userStore';
import {appMutation, appQuery, publicMutation, refreshSession} from '../utils/api';

import type {ApiResultsType, ReaktorDbCollection, SessionType} from '../utils/api';
import type {FluxAction, FluxFramework} from '@nlabs/arkhamjs';

const DATA_TYPE: ReaktorDbCollection = 'users';

export interface UserApiResultsType {
  users: {
    activeCount?: number;
    add?: Partial<User>;
    confirmCode?: boolean;
    deactivate?: Partial<User>;
    forgotPassword?: boolean;
    itemById?: Partial<User>;
    itemBySession?: Partial<User>;
    itemByToken?: Partial<User>;
    itemByUsername?: Partial<User>;
    list?: User[];
    listByConnection?: User[];
    listByLatest?: User[];
    listByReactions?: User[];
    listByTags?: User[];
    refreshSession?: SessionType;
    remove?: Partial<User>;
    resetPassword?: boolean;
    session?: Partial<User>;
    signIn?: Partial<User>;
    update?: Partial<User>;
    updatePassword?: Partial<boolean>;
    updatePersona?: Partial<Persona>;
  };
}

export class UserActions {
  CustomAdapter: typeof User;
  flux: FluxFramework;

  constructor(flux: FluxFramework, CustomAdapter: typeof User = User) {
    this.CustomAdapter = CustomAdapter;
    this.flux = flux;
  }

  async add(userInput: Partial<User>, userProps: string[] = []): Promise<User> {
    try {
      const queryVariables = {
        user: {
          type: 'UserInput',
          value: new User(userInput).getInput()
        }
      };

      const onSuccess = (data: UserApiResultsType): Promise<FluxAction> => {
        const {users: {add = {}}} = data;
        return this.flux.dispatch({
          user: new this.CustomAdapter(add).toJson(),
          type: UserConstants.ADD_ITEM_SUCCESS
        });
      };

      const {user} = await publicMutation(
        this.flux,
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

      this.flux.dispatch({user, type: UserConstants.ADD_ITEM_SUCCESS});
      return user as User;
    } catch(error) {
      this.flux.dispatch({error, type: UserConstants.ADD_ITEM_ERROR});
      throw error;
    }
  }

  async confirmCode(type: 'email' | 'phone', code: number): Promise<boolean> {
    try {
      const queryVariables = {
        code: {
          type: 'Int!',
          value: code
        },
        type: {
          type: 'String',
          value: type
        }
      };

      const onSuccess = (data: UserApiResultsType): Promise<FluxAction> => {
        const {users: {confirmCode: isValid = false}} = data;
        return this.flux.dispatch({
          type: UserConstants.VERIFY_SUCCESS,
          value: isValid
        });
      };

      const {value} = await appMutation(this.flux, 'confirmCode', DATA_TYPE, queryVariables, null, {onSuccess});
      return value as boolean;
    } catch(error) {
      this.flux.dispatch({error, type: UserConstants.VERIFY_ERROR});
      return Promise.reject(error);
    }
  }

  async remove(userId: string): Promise<User> {
    try {
      const queryVariables = {
        code: {
          type: 'ID!',
          value: userId
        }
      };
      const onSuccess = (data: UserApiResultsType): Promise<FluxAction> => {
        const {users: {remove: user = {}}} = data;
        return this.flux.dispatch({
          user: new this.CustomAdapter(user).toJson(),
          type: UserConstants.REMOVE_ITEM_SUCCESS
        });
      };

      const {user: removedUser} = await appMutation(this.flux, 'remove', DATA_TYPE, queryVariables, null, {onSuccess});
      return removedUser as User;
    } catch(error) {
      this.flux.dispatch({error, type: UserConstants.REMOVE_ITEM_ERROR});
      throw error;
    }
  }

  async session(userProps: string[] = []): Promise<User> {
    try {
      const onSuccess = (data: UserApiResultsType): Promise<FluxAction> => {
        const {users: {itemBySession: user = {}}} = data;
        return this.flux.dispatch({
          session: new this.CustomAdapter(user).toJson(),
          type: UserConstants.GET_SESSION_SUCCESS
        });
      };

      const {user} = await appQuery(
        this.flux,
        'itemBySession',
        DATA_TYPE,
        null,
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
      this.flux.dispatch({error, type: UserConstants.GET_SESSION_ERROR});
      throw error;
    }
  }

  async itemById(userId: string, userProps: string[] = []): Promise<User> {
    try {
      const queryVariables = {
        userId: {
          type: 'ID!',
          value: userId
        }
      };
      const onSuccess = (data: UserApiResultsType): Promise<FluxAction> => {
        const {users: {itemById: user = {}}} = data;
        return this.flux.dispatch({
          type: UserConstants.GET_SESSION_SUCCESS,
          user: new this.CustomAdapter(user).toJson()
        });
      };

      const {user} = await appQuery(
        this.flux,
        'user',
        DATA_TYPE,
        queryVariables,
        [
          'added',
          'birthdate',
          'city',
          'country',
          'gender',
          'hasLike',
          'hasView',
          'imageCount',
          'imageUrl',
          'latitude',
          'longitude',
          'likeCount',
          'modified',
          'state',
          'tags {id, name, tagId}',
          'thumbUrl',
          'username',
          'userId',
          'viewCount',
          ...userProps
        ],
        {onSuccess}
      );

      return user as User;
    } catch(error) {
      this.flux.dispatch({error, type: UserConstants.GET_ITEM_ERROR});
      throw error;
    }
  }

  async listByLatest(
    username: string = '',
    from: number = 0,
    to: number = 10,
    userProps: string[] = []
  ): Promise<User[]> {
    try {
      const queryVariables = {
        from: {
          type: 'Int',
          value: from
        },
        to: {
          type: 'Int',
          value: to
        },
        username: {
          type: 'String',
          value: username
        }
      };

      const onSuccess = (data: UserApiResultsType): Promise<FluxAction> => {
        const {users: {listByLatest = []}} = data;
        return this.flux.dispatch({
          list: listByLatest.map((item) => new this.CustomAdapter(item).toJson()),
          type: UserConstants.GET_LIST_SUCCESS
        });
      };

      const {list} = await appQuery(
        this.flux,
        'usersByLatest',
        DATA_TYPE,
        queryVariables,
        [
          'added',
          'birthdate',
          'city',
          'country',
          'gender',
          'hasLike',
          'hasView',
          'imageCount',
          'imageUrl',
          'latitude',
          'longitude',
          'likeCount',
          'modified',
          'state',
          'tags {id, name, tagId}',
          'thumbUrl',
          'username',
          'userId',
          'viewCount',
          ...userProps
        ],
        {onSuccess}
      );
      return list as User[];
    } catch(error) {
      this.flux.dispatch({error, type: UserConstants.GET_LIST_ERROR});
      throw error;
    }
  }

  async listByConnection(
    userId: string,
    from: number = 0,
    to: number = 10,
    userProps: string[] = []
  ): Promise<User[]> {
    try {
      const queryVariables = {
        from: {
          type: 'Int',
          value: from
        },
        to: {
          type: 'Int',
          value: to
        },
        userId: {
          type: 'ID!',
          value: userId
        }
      };

      const onSuccess = (data: UserApiResultsType): Promise<FluxAction> => {
        const {users: {listByConnection = []}} = data;
        return this.flux.dispatch({
          list: listByConnection.map((item) => new this.CustomAdapter(item).toJson()),
          type: UserConstants.GET_LIST_SUCCESS
        });
      };

      const {list} = await appQuery(
        this.flux,
        'usersByName',
        DATA_TYPE,
        queryVariables,
        [
          'added',
          'birthdate',
          'city',
          'country',
          'gender',
          'hasLike',
          'hasView',
          'imageCount',
          'imageUrl',
          'latitude',
          'longitude',
          'likeCount',
          'modified',
          'state',
          'tags {id, name, tagId}',
          'thumbUrl',
          'username',
          'userId',
          'viewCount',
          ...userProps
        ],
        {onSuccess}
      );
      return list as User[];
    } catch(error) {
      this.flux.dispatch({error, type: UserConstants.GET_LIST_ERROR});
      throw error;
    }
  }

  async listByReactions(
    username: string,
    reactionNames: string[],
    from: number = 0,
    to: number = 10,
    profileProps: string[] = []
  ): Promise<User[]> {
    try {
      const queryVariables = {
        from: {
          type: 'Int',
          value: from
        },
        reactionNames: {
          type: '[String]',
          value: reactionNames
        },
        to: {
          type: 'Int',
          value: to
        },
        username: {
          type: 'String',
          value: username
        }
      };

      const onSuccess = (data: UserApiResultsType): Promise<FluxAction> => {
        const {users: {listByReactions = []}} = data;
        return this.flux.dispatch({
          list: listByReactions.map((item) => new this.CustomAdapter(item).toJson()),
          type: UserConstants.GET_LIST_SUCCESS
        });
      };

      const {list} = await appQuery(
        this.flux,
        'usersByReactions',
        DATA_TYPE,
        queryVariables,
        [
          'added',
          'birthdate',
          'city',
          'country',
          'gender',
          'hasLike',
          'hasView',
          'imageCount',
          'imageUrl',
          'latitude',
          'longitude',
          'likeCount',
          'modified',
          'state',
          'tags {id, name, tagId}',
          'thumbUrl',
          'username',
          'userId',
          'viewCount',
          ...profileProps
        ],
        {onSuccess}
      );

      return list as User[];
    } catch(error) {
      this.flux.dispatch({error, type: UserConstants.GET_LIST_ERROR});
      throw error;
    }
  }

  async listByTags(
    username: string,
    tagNames: string[],
    from: number = 0,
    to: number = 10,
    profileProps: string[] = []
  ): Promise<User[]> {
    try {
      const queryVariables = {
        from: {
          type: 'Int',
          value: from
        },
        tagNames: {
          type: '[String]',
          value: tagNames
        },
        to: {
          type: 'Int',
          value: to
        },
        username: {
          type: 'String',
          value: username
        }
      };

      const onSuccess = (data: UserApiResultsType): Promise<FluxAction> => {
        const {users: {listByTags = []}} = data;
        return this.flux.dispatch({
          list: listByTags.map((item) => new this.CustomAdapter(item).toJson()),
          type: UserConstants.GET_LIST_SUCCESS
        });
      };

      const {list} = await appQuery(
        this.flux,
        'getUsersByTags',
        DATA_TYPE,
        queryVariables,
        [
          'added',
          'birthdate',
          'city',
          'country',
          'gender',
          'hasLike',
          'hasView',
          'imageCount',
          'imageUrl',
          'latitude',
          'longitude',
          'likeCount',
          'modified',
          'state',
          'tags {id, name, tagId}',
          'thumbUrl',
          'username',
          'userId',
          'viewCount',
          ...profileProps
        ],
        {onSuccess}
      );

      return list as User[];
    } catch(error) {
      this.flux.dispatch({error, type: UserConstants.GET_LIST_ERROR});
      throw error;
    }
  }

  isLoggedIn(): boolean {
    const expires: number = this.flux.getState('user.session.expires');

    if(!expires) {
      return false;
    }

    const expireDate = DateTime.fromMillis(expires);
    const expiredDiff: number = Math.round(expireDate.diff(DateTime.local(), 'minutes').toObject().minutes);

    return expiredDiff > 0;
  }

  async refreshSession(token?: string, expires: number = 15): Promise<SessionType> {
    const {session} = await refreshSession(this.flux, token, expires);
    return session;
  }

  async signIn(username: string, password: string, expires: number = 15): Promise<SessionType> {
    try {
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
          type: 'String',
          value: username
        }
      };
      const onSuccess = (data: UserApiResultsType): Promise<FluxAction> => {
        const {users: {signIn = {}}} = data as unknown as UserApiResultsType;
        return this.flux.dispatch({
          session: signIn,
          type: UserConstants.SIGN_IN_SUCCESS
        });
      };

      const {session} = await publicMutation(
        this.flux,
        'signIn',
        DATA_TYPE,
        queryVariables,
        ['expires', 'issued', 'token', 'userId', 'username'],
        {onSuccess}
      );
      return session as SessionType;
    } catch(error) {
      this.flux.dispatch({error, type: UserConstants.SIGN_IN_ERROR});
      throw error;
    }
  }

  async signOut(): Promise<boolean> {
    try {
      const onSuccess = async () => {
        await this.flux.clearAppData();
        return this.flux.dispatch({type: UserConstants.SIGN_OUT_SUCCESS});
      };
      const {signOut} = await publicMutation(this.flux, 'signOut', DATA_TYPE, null, null, {onSuccess});
      return !!signOut;
    } catch(error) {
      this.flux.dispatch({error, type: UserConstants.SIGN_OUT_ERROR});
      throw error;
    }
  }

  // async resendCode(username: string, type: 'email' | 'phone'): Promise<boolean> {
  //   try {
  //     const queryVariables = {
  //       type: {
  //         type: 'String!',
  //         value: type
  //       },
  //       username: {
  //         type: 'String!',
  //         value: username
  //       }
  //     };
  //     const onSuccess = (data: UserApiResultsType): Promise<FluxAction> => {
  //       const {users: {resendCode = {}}} = data as unknown as UserApiResultsType;
  //       return this.flux.dispatch({value: !!resendCode, type: USER_RESEND_CODE_SUCCESS});
  //     };

  //     const {resendCode} = await publicMutation(this.flux, 'resendCode', queryVariables, null, {onSuccess});
  //     return !!resendCode;
  //   } catch(error) {
  //     this.flux.dispatch({error, type: USER_RESEND_CODE_ERROR});
  //     return Promise.reject(error);
  //   }
  // }

  async confirmSignUp(code: string, type: 'email' | 'phone'): Promise<boolean> {
    try {
      const queryVariables = {
        code: {
          type: 'String!',
          value: code
        },
        type: {
          type: 'String!',
          value: type
        }
      };
      const onSuccess = (data: ApiResultsType = {}) => {
        const {confirmSignUp = {}} = data;
        return this.flux.dispatch({confirmSignUp, type: UserConstants.CONFIRM_SIGN_UP_SUCCESS});
      };

      const {confirmSignUp} = await publicMutation(this.flux, 'confirmSignUp', DATA_TYPE, queryVariables, null, {onSuccess});
      return !!confirmSignUp;
    } catch(error) {
      this.flux.dispatch({error, type: UserConstants.CONFIRM_SIGN_UP_ERROR});
      return Promise.reject(error);
    }
  }

  async forgotPassword(username: string): Promise<boolean> {
    try {
      const queryVariables = {
        username: {
          type: 'String!',
          value: username
        }
      };
      const onSuccess = (data: ApiResultsType = {}) => {
        const {forgotPassword = {}} = data;
        return this.flux.dispatch({type: UserConstants.FORGOT_PASSWORD_SUCCESS, value: !!forgotPassword});
      };

      const {value} = await publicMutation(this.flux, 'forgotPassword', DATA_TYPE, queryVariables, null, {onSuccess});
      return value as boolean;
    } catch(error) {
      this.flux.dispatch({error, type: UserConstants.FORGOT_PASSWORD_ERROR});
      return Promise.reject(error);
    }
  }

  async resetPassword(
    username: string,
    password: string,
    code: string,
    type: 'email' | 'phone'
  ): Promise<boolean> {
    try {
      const queryVariables = {
        code: {
          type: 'String!',
          value: code
        },
        password: {
          type: 'String!',
          value: password
        },
        type: {
          type: 'String!',
          value: type
        },
        username: {
          type: 'String!',
          value: username
        }
      };
      const onSuccess = (data: ApiResultsType = {}) => {
        const {resetPassword = {}} = data;
        return this.flux.dispatch({type: UserConstants.RESET_PASSWORD_SUCCESS, value: !!resetPassword});
      };

      const {value} = await publicMutation(this.flux, 'resetPassword', DATA_TYPE, queryVariables, null, {onSuccess});
      return value as boolean;
    } catch(error) {
      this.flux.dispatch({error, type: UserConstants.RESET_PASSWORD_ERROR});
      return Promise.reject(error);
    }
  }

  async updatePassword(password: string, newPassword: string): Promise<boolean> {
    try {
      const queryVariables = {
        newPassword: {
          type: 'String!',
          value: newPassword
        },
        password: {
          type: 'String!',
          value: password
        }
      };
      const onSuccess = (data: ApiResultsType = {}) => {
        const {users: {updatePassword = {}}} = data as unknown as UserApiResultsType;
        return this.flux.dispatch({value: !!updatePassword, type: UserConstants.UPDATE_ITEM_SUCCESS});
      };

      const {value} = await publicMutation(this.flux, 'updatePassword', DATA_TYPE, queryVariables, null, {onSuccess});
      return value as boolean;
    } catch(error) {
      this.flux.dispatch({error, type: UserConstants.UPDATE_ITEM_ERROR});
      return Promise.reject(error);
    }
  }

  async updateUser(userInput: Partial<User>, userProps: string[] = []): Promise<User> {
    try {
      const queryVariables = {
        user: {
          type: 'UserUpdateInput!',
          value: new User(userInput).getInput()
        }
      };
      const onSuccess = (data: ApiResultsType = {}) => {
        const {users: {update = {}}} = data as unknown as UserApiResultsType;
        return this.flux.dispatch({
          user: new this.CustomAdapter(update).toJson(),
          type: UserConstants.UPDATE_ITEM_SUCCESS
        });
      };

      const {user} = await publicMutation(
        this.flux,
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
    } catch(error) {
      this.flux.dispatch({error, type: UserConstants.UPDATE_ITEM_ERROR});
      return Promise.reject(error);
    }
  }

  async updatePersona(personaInput: Partial<Persona>): Promise<Persona> {
    try {
      const queryVariables = {
        persona: {
          type: 'PersonaUpdateInput!',
          value: new Persona(personaInput).getInput()
        }
      };
      const onSuccess = (data: ApiResultsType = {}) => {
        const {users: {updatePersona = {}}} = data as unknown as UserApiResultsType;
        return this.flux.dispatch({persona: new Persona(updatePersona), type: UserConstants.UPDATE_PERSONA_SUCCESS});
      };

      const {persona} = await publicMutation(this.flux, 'updatePersona', DATA_TYPE, queryVariables, null, {onSuccess});
      return persona as Persona;
    } catch(error) {
      this.flux.dispatch({error, type: UserConstants.UPDATE_PERSONA_ERROR});
      return Promise.reject(error);
    }
  }
}
