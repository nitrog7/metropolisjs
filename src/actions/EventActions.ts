/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {parseId, parseNum} from '@nlabs/utils/lib';

import {Event} from '../adapters/Event';
import {EventConstants} from '../stores/eventStore';
import {appMutation, appQuery} from '../utils/api';


import type {PostApiResultsType} from './PostActions';
import type {ReaktorDbCollection} from '../utils/api';
import type {FluxFramework} from '@nlabs/arkhamjs';

const DATA_TYPE: ReaktorDbCollection = 'posts';

export class EventActions {
  CustomAdapter: typeof Event;
  flux: FluxFramework;

  constructor(flux: FluxFramework, CustomAdapter: typeof Event = Event) {
    this.CustomAdapter = CustomAdapter;
    this.flux = flux;
  }

  async addEvent(eventData: Partial<Event>, eventProps: string[] = []): Promise<Event> {
    try {
      const event = new Event(eventData);

      const queryVariables = {
        event: {
          type: 'PostInput!',
          value: event.getInput()
        }
      };

      const onSuccess = (data: PostApiResultsType) => {
        const {posts: {addPost = {}}} = data;
        return this.flux.dispatch({event: new this.CustomAdapter(addPost), type: EventConstants.ADD_ITEM_SUCCESS});
      };

      const {addEvent} = await appMutation(this.flux, 'addEvent', DATA_TYPE, queryVariables, ['eventId', ...eventProps], {onSuccess});
      return addEvent as Event;
    } catch(error) {
      this.flux.dispatch({error, type: EventConstants.ADD_ITEM_ERROR});
      throw error;
    }
  }

  async getEvent(eventId: string, eventProps: string[] = [], CustomClass: typeof Event = Event): Promise<Event> {
    try {
      const queryVariables = {
        postId: {
          type: 'ID!',
          value: parseId(eventId)
        }
      };

      const onSuccess = (data: PostApiResultsType) => {
        const {posts: {getPost: event = {}}} = data;
        return this.flux.dispatch({event: new CustomClass(event), type: EventConstants.GET_ITEM_SUCCESS});
      };

      const {event} = await appQuery(
        this.flux,
        'event',
        DATA_TYPE,
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
      return event as Event;
    } catch(error) {
      this.flux.dispatch({error, type: EventConstants.GET_ITEM_ERROR});
      throw error;
    }
  }

  async getEventsByTags(
    tags: string[],
    latitude: number,
    longitude: number,
    eventProps: string[] = [],
    CustomClass: typeof Event = Event
  ): Promise<Event[]> {
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

      const onSuccess = (data: PostApiResultsType) => {
        const {posts: {getPostsByTags: eventsByTags = []}} = data;
        return this.flux.dispatch({
          list: eventsByTags.map((event) => new CustomClass(event)),
          type: EventConstants.GET_LIST_SUCCESS
        });
      };

      const {eventsByTags: list} = await appQuery(
        this.flux,
        'eventsByTags',
        DATA_TYPE,
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
      return list as Event[];
    } catch(error) {
      this.flux.dispatch({error, type: EventConstants.GET_LIST_ERROR});
      throw error;
    }
  }

  async getEventsByReactions(
    reactions: string[],
    latitude: number,
    longitude: number,
    eventProps: string[] = [],
    CustomClass: typeof Event = Event
  ): Promise<Event[]> {
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

      const onSuccess = (data: PostApiResultsType) => {
        const {posts: {getPostsByReactions: eventsByReactions = []}} = data;
        return this.flux.dispatch({
          list: eventsByReactions.map((event) => new CustomClass(event)),
          type: EventConstants.GET_LIST_SUCCESS
        });
      };

      const {eventsByReactions: list} = await appQuery(
        this.flux,
        'eventsByReactions',
        DATA_TYPE,
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
      return list as Event[];
    } catch(error) {
      this.flux.dispatch({error, type: EventConstants.GET_LIST_ERROR});
      throw error;
    }
  }

  async deleteEvent(eventId: string, eventProps: string[] = [], CustomClass: typeof Event = Event): Promise<Event> {
    try {
      const queryVariables = {
        postId: {
          type: 'ID!',
          value: eventId
        }
      };

      const onSuccess = (data: PostApiResultsType) => {
        const {posts: {deletePost: event = {}}} = data;
        return this.flux.dispatch({event: new CustomClass(event), type: EventConstants.REMOVE_ITEM_SUCCESS});
      };

      const {deleteEvent} = await appMutation(this.flux, 'deleteEvent', DATA_TYPE, queryVariables, ['eventId', ...eventProps], {onSuccess});
      return deleteEvent as Event;
    } catch(error) {
      this.flux.dispatch({error, type: EventConstants.REMOVE_ITEM_ERROR});
      throw error;
    }
  }

  async updateEvent(event: Partial<Event>, eventProps: string[] = [], CustomClass: typeof Event = Event): Promise<Event> {
    try {
      const queryVariables = {
        event: {
          type: 'PostInput!',
          value: event
        }
      };

      const onSuccess = (data: PostApiResultsType) => {
        const {posts: {updatePost: event = {}}} = data;
        return this.flux.dispatch({event: new CustomClass(event), type: EventConstants.UPDATE_ITEM_SUCCESS});
      };

      const {updateEvent} = await appMutation(
        this.flux,
        'updateEvent',
        DATA_TYPE,
        queryVariables,
        ['added', 'content', 'endDate', 'eventId', 'name', 'startDate', ...eventProps],
        {onSuccess}
      );
      return updateEvent as Event;
    } catch(error) {
      this.flux.dispatch({error, type: EventConstants.UPDATE_ITEM_ERROR});
      throw error;
    }
  }
}
