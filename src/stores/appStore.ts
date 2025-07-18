/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

export const APP_CONSTANTS = {
  API_NETWORK_ERROR: 'APP_API_NETWORK_ERROR',
  API_NETWORK_SUCCESS: 'APP_API_NETWORK_SUCCESS'
} as const;

interface AppState {
  network?: {
    error?: Error;
    status?: boolean;
  };
}

export const defaultValues: AppState = {};

export const appStore = (type: string, data: Partial<AppState>, state = defaultValues): AppState => {
  switch(type) {
    default: {
      return state;
    }
  }
};

export const app = {
  action: appStore,
  initialState: defaultValues,
  name: 'app'
};
