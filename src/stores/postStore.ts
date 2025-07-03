/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import type {PostType} from '../adapters/postAdapter';

export class PostConstants {
  static readonly ADD_ITEM_ERROR: string = 'POST_ADD_ITEM_ERROR';
  static readonly ADD_ITEM_SUCCESS: string = 'POST_ADD_ITEM_SUCCESS';
  static readonly GET_ITEM_ERROR: string = 'POST_GET_ITEM_ERROR';
  static readonly GET_ITEM_SUCCESS: string = 'POST_GET_ITEM_SUCCESS';
  static readonly GET_LIST_ERROR: string = 'POST_GET_LIST_ERROR';
  static readonly GET_LIST_SUCCESS: string = 'POST_GET_LIST_SUCCESS';
  static readonly REMOVE_ITEM_ERROR: string = 'POST_REMOVE_ITEM_ERROR';
  static readonly REMOVE_ITEM_SUCCESS: string = 'POST_REMOVE_ITEM_SUCCESS';
  static readonly UPDATE_ITEM_ERROR: string = 'POST_UPDATE_ITEM_ERROR';
  static readonly UPDATE_ITEM_SUCCESS: string = 'POST_UPDATE_ITEM_SUCCESS';
}

interface PostState {
  lists: Record<string, PostType[]>;
  viewed: Record<string, PostType>;
}

export const defaultValues: PostState = {
  lists: {},
  viewed: {}
};

export const posts = (type: string, data: {post?: PostType}, state = defaultValues): PostState => {
  switch(type) {
    case PostConstants.GET_ITEM_SUCCESS: {
      const {viewed} = state;
      const {post} = data;
      viewed[post.postId] = {...post, cached: Date.now()} as PostType;
      return {...state, viewed};
    }
    default: {
      return state;
    }
  }
};
