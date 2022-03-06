/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
export const EVENT_ADD_ERROR: string = 'EVENT_ADD_ERROR';
export const EVENT_ADD_SUCCESS: string = 'EVENT_ADD_SUCCESS';
export const EVENT_GET_ERROR: string = 'EVENT_GET_ERROR';
export const EVENT_GET_SUCCESS: string = 'EVENT_GET_SUCCESS';
export const EVENT_GET_LIST_ERROR: string = 'EVENT_GET_LIST_ERROR';
export const EVENT_GET_LIST_SUCCESS: string = 'EVENT_GET_LIST_SUCCESS';
export const EVENT_REMOVE_ERROR: string = 'EVENT_REMOVE_ERROR';
export const EVENT_REMOVE_SUCCESS: string = 'EVENT_REMOVE_SUCCESS';
export const EVENT_UPDATE_ERROR: string = 'EVENT_UPDATE_ERROR';
export const EVENT_UPDATE_SUCCESS: string = 'EVENT_UPDATE_SUCCESS';

const defaultValues: any = {
  lists: {}
};

export const eventStore = (type: string, data, state = defaultValues): any => {
  switch(type) {
    case EVENT_GET_LIST_SUCCESS: {
      const {list, type = 'default'} = data;
      const {lists} = state;

      lists[type] = list.map((event) => event.toJson());
      return {...state, lists};
    }
    default: {
      return state;
    }
  }
};
