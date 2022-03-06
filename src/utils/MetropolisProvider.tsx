/**
 * Copyright (c) 2021-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import React, {createContext} from 'react';

export interface MetropolisProviderProps {
  readonly children?: any;
  readonly isAuth?: () => boolean;
  readonly messages?: any[];
  readonly notifications?: any[];
  readonly session?: any;
  readonly updateMessage: (message: any) => any;
  readonly updateNotification: (notification: any) => any;
}

const isAuth = () => true;

export const MetropolisContext = createContext({
  isAuth,
  messages: [],
  notifications: [],
  session: {},
  updateMessage: (message) => message,
  updateNotification: (notification) => notification
});

export const MetropolisProvider = ({
  children,
  isAuth,
  messages,
  notifications,
  session,
  updateMessage,
  updateNotification
}: MetropolisProviderProps) => (
  <MetropolisContext.Provider
    value={{
      isAuth,
      messages,
      session,
      notifications,
      updateMessage,
      updateNotification
    }}>
    {children}
  </MetropolisContext.Provider>
);
