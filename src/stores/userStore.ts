/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import capitalize from 'lodash/capitalize';
import orderBy from 'lodash/orderBy';
import pullAllBy from 'lodash/pullAllBy';
import uniqBy from 'lodash/uniqBy';

import {REACTION_CONSTANTS} from './reactionStore';
import {TAG_CONSTANTS} from './tagStore';

import type {ReactionType, User} from '../adapters';
import type {PersonaType} from '../adapters/personaAdapter/personaAdapter';

export const USER_CONSTANTS = {
  ADD_ITEM_ERROR: 'USER_ADD_ITEM_ERROR',
  ADD_ITEM_SUCCESS: 'USER_ADD_ITEM_SUCCESS',
  ADD_RELATION_ERROR: 'USER_ADD_RELATION_ERROR',
  ADD_RELATION_SUCCESS: 'USER_ADD_RELATION_SUCCESS',
  AUTHENTICATION_UPDATE: 'USER_AUTHENTICATION_UPDATE',
  CONFIRM_SIGN_UP_ERROR: 'USER_CONFIRM_SIGN_UP_ERROR',
  CONFIRM_SIGN_UP_SUCCESS: 'USER_CONFIRM_SIGN_UP_SUCCESS',
  FORGOT_PASSWORD_ERROR: 'USER_FORGOT_PASSWORD_ERROR',
  FORGOT_PASSWORD_SUCCESS: 'USER_FORGOT_PASSWORD_SUCCESS',
  GET_DETAILS_SUCCESS: 'USER_GET_DETAILS_SUCCESS',
  GET_LIST_ERROR: 'USER_GET_LIST_ERROR',
  GET_LIST_SUCCESS: 'USER_GET_LIST_SUCCESS',
  GET_SESSION_ERROR: 'USER_GET_SESSION_ERROR',
  GET_SESSION_SUCCESS: 'USER_GET_SESSION_SUCCESS',
  GET_ITEM_ERROR: 'USER_GET_ITEM_ERROR',
  GET_ITEM_SUCCESS: 'USER_GET_ITEM_SUCCESS',
  HAS_USER_REACTIONS: 'USER_HAS_USER_REACTIONS',
  REMOVE_RELATION: 'USER_REMOVE_RELATION',
  RECOVERY_ERROR: 'USER_RECOVERY_ERROR',
  RECOVERY_SUCCESS: 'USER_RECOVERY_SUCCESS',
  REMOVE_ITEM_ERROR: 'USER_REMOVE_ITEM_ERROR',
  REMOVE_ITEM_SUCCESS: 'USER_REMOVE_ITEM_SUCCESS',
  RESEND_CODE_ERROR: 'USER_RESEND_CODE_ERROR',
  RESEND_CODE_SUCCESS: 'USER_RESEND_CODE_SUCCESS',
  RESET_PASSWORD_ERROR: 'USER_RESET_PASSWORD_ERROR',
  RESET_PASSWORD_SUCCESS: 'USER_RESET_PASSWORD_SUCCESS',
  SIGN_IN_ERROR: 'USER_SIGN_IN_ERROR',
  SIGN_IN_SUCCESS: 'USER_SIGN_IN_SUCCESS',
  SIGN_OUT_ERROR: 'USER_SIGN_OUT_ERROR',
  SIGN_OUT_SUCCESS: 'USER_SIGN_OUT_SUCCESS',
  UPDATE_ITEM_ERROR: 'USER_UPDATE_ITEM_ERROR',
  UPDATE_ITEM_SUCCESS: 'USER_UPDATE_ITEM_SUCCESS',
  UPDATE_PERSONA_ERROR: 'USER_UPDATE_PERSONA_ERROR',
  UPDATE_PERSONA_SUCCESS: 'USER_UPDATE_PERSONA_SUCCESS',
  UPDATE_SESSION_ERROR: 'USER_UPDATE_SESSION_ERROR',
  UPDATE_SESSION_SUCCESS: 'USER_UPDATE_SESSION_SUCCESS',
  VERIFY_SUCCESS: 'USER_VERIFY_SUCCESS',
  VERIFY_ERROR: 'USER_VERIFY_ERROR',
  SIGN_UP_SUCCESS: 'USER_SIGN_UP_SUCCESS',
  SIGN_UP_ERROR: 'USER_SIGN_UP_ERROR'
} as const;

export type UserConstantsType = typeof USER_CONSTANTS[keyof typeof USER_CONSTANTS];

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
  readonly persona?: PersonaType;
  readonly reaction?: ReactionType;
  readonly session?: User;
  readonly tag?: Record<string, unknown>;
  readonly user?: User;
}

export const userStore = (type: string, data: UserData, state = defaultValues): UserState => {
  switch(type) {
    case REACTION_CONSTANTS.ADD_ITEM_SUCCESS:
    case REACTION_CONSTANTS.REMOVE_ITEM_SUCCESS: {
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
    case USER_CONSTANTS.UPDATE_SESSION_SUCCESS: {
      const {user} = data;
      return {...state, session: {...state.session, ...user}};
    }
    case TAG_CONSTANTS.ADD_PROFILE_SUCCESS: {
      const {tag} = data;
      const {session = {}} = state;
      const {tags = []} = session;
      const updatedTags = uniqBy([...tags, tag], 'tagId');
      session.tags = orderBy(updatedTags, 'name', 'asc');
      return {...state, session};
    }
    case TAG_CONSTANTS.REMOVE_PROFILE_SUCCESS: {
      const {tag} = data;
      const {session = {}} = state;
      const {tags = []} = session;
      session.tags = pullAllBy(tags, [tag], 'tagId');
      return {...state, session};
    }
    case USER_CONSTANTS.ADD_ITEM_SUCCESS: {
      const {user} = data;
      const {users} = state;
      users[user.userId] = {...user.toJson(), timestamp: Date.now()};
      return {...state, users, session: user};
    }
    case USER_CONSTANTS.GET_DETAILS_SUCCESS: {
      const {user} = data;
      const {users} = state;
      users[user.userId] = {...user.toJson(), timestamp: Date.now()};
      return {...state, users};
    }
    case USER_CONSTANTS.GET_LIST_SUCCESS: {
      const {list} = data;
      const {users} = state;

      list.forEach((user: User) => {
        const cachedUser: Partial<User> = users[user.userId] || {};
        users[user.userId] = {...cachedUser, ...user.toJson()};
      });
      return {...state, users};
    }
    case USER_CONSTANTS.SIGN_IN_ERROR: {
      const {username} = state.session;
      return {...state, session: {username}};
    }
    case USER_CONSTANTS.SIGN_IN_SUCCESS: {
      const {session} = data;
      return {...state, lists: {}, session, users: {}};
    }
    case USER_CONSTANTS.RESEND_CODE_ERROR: {
      const {session} = data;
      return {...state, session: {...state.session, ...session.toJson()}};
    }
    case USER_CONSTANTS.RESEND_CODE_SUCCESS: {
      const {session} = data;
      return {...state, session: {...state.session, ...session.toJson()}};
    }
    case USER_CONSTANTS.GET_SESSION_SUCCESS: {
      const {session} = data;
      return {...state, session: {...state.session, ...session}};
    }
    case USER_CONSTANTS.UPDATE_ITEM_SUCCESS: {
      const {user} = data;
      const {session, users} = state;
      return {...state, session: {...session, ...user.toJson()}, users: {...users, [user.userId]: user.toJson()}};
    }
    case USER_CONSTANTS.UPDATE_PERSONA_SUCCESS: {
      const {persona} = data;
      const {session} = state;
      return {...state, session: {...session, ...persona.toJson()}};
    }
    default: {
      return state;
    }
  }
};

export const users = {
  action: userStore,
  name: 'user',
  initialState: defaultValues
};