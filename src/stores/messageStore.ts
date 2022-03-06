/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
export const MESSAGE_ADD_ERROR: string = 'MESSAGE_ADD_ERROR';
export const MESSAGE_ADD_SUCCESS: string = 'MESSAGE_ADD_SUCCESS';
export const MESSAGE_GET_CONVO_LIST_ERROR: string = 'MESSAGE_GET_CONVO_LIST_ERROR';
export const MESSAGE_GET_CONVO_LIST_SUCCESS: string = 'MESSAGE_GET_CONVO_LIST_SUCCESS';
export const MESSAGE_GET_ERROR: string = 'MESSAGE_GET_ERROR';
export const MESSAGE_GET_SUCCESS: string = 'MESSAGE_GET_SUCCESS';
export const MESSAGE_GET_LIST_ERROR: string = 'MESSAGE_GET_LIST_ERROR';
export const MESSAGE_GET_LIST_SUCCESS: string = 'MESSAGE_GET_LIST_SUCCESS';
export const MESSAGE_REMOVE_ERROR: string = 'MESSAGE_REMOVE_ERROR';
export const MESSAGE_REMOVE_SUCCESS: string = 'MESSAGE_REMOVE_SUCCESS';
export const MESSAGE_UPDATE_ERROR: string = 'MESSAGE_UPDATE_ERROR';
export const MESSAGE_UPDATE_SUCCESS: string = 'MESSAGE_UPDATE_SUCCESS';

const defaultValues: any = {
  conversations: {}
};

export const messageStore = (type: string, data, state = defaultValues): any => {
  switch(type) {
    case MESSAGE_GET_CONVO_LIST_SUCCESS: {
      const {list, conversationId} = data;
      const {conversations} = state;
      return {...state, conversations: {...conversations, [conversationId]: list}};
    }
    // case MESSAGE_GET_LIST_SUCCESS: {
    //   const {list, conversationId} = data;
    //   const {conversations} = state;
    //   return {...state, conversations: {...conversations, [conversationId]: list}};
    // }
    default: {
      return state;
    }
  }
};
