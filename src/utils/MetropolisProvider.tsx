/**
 * Copyright (c) 2021-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import React, {createContext} from 'react';

import type {Event, Image, Location, Message, Post, Reaction, Tag, User} from '../adapters';
import type {SessionType} from './api';

export interface MetropolisAdapters {
  readonly Event?: typeof Event;
  readonly Image?: typeof Image;
  readonly Location?: typeof Location;
  readonly Message?: typeof Message;
  readonly Post?: typeof Post;
  readonly Reaction?: typeof Reaction;
  readonly Tag?: typeof Tag;
  readonly User?: typeof User;
}

export interface MetropolisProviderProps {
  readonly children?: React.ReactElement | React.ReactElement[];
  readonly adapters?: MetropolisAdapters;
  readonly isAuth?: () => boolean;
  readonly messages?: Message[];
  readonly notifications?: Notification[];
  readonly session?: SessionType;
  readonly updateMessage: (message: Message) => void;
  readonly updateNotification: (notification: Notification) => void;
}

const isAuth = () => true;

export const MetropolisContext = createContext({
  adapters: undefined,
  isAuth,
  messages: [],
  notifications: [],
  session: {},
  updateMessage: (message) => message,
  updateNotification: (notification) => notification
});

export const MetropolisProvider = ({
  adapters,
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
      adapters,
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
