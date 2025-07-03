/**
 * Copyright (c) 2021-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {DateTime} from 'luxon';

import type {TagType} from '../adapters/tagAdapter';

export class TagConstants {
  static readonly ADD_ITEM_ERROR: string = 'TAG_ADD_ITEM_ERROR';
  static readonly ADD_ITEM_SUCCESS: string = 'TAG_ADD_ITEM_SUCCESS';
  static readonly ADD_PROFILE_ERROR: string = 'TAG_ADD_PROFILE_ERROR';
  static readonly ADD_PROFILE_SUCCESS: string = 'TAG_ADD_PROFILE_SUCCESS';
  static readonly GET_LIST_ERROR: string = 'TAG_GET_LIST_ERROR';
  static readonly GET_LIST_SUCCESS: string = 'TAG_GET_LIST_SUCCESS';
  static readonly REMOVE_ITEM_ERROR: string = 'TAG_REMOVE_ITEM_ERROR';
  static readonly REMOVE_ITEM_SUCCESS: string = 'TAG_REMOVE_ITEM_SUCCESS';
  static readonly REMOVE_PROFILE_ERROR: string = 'TAG_REMOVE_PROFILE_ERROR';
  static readonly REMOVE_PROFILE_SUCCESS: string = 'TAG_REMOVE_PROFILE_SUCCESS';
  static readonly UPDATE_ITEM_ERROR: string = 'TAG_UPDATE_ITEM_ERROR';
  static readonly UPDATE_ITEM_SUCCESS: string = 'TAG_UPDATE_ITEM_SUCCESS';
}

interface TagState {
  expires: number;
  list: TagType[];
}

export const defaultValues: TagState = {
  expires: Date.now(),
  list: []
};

export const tags = (type: string, data: {tags?: TagState['list']}, state = defaultValues): TagState => {
  switch(type) {
    case TagConstants.GET_LIST_SUCCESS: {
      const {tags = []} = data;
      const expires: number = DateTime.local().plus({hours: 24}).toMillis();
      return {...state, expires, list: tags};
    }
    default: {
      return state;
    }
  }
};
