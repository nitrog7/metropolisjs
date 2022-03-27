/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {FluxFramework} from '@nlabs/arkhamjs';

import {Message} from '../adapters/Message';
import {
  MESSAGE_ADD_ERROR,
  MESSAGE_ADD_SUCCESS,
  MESSAGE_GET_CONVO_LIST_ERROR,
  MESSAGE_GET_CONVO_LIST_SUCCESS,
  MESSAGE_GET_LIST_ERROR,
  MESSAGE_GET_LIST_SUCCESS
} from '../stores/messageStore';
import {ApiResultsType, appMutation, appQuery} from '../utils/api';

export class Messages {
  CustomAdapter: any;
  flux: FluxFramework;

  constructor(flux: FluxFramework, CustomAdapter: any = Message) {
    this.CustomAdapter = CustomAdapter;
    this.flux = flux;
  }

  async sendMessage(message: Partial<Message>, messageProps: string[] = [], CustomClass = Message) {
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
        return this.flux.dispatch({message: new CustomClass(message, sessionId), type: MESSAGE_ADD_SUCCESS});
      };

      return await appMutation(
        this.flux,
        'sendMessage',
        queryVariables,
        ['added', 'content', 'modified', 'messageId', 'user { userId, username }', ...messageProps],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: MESSAGE_ADD_ERROR});
    }
  }

  getDirectConversation(userId: string) {
    try {
      const queryVariables = {
        userId: {
          type: 'ID!',
          value: userId
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {directConversation: conversation = {}} = data;
        return this.flux.dispatch({conversation, type: MESSAGE_GET_CONVO_LIST_SUCCESS});
      };

      return appQuery(
        this.flux,
        'directConversation',
        queryVariables,
        ['added', 'conversationId', 'modified', 'name', 'users { userId, username }'],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: MESSAGE_GET_CONVO_LIST_ERROR});
    }
  }

  getMessages(conversationId: string, messageProps: string[] = [], CustomClass = Message): Promise<any> {
    try {
      const queryVariables = {
        conversationId: {
          type: 'ID!',
          value: conversationId
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {messages = []} = data;
        const sessionId: string = this.flux.getState('user.session.userId', '');

        return this.flux.dispatch({
          conversationId,
          list: messages.map((messageData) => new CustomClass(messageData, sessionId)),
          type: MESSAGE_GET_LIST_SUCCESS
        });
      };

      return appQuery(
        this.flux,
        'messages',
        queryVariables,
        ['added', 'content', 'modified', 'messageId', 'user { userId, username }', ...messageProps],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: MESSAGE_GET_LIST_ERROR});
    }
  }

  async getConversations(from: number = 0, to: number = 10): Promise<any> {
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
        return this.flux.dispatch({conversations, type: MESSAGE_GET_CONVO_LIST_SUCCESS});
      };

      return await appQuery(
        this.flux,
        'conversations',
        queryVariables,
        ['added', 'content', 'conversationId', 'modified', 'name', 'thumbUrl', 'users { userId, username }'],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: MESSAGE_GET_CONVO_LIST_ERROR});
    }
  }
}
