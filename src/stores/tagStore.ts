/**
 * Copyright (c) 2021-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {DateTime} from 'luxon';

export const TAG_ADD_ERROR: string = 'TAG_ADD_ERROR';
export const TAG_ADD_SUCCESS: string = 'TAG_ADD_SUCCESS';
export const TAG_ADD_PROFILE_ERROR: string = 'TAG_ADD_PROFILE_ERROR';
export const TAG_ADD_PROFILE_SUCCESS: string = 'TAG_ADD_PROFILE_SUCCESS';
export const TAG_DELETE_ERROR: string = 'TAG_DELETE_ERROR';
export const TAG_DELETE_SUCCESS: string = 'TAG_DELETE_SUCCESS';
export const TAG_DELETE_PROFILE_ERROR: string = 'TAG_DELETE_PROFILE_ERROR';
export const TAG_DELETE_PROFILE_SUCCESS: string = 'TAG_DELETE_PROFILE_SUCCESS';
export const TAG_GET_LIST_ERROR: string = 'TAG_GET_LIST_ERROR';
export const TAG_GET_LIST_SUCCESS: string = 'TAG_GET_LIST_SUCCESS';
export const TAG_UPDATE_ERROR: string = 'TAG_UPDATE_ERROR';
export const TAG_UPDATE_SUCCESS: string = 'TAG_UPDATE_SUCCESS';

const defaultValues: any = {
  expires: Date.now(),
  list: []
};

export const tagStore = (type: string, data, state = defaultValues): any => {
  switch(type) {
    case TAG_GET_LIST_SUCCESS: {
      const {tags} = data;
      const expires: number = DateTime.local().plus({hours: 24}).toMillis();
      return {...state, expires, list: tags};
    }
    default: {
      return state;
    }
  }
};
