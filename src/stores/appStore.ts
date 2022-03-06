/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
export const API_NETWORK_ERROR: string = 'API_NETWORK_ERROR';
export const API_NETWORK_SUCCESS: string = 'API_NETWORK_SUCCESS';

const defaultValues: any = {};

export const appStore = (type: string, data, state = defaultValues): any => {
  switch(type) {
    default: {
      return state;
    }
  }
};
