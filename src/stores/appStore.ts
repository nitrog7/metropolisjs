/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

export class AppConstants {
  static readonly API_NETWORK_ERROR: string = 'APP_API_NETWORK_ERROR';
  static readonly API_NETWORK_SUCCESS: string = 'APP_API_NETWORK_SUCCESS';
}

interface AppState {
  network?: {
    error?: Error;
    status?: boolean;
  };
}

export const defaultValues: AppState = {};

export const app = (type: string, data: Partial<AppState>, state = defaultValues): AppState => {
  switch(type) {
    default: {
      return state;
    }
  }
};
