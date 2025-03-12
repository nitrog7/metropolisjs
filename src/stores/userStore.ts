/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import capitalize from 'lodash/capitalize';
import orderBy from 'lodash/orderBy';
import pullAllBy from 'lodash/pullAllBy';
import uniqBy from 'lodash/uniqBy';

import {ReactionConstants} from './reactionStore';
import {TagConstants} from './tagStore';

import type {Reaction, User} from '../adapters';
import type {Persona} from '../adapters/Persona';

export class UserConstants {
  static readonly ADD_ITEM_ERROR: string = 'USER_ADD_ITEM_ERROR';
  static readonly ADD_ITEM_SUCCESS: string = 'USER_ADD_ITEM_SUCCESS';
  static readonly ADD_RELATION_ERROR: string = 'USER_ADD_RELATION_ERROR';
  static readonly ADD_RELATION_SUCCESS: string = 'USER_ADD_RELATION_SUCCESS';
  static readonly AUTHENTICATION_UPDATE: string = 'USER_AUTHENTICATION_UPDATE';
  static readonly CONFIRM_SIGN_UP_ERROR: string = 'USER_CONFIRM_SIGN_UP_ERROR';
  static readonly CONFIRM_SIGN_UP_SUCCESS: string = 'USER_CONFIRM_SIGN_UP_SUCCESS';
  static readonly FORGOT_PASSWORD_ERROR: string = 'USER_FORGOT_PASSWORD_ERROR';
  static readonly FORGOT_PASSWORD_SUCCESS: string = 'USER_FORGOT_PASSWORD_SUCCESS';
  static readonly GET_DETAILS_SUCCESS: string = 'USER_GET_DETAILS_SUCCESS';
  static readonly GET_LIST_ERROR: string = 'USER_GET_LIST_ERROR';
  static readonly GET_LIST_SUCCESS: string = 'USER_GET_LIST_SUCCESS';
  static readonly GET_SESSION_ERROR: string = 'USER_GET_SESSION_ERROR';
  static readonly GET_SESSION_SUCCESS: string = 'USER_GET_SESSION_SUCCESS';
  static readonly GET_USER_ERROR: string = 'USER_GET_USER_ERROR';
  static readonly GET_USER_SUCCESS: string = 'USER_GET_USER_SUCCESS';
  static readonly HAS_USER_REACTIONS: string = 'USER_HAS_USER_REACTIONS';
  static readonly REMOVE_RELATION: string = 'USER_REMOVE_RELATION';
  static readonly RECOVERY_ERROR: string = 'USER_RECOVERY_ERROR';
  static readonly RECOVERY_SUCCESS: string = 'USER_RECOVERY_SUCCESS';
  static readonly REMOVE_ITEM_ERROR: string = 'USER_REMOVE_ITEM_ERROR';
  static readonly REMOVE_ITEM_SUCCESS: string = 'USER_REMOVE_ITEM_SUCCESS';
  static readonly RESEND_CODE_ERROR: string = 'USER_RESEND_CODE_ERROR';
  static readonly RESEND_CODE_SUCCESS: string = 'USER_RESEND_CODE_SUCCESS';
  static readonly RESET_PASSWORD_ERROR: string = 'USER_RESET_PASSWORD_ERROR';
  static readonly RESET_PASSWORD_SUCCESS: string = 'USER_RESET_PASSWORD_SUCCESS';
  static readonly SIGN_IN_ERROR: string = 'USER_SIGN_IN_ERROR';
  static readonly SIGN_IN_SUCCESS: string = 'USER_SIGN_IN_SUCCESS';
  static readonly SIGN_OUT_ERROR: string = 'USER_SIGN_OUT_ERROR';
  static readonly SIGN_OUT_SUCCESS: string = 'USER_SIGN_OUT_SUCCESS';
  static readonly UPDATE_ACCOUNT_ERROR: string = 'USER_UPDATE_ACCOUNT_ERROR';
  static readonly UPDATE_ACCOUNT_SUCCESS: string = 'USER_UPDATE_ACCOUNT_SUCCESS';
  static readonly UPDATE_PERSONA_ERROR: string = 'USER_UPDATE_PERSONA_ERROR';
  static readonly UPDATE_PERSONA_SUCCESS: string = 'USER_UPDATE_PERSONA_SUCCESS';
  static readonly UPDATE_SESSION_ERROR: string = 'USER_UPDATE_SESSION_ERROR';
  static readonly UPDATE_SESSION_SUCCESS: string = 'USER_UPDATE_SESSION_SUCCESS';
  static readonly VERIFY_SUCCESS: string = 'USER_VERIFY_SUCCESS';
  static readonly VERIFY_ERROR: string = 'USER_VERIFY_ERROR';
};

interface UserState {
  likes: string[];
  lists: Record<string, unknown>;
  session: Partial<User>;
  users: Record<string, Partial<User>>;
}

export const defaultValues: UserState = {
  likes: [],
  lists: {},
  session: {},
  users: {}
};

export const countFieldMap = {
  like: 'likeCount',
  view: 'viewCount'
};

interface UserData {
  readonly itemId?: string;
  readonly itemType?: string;
  readonly list?: User[];
  readonly persona?: Persona;
  readonly reaction?: Reaction;
  readonly session?: User;
  readonly tag?: Record<string, unknown>;
  readonly user?: User;
}

export const userStore = (type: string, data: UserData, state = defaultValues): UserState => {
  switch(type) {
    case ReactionConstants.ADD_ITEM_SUCCESS:
    case ReactionConstants.REMOVE_ITEM_SUCCESS: {
      const {itemId, itemType, reaction} = data;

      if(itemType !== 'users') {
        return state;
      }

      const {users} = state;
      const {name: reactionName, value: reactionValue} = reaction;
      const value: boolean = reactionValue === 'true';

      users[itemId][`has${capitalize(reactionName)}`] = value;

      if(reactionName !== 'view') {
        const countField: keyof typeof countFieldMap = reactionName as keyof typeof countFieldMap;
        const field = countFieldMap[countField];
        users[itemId][field] = value ? (users[itemId][field] as number || 0) + 1 : (users[itemId][field] as number || 0) - 1;
      }

      return {...state, users};
    }
    case UserConstants.UPDATE_SESSION_SUCCESS: {
      const {user} = data;
      return {...state, session: {...state.session, ...user}};
    }
    case TagConstants.ADD_PROFILE_SUCCESS: {
      const {tag} = data;
      const {session = {}} = state;
      const {tags = []} = session;
      const updatedTags = uniqBy([...tags, tag], 'tagId');
      session.tags = orderBy(updatedTags, 'name', 'asc');
      return {...state, session};
    }
    case TagConstants.REMOVE_PROFILE_SUCCESS: {
      const {tag} = data;
      const {session = {}} = state;
      const {tags = []} = session;
      session.tags = pullAllBy(tags, [tag], 'tagId');
      return {...state, session};
    }
    case UserConstants.ADD_ITEM_SUCCESS: {
      const {user} = data;
      const {users} = state;
      users[user.userId] = {...user.toJson(), timestamp: Date.now()};
      return {...state, users, session: user};
    }
    case UserConstants.GET_DETAILS_SUCCESS: {
      const {user} = data;
      const {users} = state;
      users[user.userId] = {...user.toJson(), timestamp: Date.now()};
      return {...state, users};
    }
    case UserConstants.GET_LIST_SUCCESS: {
      const {list} = data;
      const {users} = state;

      list.forEach((user: User) => {
        const cachedUser: Partial<User> = users[user.userId] || {};
        users[user.userId] = {...cachedUser, ...user.toJson()};
      });
      return {...state, users};
    }
    case UserConstants.SIGN_IN_ERROR: {
      const {username} = state.session;
      return {...state, session: {username}};
    }
    case UserConstants.SIGN_IN_SUCCESS: {
      const {session} = data;
      return {...state, lists: {}, session, users: {}};
    }
    case UserConstants.RESEND_CODE_ERROR: {
      const {session} = data;
      return {...state, session: {...state.session, ...session.toJson()}};
    }
    case UserConstants.RESEND_CODE_SUCCESS: {
      const {session} = data;
      return {...state, session: {...state.session, ...session.toJson()}};
    }
    case UserConstants.GET_SESSION_SUCCESS: {
      const {session} = data;
      return {...state, session: {...state.session, ...session}};
    }
    case UserConstants.UPDATE_ACCOUNT_SUCCESS: {
      const {user} = data;
      const {session, users} = state;
      return {...state, session: {...session, ...user.toJson()}, users: {...users, [user.userId]: user.toJson()}};
    }
    case UserConstants.UPDATE_PERSONA_SUCCESS: {
      const {persona} = data;
      const {session} = state;
      return {...state, session: {...session, ...persona.toJson()}};
    }
    default: {
      return state;
    }
  }
};
