/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import capitalize from 'lodash/capitalize';
import orderBy from 'lodash/orderBy';
import pullAllBy from 'lodash/pullAllBy';
import uniqBy from 'lodash/uniqBy';

import {REACTION_ADD_SUCCESS, REACTION_DELETE_SUCCESS} from './reactionStore';
import {TAG_ADD_PROFILE_SUCCESS, TAG_DELETE_PROFILE_SUCCESS} from './tagStore';

export const SESSION_UPDATE_SUCCESS: string = 'SESSION_UPDATE_SUCCESS';
export const USER_ADD_ERROR: string = 'USER_ADD_ERROR';
export const USER_ADD_SUCCESS: string = 'USER_ADD_SUCCESS';
export const USER_ADD_RELATION: string = 'USER_ADD_RELATION';
export const USER_AUTHENTICATION_UPDATE: string = 'USER_AUTHENTICATION_UPDATE';
export const USER_FORGOT_ERROR: string = 'USER_FORGOT_ERROR';
export const USER_FORGOT_SUCCESS: string = 'USER_FORGOT_SUCCESS';
export const USER_GET_DETAILS_SUCCESS: string = 'USER_GET_DETAILS_SUCCESS';
export const USER_GET_LIST_ERROR: string = 'USER_GET_LIST_ERROR';
export const USER_GET_LIST_SUCCESS: string = 'USER_GET_LIST_SUCCESS';
export const USER_GET_SESSION_ERROR: string = 'USER_GET_SESSION_ERROR';
export const USER_GET_SESSION_SUCCESS: string = 'USER_GET_SESSION_SUCCESS';
export const USER_GET_USER_ERROR: string = 'USER_GET_USER_ERROR';
export const USER_HAS_USER_REACTIONS: string = 'USER_HAS_USER_REACTIONS';
export const USER_REMOVE_RELATION: string = 'USER_REMOVE_RELATION';
export const USER_RECOVERY_ERROR: string = 'USER_RECOVERY_ERROR';
export const USER_RECOVERY_SUCCESS: string = 'USER_RECOVERY_SUCCESS';
export const USER_RESEND_CODE_ERROR: string = 'USER_RESEND_CODE_ERROR';
export const USER_RESEND_CODE_SUCCESS: string = 'USER_RESEND_CODE_SUCCESS';
export const USER_SESSION_UPDATE_ERROR: string = 'USER_SESSION_UPDATE_ERROR';
export const USER_SIGNIN_ERROR: string = 'USER_SIGNIN_ERROR';
export const USER_SIGNIN_SUCCESS: string = 'USER_SIGNIN_SUCCESS';
export const USER_SIGNOUT_ERROR: string = 'USER_SIGNOUT_ERROR';
export const USER_SIGNOUT_SUCCESS: string = 'USER_SIGNOUT_SUCCESS';
export const USER_UPDATE_ERROR: string = 'USER_UPDATE_ERROR';
export const USER_UPDATE_SUCCESS: string = 'USER_UPDATE_SUCCESS';
export const USER_VERIFY_SUCCESS: string = 'USER_VERIFY_SUCCESS';
export const USER_VERIFY_ERROR: string = 'USER_VERIFY_ERROR';

const defaultValues: any = {
  likes: [],
  lists: {},
  session: {},
  users: {}
};

export const countFieldMap = {
  like: 'likeCount',
  view: 'viewCount'
};

export const userStore = (type: string, data, state = defaultValues): any => {
  switch(type) {
    case REACTION_ADD_SUCCESS:
    case REACTION_DELETE_SUCCESS: {
      const {itemId, itemType, reaction} = data;

      if(itemType !== 'users') {
        return state;
      }

      const {users} = state;
      const {name: reactionName, value: reactionValue} = reaction;
      const value: boolean = reactionValue === 'true';

      users[itemId][`has${capitalize(reactionName)}`] = value;

      if(reactionName !== 'view') {
        const countField: string = countFieldMap[reactionName];
        users[itemId][countField] = value ? users[itemId][countField] + 1 : users[itemId][countField] - 1;
      }

      return {...state, users};
    }
    case SESSION_UPDATE_SUCCESS: {
      const {session} = data;
      return {...state, session: {...state.session, ...session.toJson()}};
    }
    case TAG_ADD_PROFILE_SUCCESS: {
      const {tag} = data;
      const {session = {}} = state;
      const {tags = []} = session;
      const updatedTags = uniqBy([...tags, tag], 'tagId');
      session.tags = orderBy(updatedTags, 'name', 'asc');
      return {...state, session};
    }
    case TAG_DELETE_PROFILE_SUCCESS: {
      const {tag} = data;
      const {session = {}} = state;
      const {tags = []} = session;
      session.tags = pullAllBy(tags, [tag], 'tagId');
      return {...state, session};
    }
    case USER_GET_DETAILS_SUCCESS: {
      const {user} = data;
      const {users} = state;
      users[user.userId] = {...user.toJson(), timestamp: Date.now()};
      return {...state, users};
    }
    case USER_GET_LIST_SUCCESS: {
      const {list: newList} = data;
      const {users} = state;

      // Cache list into user details
      newList.forEach((user) => {
        const cachedUser = users[user.userId] || {};
        users[user.userId] = {...cachedUser, ...user.toJson()};
      });
      return {...state, users};
    }
    case USER_SIGNIN_ERROR: {
      const {username} = state.session;
      return {...state, session: {username}};
    }
    case USER_SIGNIN_SUCCESS: {
      const {session} = data;
      return {...state, lists: [], session, users: {}};
    }
    case USER_RESEND_CODE_ERROR: {
      const {session} = data;
      return {...state, session: {...state.session, ...session.toJson()}};
    }
    case USER_RESEND_CODE_SUCCESS: {
      const {session} = data;
      return {...state, session: {...state.session, ...session.toJson()}};
    }
    case USER_SESSION_UPDATE_ERROR: {
      return {...state, session: {}};
    }
    case USER_UPDATE_SUCCESS: {
      const {user} = data;
      const {session, users} = state;
      return {...state, session: {...session, ...user.toJson()}, users: {...users, [user.userId]: user.toJson()}};
    }
    default: {
      return state;
    }
  }
};
