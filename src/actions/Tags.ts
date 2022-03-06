import {FluxFramework} from '@nlabs/arkhamjs';

import {Tag} from '../adapters/Tag';
import {
  TAG_ADD_ERROR,
  TAG_ADD_PROFILE_ERROR,
  TAG_ADD_PROFILE_SUCCESS,
  TAG_ADD_SUCCESS,
  TAG_DELETE_ERROR,
  TAG_DELETE_PROFILE_ERROR,
  TAG_DELETE_PROFILE_SUCCESS,
  TAG_DELETE_SUCCESS,
  TAG_GET_LIST_SUCCESS,
  TAG_UPDATE_ERROR,
  TAG_UPDATE_SUCCESS
} from '../stores/tagStore';
import {ApiResultsType, appMutation, appQuery} from '../utils/api';

/**
 * Copyright (c) 2021-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
export class Tags {
  CustomAdapter: any;
  flux: FluxFramework;

  constructor(flux: FluxFramework, CustomAdapter = Tag) {
    this.CustomAdapter = CustomAdapter;
    this.flux = flux;
  }

  async addTag(tag: Partial<Tag>, tagProps: string[]) {
    try {
      const queryVariables = {
        tag: {
          type: 'TagInput!',
          value: tag
        }
      };
      const onSuccess = (data: ApiResultsType = {}) => {
        const {addTag = {}} = data;
        return this.flux.dispatch({tag: new this.CustomAdapter(addTag), type: TAG_ADD_SUCCESS});
      };

      return await appMutation(this.flux, 'addTag', queryVariables, ['category', 'id', 'name', 'tagId', ...tagProps], {
        onSuccess
      });
    } catch(error) {
      return this.flux.dispatch({error, type: TAG_ADD_ERROR});
    }
  }

  async addTagToProfile(tagId: string, tagProps: string[]) {
    try {
      const queryVariables = {
        tagId: {
          type: 'ID!',
          value: tagId
        }
      };
      const onSuccess = (data: ApiResultsType = {}) => {
        const {addTagToProfile = {}} = data;
        return this.flux.dispatch({tag: new this.CustomAdapter(addTagToProfile), type: TAG_ADD_PROFILE_SUCCESS});
      };

      return await appMutation(
        this.flux,
        'addTagToProfile',
        queryVariables,
        ['category', 'id', 'name', 'tagId', ...tagProps],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: TAG_ADD_PROFILE_ERROR});
    }
  }

  async deleteTag(tagId: string, tagProps: string[]) {
    try {
      const queryVariables = {
        tagId: {
          type: 'ID!',
          value: tagId
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {deleteTag = {}} = data;
        return this.flux.dispatch({tag: new this.CustomAdapter(deleteTag), type: TAG_DELETE_SUCCESS});
      };

      return await appMutation(
        this.flux,
        'deleteTag',
        queryVariables,
        ['category', 'id', 'name', 'tagId', ...tagProps],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: TAG_DELETE_ERROR});
    }
  }

  async deleteTagFromProfile(tagId: string, tagProps: string[]) {
    try {
      const queryVariables = {
        tagId: {
          type: 'ID!',
          value: tagId
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {deleteTagFromProfile = {}} = data;
        return this.flux.dispatch({
          tag: new this.CustomAdapter(deleteTagFromProfile),
          type: TAG_DELETE_PROFILE_SUCCESS
        });
      };

      return await appMutation(
        this.flux,
        'deleteTagFromProfile',
        queryVariables,
        ['category', 'id', 'name', 'tagId', ...tagProps],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: TAG_DELETE_PROFILE_ERROR});
    }
  }

  async getTags(tagProps: string[] = []) {
    const initialTags: Tag[] = this.flux.getState('tag.list', []);
    const cacheExpires: number = this.flux.getState('tag.expires', 0);
    const now: number = Date.now();

    console.log('getTags', {initialTags: initialTags.length, cacheExpires: now < cacheExpires});
    if(initialTags.length && now < cacheExpires) {
      return this.flux.dispatch({tags: initialTags, type: TAG_GET_LIST_SUCCESS});
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

      const onSuccess = (data: ApiResultsType = {}) => {
        const {tags = []} = data;
        return this.flux.dispatch({tags: tags.map((item) => new this.CustomAdapter(item)), type: TAG_GET_LIST_SUCCESS});
      };

      return await appQuery(this.flux, 'tags', queryVariables, ['category', 'id', 'name', 'tagId', ...tagProps], {
        onSuccess
      });
    } catch(error) {
      return this.flux.dispatch({error, type: TAG_GET_LIST_SUCCESS});
    }
  }

  async updateTag(tag: Partial<Tag>, tagProps: string[], CustomClass = Tag) {
    try {
      const queryVariables = {
        tag: {
          type: 'TagInput!',
          value: tag
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {updateTag = {}} = data;
        return this.flux.dispatch({tag: new CustomClass(updateTag), type: TAG_UPDATE_SUCCESS});
      };

      return await appMutation(
        this.flux,
        'updateTag',
        queryVariables,
        ['category', 'id', 'name', 'tagId', ...tagProps],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: TAG_UPDATE_ERROR});
    }
  }
}
