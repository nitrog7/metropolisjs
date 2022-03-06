/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
export const LOCATION_ADD_ERROR: string = 'LOCATION_ADD_ERROR';
export const LOCATION_ADD_SUCCESS: string = 'LOCATION_ADD_SUCCESS';
export const LOCATION_DELETE_ERROR: string = 'LOCATION_DELETE_ERROR';
export const LOCATION_DELETE_SUCCESS: string = 'LOCATION_DELETE_SUCCESS';
export const LOCATION_GET_DETAILS_ERROR: string = 'LOCATION_GET_DETAILS_ERROR';
export const LOCATION_GET_DETAILS_SUCCESS: string = 'LOCATION_GET_DETAILS_SUCCESS';
export const LOCATION_GET_LIST_ERROR: string = 'LOCATION_GET_LIST_ERROR';
export const LOCATION_GET_LIST_SUCCESS: string = 'LOCATION_GET_LIST_SUCCESS';
export const LOCATION_SET_CURRENT: string = 'LOCATION_SET_CURRENT';
export const LOCATION_UPDATE_ERROR: string = 'LOCATION_UPDATE_ERROR';
export const LOCATION_UPDATE_SUCCESS: string = 'LOCATION_UPDATE_SUCCESS';

const defaultValues: any = {
  current: null
};

export const locationStore = (type: string, data, state = defaultValues): any => {
  switch(type) {
    case LOCATION_SET_CURRENT: {
      const {current} = data;
      return {...state, current};
    }
    default: {
      return state;
    }
  }
};
