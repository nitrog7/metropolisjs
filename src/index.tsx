/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {useFlux} from '@nlabs/arkhamjs-utils-react';
import React, {useEffect, useState} from 'react';

import {createWebsocketActions} from './actions/websocketActions/websocketActions';
import {Config, MetropolisConfiguration} from './config';
import {
  app,
  events,
  images,
  locations,
  messages,
  posts,
  tags,
  users,
  websocket
} from './stores';
import {refreshSession} from './utils/api';
import {MetropolisAdapters, MetropolisContext} from './utils/MetropolisProvider';

import type {FluxFramework} from '@nlabs/arkhamjs';
import type {ReactElement} from 'react';

export {MetropolisConfiguration} from './config';

export const onInit = (flux: FluxFramework) => {
  try {
    flux.addStores([
      app,
      events,
      images,
      locations,
      messages,
      posts,
      tags,
      users,
      websocket
    ]);
    const token = flux.getState('user.session.token');
    console.log({token});

    if(token) {
      refreshSession(flux, token);
    }
    // wsInit();
  } catch(error) {
    throw error;
  }
};

export * from './stores';
// Export specific utilities from api to avoid SessionType conflict
export {
  appMutation,
  appQuery,
  publicMutation,
  publicQuery,
  refreshSession,
  uploadImage,
  type ApiResultsType,
  type ReaktorDbCollection
} from './utils/api';

export interface MetropolisProps {
  readonly adapters?: MetropolisAdapters;
  readonly children?: React.ReactElement | React.ReactElement[];
  readonly config?: MetropolisConfiguration;
}

export const Metropolis = ({adapters, children, config = {}}: MetropolisProps): ReactElement => {
  Config.setConfig(config);
  console.log('Metropolis::init', {config});
  const flux = useFlux();
  const websockets = createWebsocketActions(flux);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [session, setSession] = useState({});

  // Save config to app
  // const {isAuth: configAuth} = config;

  // const onUpdateMessages = useCallback(() => {
  //   const cachedSession = Flux.getState('user.session', {});
  //   setMessages(cachedSession);
  // }, []);
  // const onUpdateNotifications = useCallback(() => {
  //   const cachedSession = Flux.getState('user.session', {});
  //   setNotifications(cachedSession);
  // }, []);
  // const onUpdateSession = useCallback(() => {
  //   const cachedSession = Flux.getState('user.session', {});
  //   setSession(cachedSession);
  // }, []);
  // const onSignOut = useCallback(() => {
  //   Flux.setState('user.session', {});
  //   setSession({});
  // }, []);
  // const isAuth = useCallback(() => {
  //   if(configAuth) {
  //     return configAuth();
  //   }

  //   const {userActive} = Flux.getState('user.session', {});
  //   return userActive;
  // }, []);
  // const updateMessage = useCallback((message) => {
  //   API.graphql(graphqlOperation(UPDATE_MESSAGES, {message}));
  // }, []);
  // const updateNotification = useCallback((notification) => {
  //   API.graphql(graphqlOperation(UPDATE_NOTIFICATIONS, {notification}));
  // }, []);

  // useFluxListener(ArkhamConstants.INIT, onUpdateSession);
  // useFluxListener(SIGNOUT, onSignOut);
  // useFluxListener(UPDATE_MESSAGES, onUpdateMessages);
  // useFluxListener(UPDATE_NOTIFICATIONS, onUpdateNotifications);
  // useFluxListener(UPDATE_SESSION, onUpdateSession);

  useEffect(() => {
    // Initialize
    onInit(flux);
    websockets.wsInit();

    // const messageSubscription = API.graphql(graphqlOperation(MessageSubscription))
    //   // @ts-ignore
    //   .subscribe({
    //     next: ({provider, value: messages}) => {
    //       console.log({provider, messages});
    //       Flux.dispatch({type: UPDATE_MESSAGES, messages});
    //     },
    //     error: (error) => console.warn(error)
    //   });
    // const notificationSubscription = API.graphql(graphqlOperation(NotificationSubscription))
    //   // @ts-ignore
    //   .subscribe({
    //     next: ({provider, value: notifications}) => {
    //       console.log({provider, notifications});
    //       Flux.dispatch({type: UPDATE_NOTIFICATIONS, notifications});
    //     },
    //     error: (error) => console.warn(error)
    //   });
    // const sessionSubscription = API.graphql(graphqlOperation(SessionSubscription))
    //   // @ts-ignore
    //   .subscribe({
    //     next: ({provider, value: session}) => {
    //       console.log({provider, session});
    //       Flux.dispatch({type: UPDATE_SESSION, session});
    //     },
    //     error: (error) => console.warn(error)
    //   });

    // return () => {
    //   sessionSubscription.unsubscribe();
    //   messageSubscription.unsubscribe();
    //   notificationSubscription.unsubscribe();
    // };
  }, []);

  return (
    <MetropolisContext.Provider
      value={{
        adapters,
        isAuth: () => true,
        messages,
        notifications,
        session,
        updateMessage: () => { },
        updateNotification: () => { }
      }}>
      {children}
    </MetropolisContext.Provider >
  );
};

export default Metropolis;

export {useMetropolis} from './utils/useMetropolis';

// Export new consolidated action factory (replaces all individual createXxxActions)
export {
  createAction,
  createActions,
  createAllActions, type ActionOptions, type ActionReturnType, type ActionType, type ActionTypes
} from './utils/actionFactory';

// Export new consolidated utilities
export {
  createValidatorFactory,
  createValidatorManager,
  type BaseAdapterOptions
} from './utils/validatorFactory';

export {
  createBaseActions,
  type BaseActionOptions
} from './utils/baseActionFactory';

// Export adapters
export * from './adapters';

// Export stores
export * from './stores';

// Export utilities (excluding api to avoid conflicts)
export * from './utils/app';
export * from './utils/dateUtils';
export * from './utils/file';
export * from './utils/location';

// Export constants
export * from './constants/MetropolisConstants';

// Export GraphQL (excluding session to avoid SessionType conflict)
export * from './graphql/message';
export * from './graphql/notification';

