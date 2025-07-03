/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import type {EventType} from '../adapters/eventAdapter';

export class EventConstants {
  static readonly ADD_ITEM_ERROR: string = 'EVENT_ADD_ITEM_ERROR';
  static readonly ADD_ITEM_SUCCESS: string = 'EVENT_ADD_ITEM_SUCCESS';
  static readonly GET_ITEM_ERROR: string = 'EVENT_GET_ITEM_ERROR';
  static readonly GET_ITEM_SUCCESS: string = 'EVENT_GET_ITEM_SUCCESS';
  static readonly GET_LIST_ERROR: string = 'EVENT_GET_LIST_ERROR';
  static readonly GET_LIST_SUCCESS: string = 'EVENT_GET_LIST_SUCCESS';
  static readonly REMOVE_ITEM_ERROR: string = 'EVENT_REMOVE_ITEM_ERROR';
  static readonly REMOVE_ITEM_SUCCESS: string = 'EVENT_REMOVE_ITEM_SUCCESS';
  static readonly UPDATE_ITEM_ERROR: string = 'EVENT_UPDATE_ITEM_ERROR';
  static readonly UPDATE_ITEM_SUCCESS: string = 'EVENT_UPDATE_ITEM_SUCCESS';
}

interface EventState {
  lists: Record<string, Record<string, unknown>[]>;
}

export const defaultValues: EventState = {
  lists: {}
};

export const events = (type: string, data: {
  list?: EventType[];
  type?: string;
}, state = defaultValues): EventState => {
  switch(type) {
    case EventConstants.GET_LIST_SUCCESS: {
      const {list, type = 'default'} = data;
      const {lists} = state;

      lists[type] = list.map((event) => event);
      return {...state, lists};
    }
    default: {
      return state;
    }
  }
};
