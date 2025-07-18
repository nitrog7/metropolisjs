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
import {createProfileActions} from '../actions/profileActions/profileActions';
import {createReactionActions} from '../actions/reactionActions/reactionActions';
import {createSSEActions} from '../actions/sseActions/sseActions';
import {createTagActions} from '../actions/tagActions/tagActions';
import {createUserActions} from '../actions/userActions/userActions';
import {createWebsocketActions} from '../actions/websocketActions/websocketActions';

import type {FluxFramework} from '@nlabs/arkhamjs';
import type {EventActionsOptions} from '../actions/eventActions/eventActions';
import type {ImageActionsOptions} from '../actions/imageActions/imageActions';
import type {LocationActionsOptions} from '../actions/locationActions/locationActions';
import type {MessageActionsOptions} from '../actions/messageActions/messageActions';
import type {PostActionsOptions} from '../actions/postActions/postActions';
import type {ProfileActionsOptions} from '../actions/profileActions/profileActions';
import type {ReactionActionsOptions} from '../actions/reactionActions/reactionActions';
import type {SSEActionsOptions} from '../actions/sseActions/sseActions';
import type {TagActionsOptions} from '../actions/tagActions/tagActions';
import type {UserActionsOptions} from '../actions/userActions/userActions';

export type ActionType =
  | 'event'
  | 'image'
  | 'location'
  | 'message'
  | 'post'
  | 'profile'
  | 'reaction'
  | 'sse'
  | 'tag'
  | 'user'
  | 'websocket';

export type ActionOptions =
  | EventActionsOptions
  | ImageActionsOptions
  | LocationActionsOptions
  | MessageActionsOptions
  | PostActionsOptions
  | ProfileActionsOptions
  | ReactionActionsOptions
  | SSEActionsOptions
  | TagActionsOptions
  | UserActionsOptions
  | undefined;

export const createAction = <T extends ActionType>(
  actionType: T,
  flux: FluxFramework,
  options?: ActionOptions
) => {
  switch(actionType) {
    case 'event':
      return createEventActions(flux, options as EventActionsOptions);

    case 'image':
      return createImageActions(flux, options as ImageActionsOptions);

    case 'location':
      return createLocationActions(flux, options as LocationActionsOptions);

    case 'message':
      return createMessageActions(flux, options as MessageActionsOptions);

    case 'post':
      return createPostActions(flux, options as PostActionsOptions);

    case 'profile':
      return createProfileActions(flux, options as ProfileActionsOptions);

    case 'reaction':
      return createReactionActions(flux, options as ReactionActionsOptions);

    case 'sse':
      return createSSEActions(flux, options as SSEActionsOptions);

    case 'tag':
      return createTagActions(flux, options as TagActionsOptions);

    case 'user':
      return createUserActions(flux, options as UserActionsOptions);

    case 'websocket':
      return createWebsocketActions(flux);

    default:
      throw new Error(`Unknown action type: ${actionType}`);
  }
};

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

export const createAllActions = (
  flux: FluxFramework,
  options?: Partial<Record<ActionType, ActionOptions>>
) => {
  const allActionTypes: ActionType[] = [
    'event',
    'image',
    'location',
    'message',
    'post',
    'profile',
    'reaction',
    'sse',
    'tag',
    'user',
    'websocket'
  ];

  return createActions(allActionTypes, flux, options);
};

export type ActionTypes = ReturnType<typeof createAllActions>;
export type ActionReturnType<T extends ActionType> = ReturnType<typeof createAction<T>>;