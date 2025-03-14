/**
 * Copyright (c) 2021-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {useFlux} from '@nlabs/arkhamjs-utils-react';
import React, {useEffect, useState} from 'react';

import {WebsocketActions} from './actions/WebsocketActions';
import {Config, MetropolisConfiguration} from './config';
import {
  appStore,
  eventStore,
  imageStore,
  locationStore,
  messageStore,
  postStore,
  tagStore,
  userStore,
  websocketStore
} from './stores';
import {refreshSession} from './utils/api';
import {MetropolisAdapters, MetropolisContext} from './utils/MetropolisProvider';

import type {FluxFramework} from '@nlabs/arkhamjs';
import type {ReactElement} from 'react';

export {MetropolisConfiguration} from './config';
export * from './adapters';
export * from './actions';
export * from './stores';
export {useMetropolis} from './utils/useMetropolis';

export const onInit = (flux: FluxFramework) => {
  try {
    flux.addStores([
      appStore,
      eventStore,
      imageStore,
      locationStore,
      messageStore,
      postStore,
      tagStore,
      userStore,
      websocketStore
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

export * from './utils/api';
export interface MetropolisProps {
  readonly adapters?: MetropolisAdapters;
  readonly children?: React.ReactElement | React.ReactElement[];
  readonly config?: MetropolisConfiguration;
}

export const Metropolis = ({adapters, children, config = {}}: MetropolisProps): ReactElement => {
  Config.setConfig(config);
  console.log('Metropolis::init', {config});
  const flux = useFlux();
  const websockets = new WebsocketActions(flux);
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
