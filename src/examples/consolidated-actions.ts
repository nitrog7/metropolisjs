/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

import {
    createAction,
    createActions,
    createAllActions,
    type ActionType
} from '../utils/actionFactory';

import type { FluxFramework } from '@nlabs/arkhamjs';
import type { PostActions } from '../actions/postActions';
import type { userActions } from '../actions/userActions';
import type { WebsocketActions } from '../actions/websocketActions';


/**
 * Example demonstrating the new consolidated action API.
 * This replaces all individual createXxxActions functions with a unified interface.
 */

// Example 1: Create a single action type
export const exampleSingleAction = (flux: FluxFramework) => {
  // Create user actions with custom adapter
  const userActions = createAction('user', flux, {
    userAdapter: (input: any) => {
      // Custom validation logic
      if(input.email && !input.email.includes('@')) {
        throw new Error('Invalid email format');
      }
      return input;
    },
    userAdapterOptions: {
      strict: true,
      environment: 'production'
    }
  }) as userActions;

  // Use the actions
  return userActions.signUp({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'secure123'
  });
};

// Example 2: Create multiple action types
export const exampleMultipleActions = (flux: FluxFramework) => {
  // Create user, post, and message actions
  const actions = createActions(['user', 'post', 'message'], flux, {
    user: {
      userAdapterOptions: {strict: true}
    },
    post: {
      postAdapter: (input: any) => {
        if(input.content && input.content.length > 1000) {
          throw new Error('Post content too long');
        }
        return input;
      }
    }
  });

  // Use the actions with proper type assertions
  return Promise.all([
    (actions.user as userActions).signUp({username: 'jane_doe', email: 'jane@example.com'}),
    (actions.post as PostActions).add({content: 'Hello world!', name: 'My First Post'}),
    actions.message.sendMessage({content: 'Hi there!', recipientId: '123'})
  ]);
};

// Example 3: Create all actions
export const exampleAllActions = (flux: FluxFramework) => {
  // Create all available action types
  const allActions = createAllActions(flux, {
    user: {userAdapterOptions: {strict: true}},
    post: {postAdapterOptions: {environment: 'production'}},
    image: {imageAdapterOptions: {allowPartial: true}}
  });

  // Use any action type
  return {
    user: allActions.user,
    post: allActions.post,
    event: allActions.event,
    message: allActions.message,
    image: allActions.image,
    location: allActions.location,
    reaction: allActions.reaction,
    tag: allActions.tag,
    websocket: allActions.websocket
  };
};

// Example 4: Type-safe action creation
export const exampleTypeSafeActions = (flux: FluxFramework) => {
  // TypeScript will provide full type safety
  const userActions = createAction('user', flux) as userActions;
  const postActions = createAction('post', flux) as PostActions;
  const websocketActions = createAction('websocket', flux) as WebsocketActions;

  // All methods are properly typed
  return {
    signUp: userActions.signUp,
    addPost: postActions.add,
    initWebsocket: websocketActions.wsInit
  };
};

// Example 5: Runtime adapter updates
export const exampleRuntimeUpdates = (flux: FluxFramework) => {
  const userActions = createAction('user', flux) as userActions;

  // Update adapter at runtime
  userActions.updateUserAdapter((input: any) => {
    // New validation logic
    if(input.username && input.username.length < 3) {
      throw new Error('Username too short');
    }
    return input;
  });

  // Update options at runtime
  userActions.updateUserAdapterOptions({
    strict: true,
    environment: 'development'
  });

  return userActions;
};

// Example 6: Error handling with consolidated actions
export const exampleErrorHandling = async (flux: FluxFramework) => {
  try {
    const userActions = createAction('user', flux, {
      userAdapter: (input: any) => {
        if(!input.email) {
          throw new Error('Email is required');
        }
        return input;
      }
    }) as userActions;

    await userActions.signUp({
      username: 'test_user'
      // Missing email will trigger validation error
    });
  } catch(error) {
    console.error('Validation failed:', error.message);
  }
};

// Example 7: Conditional action creation
export const exampleConditionalActions = (flux: FluxFramework, features: string[]) => {
  const actionTypes: ActionType[] = ['user']; // Always include user

  // Conditionally add other action types based on features
  if(features.includes('posts')) {
    actionTypes.push('post');
  }
  if(features.includes('messaging')) {
    actionTypes.push('message');
  }
  if(features.includes('websocket')) {
    actionTypes.push('websocket');
  }

  return createActions(actionTypes, flux);
};

// Example 8: Action composition
export const exampleActionComposition = (flux: FluxFramework) => {
  const userActions = createAction('user', flux) as userActions;
  const postActions = createAction('post', flux) as PostActions;

  // Compose actions together
  const createUserWithPost = async (userData: any, postData: any) => {
    const user = await userActions.signUp(userData);
    const post = await postActions.add({
      ...postData,
      userId: user.userId
    });
    return {user, post};
  };

  return createUserWithPost;
};