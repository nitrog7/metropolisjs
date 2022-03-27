/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {FluxFramework} from '@nlabs/arkhamjs';
import {DateTime} from 'luxon';

import {User} from '../adapters/User';
import {
  USER_ADD_ERROR,
  USER_ADD_SUCCESS,
  USER_GET_LIST_ERROR,
  USER_GET_LIST_SUCCESS,
  USER_GET_SESSION_SUCCESS,
  USER_SESSION_UPDATE_ERROR,
  USER_SIGNIN_ERROR,
  USER_SIGNIN_SUCCESS,
  USER_SIGNOUT_ERROR,
  USER_SIGNOUT_SUCCESS,
  USER_UPDATE_ERROR,
  USER_UPDATE_SUCCESS,
  USER_VERIFY_ERROR,
  USER_VERIFY_SUCCESS
} from '../stores/userStore';
import {ApiResultsType, appMutation, appQuery, publicMutation, refreshSession} from '../utils/api';

export class Users {
  CustomAdapter: any;
  flux: FluxFramework;

  constructor(flux: FluxFramework, CustomAdapter: any = User) {
    this.CustomAdapter = CustomAdapter;
    this.flux = flux;
  }

  async addUser(userInput: any, profileProps: string[] = []): Promise<any> {
    try {
      const queryVariables = {
        user: {
          type: 'UserAddInput!',
          value: new User(userInput).getInput()
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {addUser = {}} = data;
        return this.flux.dispatch({user: new this.CustomAdapter(addUser), type: USER_ADD_SUCCESS});
      };

      return await publicMutation(
        this.flux,
        'addUser',
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
          ...profileProps
        ],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: USER_ADD_ERROR});
    }
  }

  async confirmCode(type: 'email' | 'phone', code: number) {
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

      const onSuccess = (data: ApiResultsType = {}) => {
        const {confirmCode: isValid = false} = data;
        return this.flux.dispatch({isValid, type: USER_VERIFY_SUCCESS});
      };

      return await appMutation(this.flux, 'confirmCode', queryVariables, null, {onSuccess});
    } catch(error) {
      return this.flux.dispatch({error, type: USER_VERIFY_ERROR});
    }
  }

  async getSessionUser(profileProps: string[] = []): Promise<any> {
    try {
      const onSuccess = (data: ApiResultsType = {}) => {
        const {session = {}} = data;
        return this.flux.dispatch({session: new this.CustomAdapter(session), type: USER_GET_SESSION_SUCCESS});
      };

      return await appQuery(
        this.flux,
        'session',
        null,
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
          ...profileProps
        ],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: USER_SESSION_UPDATE_ERROR});
    }
  }

  async getUser(userId: string, profileProps: string[] = []): Promise<any> {
    try {
      const queryVariables = {
        userId: {
          type: 'ID!',
          value: userId
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {user = {}} = data;
        return this.flux.dispatch({user: new this.CustomAdapter(user), type: USER_GET_SESSION_SUCCESS});
      };

      return await appQuery(
        this.flux,
        'user',
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
    } catch(error) {
      return this.flux.dispatch({error, type: USER_SESSION_UPDATE_ERROR});
    }
  }

  async getUsersByLatest(
    username: string,
    from: number = 0,
    to: number = 10,
    profileProps: string[] = []
  ): Promise<any> {
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

      const onSuccess = (data: ApiResultsType = {}) => {
        const {usersByLatest = []} = data;
        return this.flux.dispatch({
          user: usersByLatest.map((item) => new this.CustomAdapter(item)),
          type: USER_GET_LIST_SUCCESS
        });
      };

      return await appQuery(
        this.flux,
        'usersByLatest',
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
    } catch(error) {
      return this.flux.dispatch({error, type: USER_GET_LIST_ERROR});
    }
  }

  async getUsersByName(username: string, from: number = 0, to: number = 10, profileProps: string[] = []): Promise<any> {
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

      const onSuccess = (data: ApiResultsType = {}) => {
        const {usersByName = []} = data;
        return this.flux.dispatch({
          user: usersByName.map((item) => new this.CustomAdapter(item)),
          type: USER_GET_LIST_SUCCESS
        });
      };

      return await appQuery(
        this.flux,
        'usersByName',
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
    } catch(error) {
      return this.flux.dispatch({error, type: USER_GET_LIST_ERROR});
    }
  }

  async getUsersByReactions(
    username: string,
    reactionNames: string[],
    from: number = 0,
    to: number = 10,
    profileProps: string[] = []
  ): Promise<any> {
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

      const onSuccess = (data: ApiResultsType = {}) => {
        const {usersByReactions = []} = data;
        return this.flux.dispatch({
          user: usersByReactions.map((item) => new this.CustomAdapter(item)),
          type: USER_GET_LIST_SUCCESS
        });
      };

      return await appQuery(
        this.flux,
        'usersByReactions',
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
    } catch(error) {
      return this.flux.dispatch({error, type: USER_GET_LIST_ERROR});
    }
  }

  async getUsersByTags(
    username: string,
    tagNames: string[],
    from: number = 0,
    to: number = 10,
    profileProps: string[] = []
  ): Promise<any> {
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

      const onSuccess = (data: ApiResultsType = {}) => {
        const {getUsersByTags = []} = data;
        return this.flux.dispatch({
          user: getUsersByTags.map((item) => new this.CustomAdapter(item)),
          type: USER_GET_LIST_SUCCESS
        });
      };

      return await appQuery(
        this.flux,
        'getUsersByTags',
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
    } catch(error) {
      return this.flux.dispatch({error, type: USER_GET_LIST_ERROR});
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

  async refreshSession(token: string, expires: number = 15): Promise<any> {
    return refreshSession(this.flux, token, expires);
  }

  async signIn(username: string, password: string, expires: number = 15): Promise<any> {
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
          type: 'String!',
          value: username
        }
      };
      const onSuccess = (data: ApiResultsType = {}) => {
        const {signIn = {}} = data;
        return this.flux.dispatch({session: new User(signIn), type: USER_SIGNIN_SUCCESS});
      };

      console.log({publicMutation});
      return await publicMutation(this.flux, 'signIn', queryVariables, ['expires', 'issued', 'token'], {onSuccess});
    } catch(error) {
      return this.flux.dispatch({error, type: USER_SIGNIN_ERROR});
    }
  }

  async signOut() {
    try {
      const onSuccess = async () => {
        await this.flux.clearAppData();
        return this.flux.dispatch({type: USER_SIGNOUT_SUCCESS});
      };
      return await publicMutation(this.flux, 'signOut', null, null, {onSuccess});
    } catch(error) {
      return this.flux.dispatch({error, type: USER_SIGNOUT_ERROR});
    }
  }

  async updateUser(userInput: any, profileProps: string[] = []): Promise<any> {
    try {
      const queryVariables = {
        user: {
          type: 'UserUpdateInput!',
          value: new User(userInput).getInput()
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {updateUser = {}} = data;
        return this.flux.dispatch({user: new this.CustomAdapter(updateUser), type: USER_UPDATE_SUCCESS});
      };

      return await publicMutation(
        this.flux,
        'updateUser',
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
          ...profileProps
        ],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: USER_UPDATE_ERROR});
    }
  }
}
