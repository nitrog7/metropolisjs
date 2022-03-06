/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {FluxFramework} from '@nlabs/arkhamjs';
import {parseId, parseNum} from '@nlabs/utils/lib';

import {Event} from '../adapters/Event';
import {
  EVENT_ADD_ERROR,
  EVENT_ADD_SUCCESS,
  EVENT_GET_ERROR,
  EVENT_GET_LIST_ERROR,
  EVENT_GET_LIST_SUCCESS,
  EVENT_GET_SUCCESS,
  EVENT_REMOVE_ERROR,
  EVENT_REMOVE_SUCCESS,
  EVENT_UPDATE_ERROR,
  EVENT_UPDATE_SUCCESS
} from '../stores/eventStore';
import {ApiResultsType, appMutation, appQuery} from '../utils/api';

export class Events {
  flux: FluxFramework;

  constructor(flux: FluxFramework) {
    this.flux = flux;
  }

  async addEvent(eventData: any, eventProps: string[] = [], CustomClass: any = Event): Promise<any> {
    try {
      const event = new Event(eventData);

      const queryVariables = {
        event: {
          type: 'EventInput!',
          value: event.getInput()
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {addEvent = {}} = data;
        return this.flux.dispatch({event: new CustomClass(addEvent), type: EVENT_ADD_SUCCESS});
      };

      return await appMutation(this.flux, 'addEvent', queryVariables, ['eventId', ...eventProps], {onSuccess});
    } catch(error) {
      return this.flux.dispatch({error, type: EVENT_ADD_ERROR});
    }
  }

  async getEvent(eventId: string, eventProps: string[] = [], CustomClass: any = Event): Promise<any> {
    try {
      const queryVariables = {
        eventId: {
          type: 'EventInput!',
          value: parseId(eventId)
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {event = {}} = data;
        return this.flux.dispatch({event: new CustomClass(event), type: EVENT_GET_SUCCESS});
      };

      return await appQuery(
        this.flux,
        'event',
        queryVariables,
        [
          'address',
          'added',
          'content',
          'endDate',
          'hasRsvp',
          'images(from: 0 to: 10) { id, imageId, imageUrl, thumbUrl }',
          'modified',
          'name',
          'eventId',
          'startDate',
          'rsvpCount',
          'tags {name, tagId}',
          'user { imageUrl, userId, username }',
          'viewCount',
          ...eventProps
        ],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: EVENT_GET_ERROR});
    }
  }

  async getEventsByTags(
    tags: string[],
    latitude: number,
    longitude: number,
    eventProps: string[] = [],
    CustomClass: any = Event
  ): Promise<any> {
    const formatTags: string[] = tags.map((tag: string) => tag.trim().toLowerCase());

    try {
      const queryVariables = {
        latitude: {
          type: 'Float',
          value: parseNum(latitude)
        },
        longitude: {
          type: 'Float',
          value: parseNum(longitude)
        },
        tags: {
          type: 'TagInput!',
          value: formatTags
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {eventsByTags = []} = data;
        return this.flux.dispatch({
          list: eventsByTags.map((event) => new CustomClass(event)),
          type: EVENT_GET_LIST_SUCCESS
        });
      };

      return await appQuery(
        this.flux,
        'eventsByTags',
        queryVariables,
        [
          'address',
          'added',
          'content',
          'endDate',
          'hasRsvp',
          'images(from: 0 to: 10) { id, imageId, imageUrl, thumbUrl }',
          'modified',
          'name',
          'eventId',
          'startDate',
          'rsvpCount',
          'tags {name, tagId}',
          'user { imageUrl, userId, username }',
          'viewCount',
          ...eventProps
        ],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: EVENT_GET_LIST_ERROR});
    }
  }

  async getEventsByReactions(
    reactions: string[],
    latitude: number,
    longitude: number,
    eventProps: string[] = [],
    CustomClass: any = Event
  ): Promise<any> {
    try {
      const queryVariables = {
        latitude: {
          type: 'Float',
          value: parseNum(latitude)
        },
        longitude: {
          type: 'Float',
          value: parseNum(longitude)
        },
        reactions: {
          type: 'ReactionInput!',
          value: reactions
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {eventsByReactions = []} = data;
        return this.flux.dispatch({
          list: eventsByReactions.map((event) => new CustomClass(event)),
          type: EVENT_GET_LIST_SUCCESS
        });
      };

      return await appQuery(
        this.flux,
        'eventsByReactions',
        queryVariables,
        [
          'address',
          'added',
          'content',
          'endDate',
          'hasRsvp',
          'images(from: 0 to: 10) { id, imageId, imageUrl, thumbUrl }',
          'modified',
          'name',
          'eventId',
          'startDate',
          'rsvpCount',
          'tags {name, tagId}',
          'user { imageUrl, userId, username }',
          'viewCount',
          ...eventProps
        ],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: EVENT_GET_LIST_ERROR});
    }
  }

  async deleteEvent(eventId: string, eventProps: string[] = [], CustomClass: any = Event): Promise<any> {
    try {
      const queryVariables = {
        eventId: {
          type: 'ID!',
          value: eventId
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {deleteEvent = {}} = data;
        return this.flux.dispatch({event: new CustomClass(deleteEvent), type: EVENT_REMOVE_SUCCESS});
      };

      return await appMutation(this.flux, 'deleteEvent', queryVariables, ['eventId', ...eventProps], {onSuccess});
    } catch(error) {
      return this.flux.dispatch({error, type: EVENT_REMOVE_ERROR});
    }
  }

  async updateEvent(event: any, eventProps: string[] = [], CustomClass: any = Event): Promise<any> {
    try {
      const queryVariables = {
        event: {
          type: 'EventInput!',
          value: event
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {updateEvent = {}} = data;
        return this.flux.dispatch({event: new CustomClass(updateEvent), type: EVENT_UPDATE_SUCCESS});
      };

      return await appMutation(
        this.flux,
        'updateEvent',
        queryVariables,
        ['added', 'content', 'endDate', 'eventId', 'name', 'startDate', ...eventProps],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: EVENT_UPDATE_ERROR});
    }
  }
}
