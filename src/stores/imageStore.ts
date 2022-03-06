/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
export const IMAGE_ADD_ERROR: string = 'IMAGE_ADD_ERROR';
export const IMAGE_ADD_SUCCESS: string = 'IMAGE_ADD_SUCCESS';
export const IMAGE_DELETE_ERROR: string = 'IMAGE_DELETE_ERROR';
export const IMAGE_DELETE_SUCCESS: string = 'IMAGE_DELETE_SUCCESS';
export const IMAGE_GET_COUNT_ERROR: string = 'IMAGE_GET_COUNT_ERROR';
export const IMAGE_GET_COUNT_SUCCESS: string = 'IMAGE_GET_COUNT_SUCCESS';
export const IMAGE_GET_LIST_ERROR: string = 'IMAGE_GET_LIST_ERROR';
export const IMAGE_GET_LIST_SUCCESS: string = 'IMAGE_GET_LIST_SUCCESS';
export const IMAGE_OPEN: string = 'IMAGE_OPEN';
export const IMAGE_UPLOAD_ERROR: string = 'IMAGE_UPLOAD_ERROR';
export const IMAGE_UPLOAD_SUCCESS: string = 'IMAGE_UPLOAD_SUCCESS';

const defaultValues: any = {
  lists: {}
};

export const imageStore = (type: string, data, state = defaultValues): any => {
  switch(type) {
    case IMAGE_GET_LIST_SUCCESS: {
      const {list, itemId} = data;
      const {lists} = state;
      return {...state, lists: {...lists, [itemId]: list}};
    }
    default: {
      return state;
    }
  }
};
