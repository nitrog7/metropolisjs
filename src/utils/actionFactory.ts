/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */


// Import all action creators
import {createEventActions} from '../actions/eventActions/eventActions';
import {createImageActions} from '../actions/imageActions/imageActions';
import {createLocationActions} from '../actions/locationActions/locationActions';
import {createMessageActions} from '../actions/messageActions/messageActions';
import {createPostActions} from '../actions/postActions/postActions';
import {createReactionActions} from '../actions/reactionActions/reactionActions';
import {createTagActions} from '../actions/tagActions/tagActions';
import {createUserActions} from '../actions/userActions/userActions';
import {createWebsocketActions} from '../actions/websocketActions/websocketActions';

import type {FluxFramework} from '@nlabs/arkhamjs';
import type {EventActionsOptions} from '../actions/eventActions/eventActions';
import type {ImageActionsOptions} from '../actions/imageActions/imageActions';
import type {LocationActionsOptions} from '../actions/locationActions/locationActions';
import type {MessageActionsOptions} from '../actions/messageActions/messageActions';
import type {PostActionsOptions} from '../actions/postActions/postActions';
import type {ReactionActionsOptions} from '../actions/reactionActions/reactionActions';
import type {TagActionsOptions} from '../actions/tagActions/tagActions';
import type {UserActionsOptions} from '../actions/userActions/userActions';

export type ActionType =
  | 'user'
  | 'post'
  | 'event'
  | 'message'
  | 'image'
  | 'location'
  | 'reaction'
  | 'tag'
  | 'websocket';

export type ActionOptions =
  | UserActionsOptions
  | PostActionsOptions
  | EventActionsOptions
  | MessageActionsOptions
  | ImageActionsOptions
  | LocationActionsOptions
  | ReactionActionsOptions
  | TagActionsOptions
  | undefined;

/**
 * Consolidated action factory that creates any action type using a single function.
 * This replaces all individual createXxxActions functions with a unified API.
 *
 * @param actionType - The type of action to create
 * @param flux - The flux framework instance
 * @param options - Options for the specific action type
 * @returns The requested action creator
 *
 * @example
 * // Create user actions
 * const userActions = createAction('user', flux, {
 *   userAdapter: customUserAdapter,
 *   userAdapterOptions: { strict: true }
 * });
 *
 * @example
 * // Create post actions
 * const postActions = createAction('post', flux, {
 *   postAdapter: customPostAdapter
 * });
 *
 * @example
 * // Create websocket actions (no options needed)
 * const websocketActions = createAction('websocket', flux);
 *
 * @example
 * // Use the actions
 * await userActions.signUp(userData);
 * await postActions.add(postData);
 * websocketActions.wsInit();
 */
export const createAction = <T extends ActionType>(
  actionType: T,
  flux: FluxFramework,
  options?: ActionOptions
) => {
  switch(actionType) {
    case 'user':
      return createUserActions(flux, options as UserActionsOptions);

    case 'post':
      return createPostActions(flux, options as PostActionsOptions);

    case 'event':
      return createEventActions(flux, options as EventActionsOptions);

    case 'message':
      return createMessageActions(flux, options as MessageActionsOptions);

    case 'image':
      return createImageActions(flux, options as ImageActionsOptions);

    case 'location':
      return createLocationActions(flux, options as LocationActionsOptions);

    case 'reaction':
      return createReactionActions(flux, options as ReactionActionsOptions);

    case 'tag':
      return createTagActions(flux, options as TagActionsOptions);

    case 'websocket':
      return createWebsocketActions(flux);

    default:
      throw new Error(`Unknown action type: ${actionType}`);
  }
};

/**
 * Creates multiple action types at once with a unified interface.
 * This provides a convenient way to create all needed actions with consistent configuration.
 *
 * @param actionTypes - Array of action types to create
 * @param flux - The flux framework instance
 * @param options - Options for each action type (optional)
 * @returns An object containing the requested action creators
 *
 * @example
 * // Create multiple action types
 * const actions = createActions(['user', 'post', 'message'], flux, {
 *   user: { userAdapterOptions: { strict: true } },
 *   post: { postAdapter: customPostAdapter }
 * });
 *
 * @example
 * // Use the actions
 * await actions.user.signUp(userData);
 * await actions.post.add(postData);
 * await actions.message.sendMessage(messageData);
 */
export const createActions = (
  actionTypes: ActionType[],
  flux: FluxFramework,
  options?: Partial<Record<ActionType, ActionOptions>>
) => {
  const actions: Record<string, any> = {};

  actionTypes.forEach((type) => {
    actions[type] = createAction(type, flux, options?.[type]);
  });

  return actions;
};

/**
 * Creates all available action types with optional configuration.
 * This is useful when you need access to all actions.
 *
 * @param flux - The flux framework instance
 * @param options - Options for each action type (optional)
 * @returns An object containing all action creators
 *
 * @example
 * // Create all actions with default configuration
 * const allActions = createAllActions(flux);
 *
 * @example
 * // Create all actions with custom configuration
 * const allActions = createAllActions(flux, {
 *   user: { userAdapterOptions: { strict: true } },
 *   post: { postAdapter: customPostAdapter }
 * });
 */
export const createAllActions = (
  flux: FluxFramework,
  options?: Partial<Record<ActionType, ActionOptions>>
) => {
  const allActionTypes: ActionType[] = [
    'user',
    'post',
    'event',
    'message',
    'image',
    'location',
    'reaction',
    'tag',
    'websocket'
  ];

  return createActions(allActionTypes, flux, options);
};

/**
 * Type-safe action factory that provides better TypeScript support.
 * This allows for more specific typing when working with individual action types.
 */
export type ActionTypes = ReturnType<typeof createAllActions>;

/**
 * Utility type for getting the return type of a specific action creator.
 */
export type ActionReturnType<T extends ActionType> = ReturnType<typeof createAction<T>>;