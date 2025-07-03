/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import type {Location} from '../adapters';

export class LocationConstants {
  static readonly ADD_ITEM_ERROR: string = 'LOCATION_ADD_ITEM_ERROR';
  static readonly ADD_ITEM_SUCCESS: string = 'LOCATION_ADD_ITEM_SUCCESS';
  static readonly GET_ITEM_ERROR: string = 'LOCATION_GET_ITEM_ERROR';
  static readonly GET_ITEM_SUCCESS: string = 'LOCATION_GET_ITEM_SUCCESS';
  static readonly GET_LIST_ERROR: string = 'LOCATION_GET_LIST_ERROR';
  static readonly GET_LIST_SUCCESS: string = 'LOCATION_GET_LIST_SUCCESS';
  static readonly REMOVE_ITEM_ERROR: string = 'LOCATION_REMOVE_ITEM_ERROR';
  static readonly REMOVE_ITEM_SUCCESS: string = 'LOCATION_REMOVE_ITEM_SUCCESS';
  static readonly SET_CURRENT: string = 'LOCATION_SET_CURRENT';
  static readonly UPDATE_ITEM_ERROR: string = 'LOCATION_UPDATE_ITEM_ERROR';
  static readonly UPDATE_ITEM_SUCCESS: string = 'LOCATION_UPDATE_ITEM_SUCCESS';
}

interface LocationState {
  current: Location | null;
}

export const defaultValues: LocationState = {
  current: null
};

export const locations = (type: string, data: {current?: Location}, state = defaultValues): LocationState => {
  switch(type) {
    case LocationConstants.SET_CURRENT: {
      const {current} = data;
      return {...state, current};
    }
    default: {
      return state;
    }
  }
};
