/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
export const POST_ADD_ERROR: string = 'POST_ADD_ERROR';
export const POST_ADD_SUCCESS: string = 'POST_ADD_SUCCESS';
export const POST_GET_ERROR: string = 'POST_GET_ERROR';
export const POST_GET_SUCCESS: string = 'POST_GET_SUCCESS';
export const POST_GET_LIST_ERROR: string = 'POST_GET_LIST_ERROR';
export const POST_GET_LIST_SUCCESS: string = 'POST_GET_LIST_SUCCESS';
export const POST_REMOVE_ERROR: string = 'POST_REMOVE_ERROR';
export const POST_REMOVE_SUCCESS: string = 'POST_REMOVE_SUCCESS';
export const POST_UPDATE_ERROR: string = 'POST_UPDATE_ERROR';
export const POST_UPDATE_SUCCESS: string = 'POST_UPDATE_SUCCESS';

const defaultValues: any = {
  lists: {},
  viewed: {}
};

export const postStore = (type: string, data, state = defaultValues): any => {
  switch(type) {
    case POST_GET_SUCCESS: {
      const {viewed} = state;
      const {post} = data;

      viewed[post.postId] = {...post, cached: Date.now()};
      return {...state, viewed};
    }
    default: {
      return state;
    }
  }
};
