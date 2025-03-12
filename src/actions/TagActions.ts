/**
 * Copyright (c) 2021-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {Tag} from '../adapters/Tag';
import {TagConstants} from '../stores/tagStore';
import {appMutation, appQuery} from '../utils/api';

import type {ReaktorDbCollection} from '../utils/api';
import type {FluxFramework} from '@nlabs/arkhamjs';

const DATA_TYPE: ReaktorDbCollection = 'tags';

export type TagApiResultsType = {
  tags: {
    addTag: Tag;
    addTagToProfile: Tag;
    deleteTag: Tag;
    deleteTagFromProfile: Tag;
    getTags: Tag[];
    updateTag: Tag;
  }
};

export class TagActions {
  CustomAdapter: typeof Tag;
  flux: FluxFramework;

  constructor(flux: FluxFramework, CustomAdapter = Tag) {
    this.CustomAdapter = CustomAdapter;
    this.flux = flux;
  }

  async addTag(tag: Partial<Tag>, tagProps: string[] = []): Promise<Tag> {
    try {
      const queryVariables = {
        tag: {
          type: 'TagInput!',
          value: tag
        }
      };
      const onSuccess = (data: TagApiResultsType) => {
        const {tags: {addTag: tag = {}}} = data;
        return this.flux.dispatch({tag: new this.CustomAdapter(tag), type: TagConstants.ADD_ITEM_SUCCESS});
      };

      const {tag: addedTag} = await appMutation(
        this.flux,
        'addTag',
        DATA_TYPE,
        queryVariables,
        ['category', 'id', 'name', 'tagId', ...tagProps],
        {onSuccess}
      );

      return addedTag as Tag;
    } catch(error) {
      this.flux.dispatch({error, type: TagConstants.ADD_ITEM_ERROR});
      throw error;
    }
  }

  async addTagToProfile(tagId: string, tagProps: string[] = []): Promise<Tag> {
    try {
      const queryVariables = {
        tagId: {
          type: 'ID!',
          value: tagId
        }
      };
      const onSuccess = (data: TagApiResultsType) => {
        const {tags: {addTagToProfile: tag = {}}} = data;
        return this.flux.dispatch({tag: new this.CustomAdapter(tag), type: TagConstants.ADD_PROFILE_SUCCESS});
      };

      const {tag: addedTag} = await appMutation(
        this.flux,
        'addTagToProfile',
        DATA_TYPE,
        queryVariables,
        ['category', 'id', 'name', 'tagId', ...tagProps],
        {onSuccess}
      );

      return addedTag as Tag;
    } catch(error) {
      this.flux.dispatch({error, type: TagConstants.ADD_PROFILE_ERROR});
      throw error;
    }
  }

  async deleteTag(tagId: string, tagProps: string[] = []): Promise<Tag> {
    try {
      const queryVariables = {
        tagId: {
          type: 'ID!',
          value: tagId
        }
      };

      const onSuccess = (data: TagApiResultsType) => {
        const {tags: {deleteTag: tag = {}}} = data;
        return this.flux.dispatch({tag: new this.CustomAdapter(tag), type: TagConstants.REMOVE_ITEM_SUCCESS});
      };

      const {tag: deletedTag} = await appMutation(
        this.flux,
        'deleteTag',
        DATA_TYPE,
        queryVariables,
        ['category', 'id', 'name', 'tagId', ...tagProps],
        {onSuccess}
      );

      return deletedTag as Tag;
    } catch(error) {
      this.flux.dispatch({error, type: TagConstants.REMOVE_ITEM_ERROR});
      throw error;
    }
  }

  async deleteTagFromProfile(tagId: string, tagProps: string[] = []): Promise<Tag> {
    try {
      const queryVariables = {
        tagId: {
          type: 'ID!',
          value: tagId
        }
      };

      const onSuccess = (data: TagApiResultsType) => {
        const {tags: {deleteTagFromProfile: tag = {}}} = data;
        return this.flux.dispatch({
          tag: new this.CustomAdapter(tag),
          type: TagConstants.REMOVE_PROFILE_SUCCESS
        });
      };

      const {tag: deletedTag} = await appMutation(
        this.flux,
        'deleteTagFromProfile',
        DATA_TYPE,
        queryVariables,
        ['category', 'id', 'name', 'tagId', ...tagProps],
        {onSuccess}
      );

      return deletedTag as Tag;
    } catch(error) {
      this.flux.dispatch({error, type: TagConstants.REMOVE_PROFILE_ERROR});
      throw error;
    }
  }

  async getTags(tagProps: string[] = []): Promise<Tag[]> {
    const initialTags: Tag[] = this.flux.getState('tag.list', []);
    const cacheExpires: number = this.flux.getState('tag.expires', 0);
    const now: number = Date.now();

    if(initialTags.length && now < cacheExpires) {
      await this.flux.dispatch({tags: initialTags, type: TagConstants.GET_LIST_SUCCESS});
      return initialTags;
    }

    try {
      const queryVariables = {
        from: {
          type: 'String',
          value: 0
        },
        search: {
          type: 'Int',
          value: ''
        },
        to: {
          type: 'Int',
          value: -1
        }
      };

      const onSuccess = (data: TagApiResultsType) => {
        const {tags: {getTags}} = data;
        return this.flux.dispatch({
          tags: getTags.map((item) => new this.CustomAdapter(item)),
          type: TagConstants.GET_LIST_SUCCESS
        });
      };

      const {tags: tagsList} = await appQuery(
        this.flux,
        'tags',
        DATA_TYPE,
        queryVariables,
        ['category', 'id', 'name', 'tagId', ...tagProps],
        {onSuccess}
      );

      return tagsList as Tag[];
    } catch(error) {
      this.flux.dispatch({error, type: TagConstants.GET_LIST_SUCCESS});
      throw error;
    }
  }

  async updateTag(tag: Partial<Tag>, tagProps: string[] = [], CustomClass = Tag): Promise<Tag> {
    try {
      const queryVariables = {
        tag: {
          type: 'TagInput!',
          value: tag
        }
      };

      const onSuccess = (data: TagApiResultsType) => {
        const {tags: {updateTag: tag = {}}} = data;
        return this.flux.dispatch({tag: new CustomClass(tag), type: TagConstants.UPDATE_ITEM_SUCCESS});
      };

      const {tag: updatedTag} = await appMutation(
        this.flux,
        'updateTag',
        DATA_TYPE,
        queryVariables,
        ['category', 'id', 'name', 'tagId', ...tagProps],
        {onSuccess}
      );

      return updatedTag as Tag;
    } catch(error) {
      this.flux.dispatch({error, type: TagConstants.UPDATE_ITEM_ERROR});
      throw error;
    }
  }
}
