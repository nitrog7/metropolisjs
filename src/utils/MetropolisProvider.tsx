/**
 * Copyright (c) 2021-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import React, {createContext} from 'react';

import {parseEvent, parseImage, parseLocation, parseMessage, parsePost, parseReaction, parseTag, parseUser} from '../adapters';

import type {MessageType} from '../adapters';
import type {SessionType} from './api';

export interface MetropolisAdapters {
  readonly Event?: typeof parseEvent;
  readonly Image?: typeof parseImage;
  readonly Location?: typeof parseLocation;
  readonly Message?: typeof parseMessage;
  readonly Post?: typeof parsePost;
  readonly Reaction?: typeof parseReaction;
  readonly Tag?: typeof parseTag;
  readonly User?: typeof parseUser;
}

export interface MetropolisProviderProps {
  readonly children?: React.ReactElement | React.ReactElement[];
  readonly adapters?: MetropolisAdapters;
  readonly isAuth?: () => boolean;
  readonly messages?: MessageType[];
  readonly notifications?: Notification[];
  readonly session?: SessionType;
  readonly updateMessage: (message: MessageType) => void;
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
