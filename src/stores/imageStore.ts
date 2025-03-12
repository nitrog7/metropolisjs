/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import type {Image} from '../adapters';

export class ImageConstants {
  static readonly ADD_ITEM_ERROR: string = 'IMAGE_ADD_ITEM_ERROR';
  static readonly ADD_ITEM_SUCCESS: string = 'IMAGE_ADD_ITEM_SUCCESS';
  static readonly GET_COUNT_ERROR: string = 'IMAGE_GET_COUNT_ERROR';
  static readonly GET_COUNT_SUCCESS: string = 'IMAGE_GET_COUNT_SUCCESS';
  static readonly GET_LIST_ERROR: string = 'IMAGE_GET_LIST_ERROR';
  static readonly GET_LIST_SUCCESS: string = 'IMAGE_GET_LIST_SUCCESS';
  static readonly OPEN: string = 'IMAGE_OPEN';
  static readonly REMOVE_ITEM_ERROR: string = 'IMAGE_REMOVE_ITEM_ERROR';
  static readonly REMOVE_ITEM_SUCCESS: string = 'IMAGE_REMOVE_ITEM_SUCCESS';
  static readonly UPLOAD_ITEM_ERROR: string = 'IMAGE_UPLOAD_ITEM_ERROR';
  static readonly UPLOAD_ITEM_SUCCESS: string = 'IMAGE_UPLOAD_ITEM_SUCCESS';
}

interface ImageState {
  lists: Record<string, Image[]>;
}

export const defaultValues: ImageState = {
  lists: {}
};

export const imageStore = (type: string, data: {
  list?: Image[];
  itemId?: string;
}, state = defaultValues): ImageState => {
  switch(type) {
    case ImageConstants.GET_LIST_SUCCESS: {
      const {list, itemId} = data;
      const {lists} = state;
      return {...state, lists: {...lists, [itemId]: list}};
    }
    default: {
      return state;
    }
  }
};
