/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import type {Message} from '../adapters';

export class MessageConstants {
  static readonly ADD_ITEM_ERROR: string = 'MESSAGE_ADD_ITEM_ERROR';
  static readonly ADD_ITEM_SUCCESS: string = 'MESSAGE_ADD_ITEM_SUCCESS';
  static readonly GET_CONVO_LIST_ERROR: string = 'MESSAGE_GET_CONVO_LIST_ERROR';
  static readonly GET_CONVO_LIST_SUCCESS: string = 'MESSAGE_GET_CONVO_LIST_SUCCESS';
  static readonly GET_ITEM_ERROR: string = 'MESSAGE_GET_ITEM_ERROR';
  static readonly GET_ITEM_SUCCESS: string = 'MESSAGE_GET_ITEM_SUCCESS';
  static readonly GET_LIST_ERROR: string = 'MESSAGE_GET_LIST_ERROR';
  static readonly GET_LIST_SUCCESS: string = 'MESSAGE_GET_LIST_SUCCESS';
  static readonly REMOVE_ITEM_ERROR: string = 'MESSAGE_REMOVE_ITEM_ERROR';
  static readonly REMOVE_ITEM_SUCCESS: string = 'MESSAGE_REMOVE_ITEM_SUCCESS';
  static readonly UPDATE_ITEM_ERROR: string = 'MESSAGE_UPDATE_ITEM_ERROR';
  static readonly UPDATE_ITEM_SUCCESS: string = 'MESSAGE_UPDATE_ITEM_SUCCESS';
}

interface MessageState {
  conversations: Record<string, Message[]>;
}

export const defaultValues: MessageState = {
  conversations: {}
};

export const messages = (type: string, data: {
  list?: Message[];
  conversationId?: string;
}, state = defaultValues): MessageState => {
  switch(type) {
    case MessageConstants.GET_CONVO_LIST_SUCCESS: {
      const {list, conversationId} = data;

      if(!conversationId) {
        return state;
      }

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
