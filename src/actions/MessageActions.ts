/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

import {Message} from '../adapters/Message';
import {MessageConstants} from '../stores/messageStore';
import {appMutation, appQuery} from '../utils/api';

import type {Conversation} from '../adapters';
import type {ApiResultsType, ReaktorDbCollection} from '../utils/api';
import type{FluxFramework} from '@nlabs/arkhamjs';

const DATA_TYPE: ReaktorDbCollection = 'messages';

export type MessageApiResultsType = {
  sendMessage: Message;
  getDirectConversation: Conversation;
  getMessages: Message[];
  getConversations: Conversation[];
};

export class MessageActions {
  CustomAdapter: typeof Message;
  flux: FluxFramework;

  constructor(flux: FluxFramework, CustomAdapter: typeof Message = Message) {
    this.CustomAdapter = CustomAdapter;
    this.flux = flux;
  }

  async sendMessage(message: Partial<Message>, messageProps: string[] = [], CustomClass = Message): Promise<Message> {
    try {
      const queryVariables = {
        message: {
          type: 'MessageInput!',
          value: message
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {sendMessage: message = {}} = data;
        const sessionId: string = this.flux.getState('user.session.userId', '');
        return this.flux.dispatch({message: new CustomClass(message, sessionId), type: MessageConstants.ADD_ITEM_SUCCESS});
      };

      const {message: addedMessage} = await appMutation(
        this.flux,
        'sendMessage',
        DATA_TYPE,
        queryVariables,
        ['added', 'content', 'modified', 'messageId', 'user { userId, username }', ...messageProps],
        {onSuccess}
      );
      return addedMessage as Message;
    } catch(error) {
      this.flux.dispatch({error, type: MessageConstants.ADD_ITEM_ERROR});
      throw error;
    }
  }

  async getDirectConversation(userId: string): Promise<Conversation> {
    try {
      const queryVariables = {
        userId: {
          type: 'ID!',
          value: userId
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {directConversation: conversation = {}} = data;
        return this.flux.dispatch({conversation, type: MessageConstants.GET_CONVO_LIST_SUCCESS});
      };

      const {directConversation: conversation} = await appQuery(
        this.flux,
        'directConversation',
        DATA_TYPE,
        queryVariables,
        ['added', 'conversationId', 'modified', 'name', 'users { userId, username }'],
        {onSuccess}
      );
      return conversation as Conversation;
    } catch(error) {
      this.flux.dispatch({error, type: MessageConstants.GET_CONVO_LIST_ERROR});
      throw error;
    }
  }

  async getMessages(conversationId: string, messageProps: string[] = [], CustomClass = Message): Promise<Message[]> {
    try {
      const queryVariables = {
        conversationId: {
          type: 'ID!',
          value: conversationId
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {messages = []} = data as {messages: Message[]};
        const sessionId: string = this.flux.getState('user.session.userId', '');

        return this.flux.dispatch({
          conversationId,
          list: messages.map((messageData) => new CustomClass(messageData, sessionId)),
          type: MessageConstants.GET_LIST_SUCCESS
        });
      };

      const {messages: messagesList} = await appQuery(
        this.flux,
        'messages',
        DATA_TYPE,
        queryVariables,
        ['added', 'content', 'modified', 'messageId', 'user { userId, username }', ...messageProps],
        {onSuccess}
      );
      return messagesList as Message[];
    } catch(error) {
      this.flux.dispatch({error, type: MessageConstants.GET_LIST_ERROR});
      throw error;
    }
  }

  async getConversations(from: number = 0, to: number = 10): Promise<Conversation[]> {
    try {
      const queryVariables = {
        from: {
          type: 'Int',
          value: from
        },
        to: {
          type: 'Int',
          value: to
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {conversations = []} = data;
        return this.flux.dispatch({conversations, type: MessageConstants.GET_CONVO_LIST_SUCCESS});
      };

      const {conversations: conversationsList} = await appQuery(
        this.flux,
        'conversations',
        DATA_TYPE,
        queryVariables,
        ['added', 'content', 'conversationId', 'modified', 'name', 'thumbUrl', 'users { userId, username }'],
        {onSuccess}
      );
      return conversationsList as Conversation[];
    } catch(error) {
      this.flux.dispatch({error, type: MessageConstants.GET_CONVO_LIST_ERROR});
      throw error;
    }
  }
}
