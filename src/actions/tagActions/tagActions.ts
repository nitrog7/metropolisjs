/**
 * Copyright (c) 2021-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {validateTagInput} from '../../adapters/tagAdapter/tagAdapter';
import {TAG_CONSTANTS} from '../../stores/tagStore';
import {appMutation, appQuery} from '../../utils/api';

import type {FluxFramework} from '@nlabs/arkhamjs';
import type {TagType} from '../../adapters/tagAdapter/tagAdapter';
import type {ReaktorDbCollection} from '../../utils/api';

const DATA_TYPE: ReaktorDbCollection = 'tags';

export interface TagAdapterOptions {
  strict?: boolean;
  allowPartial?: boolean;
  environment?: 'development' | 'production' | 'test';
  customValidation?: (input: unknown) => unknown;
}

export interface TagActionsOptions {
  tagAdapter?: (input: unknown, options?: TagAdapterOptions) => any;
  tagAdapterOptions?: TagAdapterOptions;
}

export type TagApiResultsType = {
  tags: {
    addTag: TagType;
    addTagToProfile: TagType;
    deleteTag: TagType;
    deleteTagFromProfile: TagType;
    getTags: TagType[];
    updateTag: TagType;
  };
};

export interface TagActions {
  addTag: (tag: Partial<TagType>, tagProps?: string[]) => Promise<TagType>;
  addTagToProfile: (tagId: string, tagProps?: string[]) => Promise<TagType>;
  deleteTag: (tagId: string, tagProps?: string[]) => Promise<TagType>;
  deleteTagFromProfile: (tagId: string, tagProps?: string[]) => Promise<TagType>;
  getTags: (tagProps?: string[]) => Promise<TagType[]>;
  updateTag: (tag: Partial<TagType>, tagProps?: string[]) => Promise<TagType>;
  updateTagAdapter: (adapter: (input: unknown, options?: TagAdapterOptions) => any) => void;
  updateTagAdapterOptions: (options: TagAdapterOptions) => void;
}

// Default validation function
const defaultTagValidator = (input: unknown, options?: TagAdapterOptions) => validateTagInput(input);

// Enhanced validation function that merges custom logic with defaults
const createTagValidator = (
  customAdapter?: (input: unknown, options?: TagAdapterOptions) => any,
  options?: TagAdapterOptions
) => (input: unknown, validatorOptions?: TagAdapterOptions) => {
  const mergedOptions = {...options, ...validatorOptions};

  // Start with default validation
  let validated = defaultTagValidator(input, mergedOptions);

  // Apply custom validation if provided
  if(customAdapter) {
    validated = customAdapter(validated, mergedOptions);
  }

  // Apply custom validation from options if provided
  if(mergedOptions?.customValidation) {
    validated = mergedOptions.customValidation(validated) as TagType;
  }

  return validated;
};

/**
 * Factory function to create TagActions with enhanced adapter injection capabilities.
 * Custom adapters are merged with default behavior, allowing partial overrides.
 *
 * @example
 * // Basic usage with default adapters
 * const tagActions = createTagActions(flux);
 *
 * @example
 * // Custom adapter that extends default behavior
 * const customTagAdapter = (input: unknown, options?: TagAdapterOptions) => {
 *   // input is already validated by default adapter
 *   if (input.name && input.name.length > 50) {
 *     throw new Error('Tag name too long');
 *   }
 *   return input;
 * };
 *
 * const tagActions = createTagActions(flux, {
 *   tagAdapter: customTagAdapter
 * });
 */
export const createTagActions = (
  flux: FluxFramework,
  options?: TagActionsOptions
): TagActions => {
  // Initialize adapter state
  let tagAdapterOptions: TagAdapterOptions = options?.tagAdapterOptions || {};
  let customTagAdapter = options?.tagAdapter;

  // Create validators that merge custom adapters with defaults
  let validateTag = createTagValidator(customTagAdapter, tagAdapterOptions);

  // Update functions that recreate validators
  const updateTagAdapter = (adapter: (input: unknown, options?: TagAdapterOptions) => any): void => {
    customTagAdapter = adapter;
    validateTag = createTagValidator(customTagAdapter, tagAdapterOptions);
  };

  const updateTagAdapterOptions = (options: TagAdapterOptions): void => {
    tagAdapterOptions = {...tagAdapterOptions, ...options};
    validateTag = createTagValidator(customTagAdapter, tagAdapterOptions);
  };

  // Action implementations
  const addTag = async (tag: Partial<TagType>, tagProps: string[] = []): Promise<TagType> => {
    try {
      const queryVariables = {
        tag: {
          type: 'TagInput!',
          value: validateTag(tag, tagAdapterOptions)
        }
      };

      const onSuccess = (data: TagApiResultsType) => {
        const {tags: {addTag: tag = {}}} = data;
        return flux.dispatch({tag, type: TAG_CONSTANTS.ADD_ITEM_SUCCESS});
      };

      const {tag: addedTag} = await appMutation(
        flux,
        'addTag',
        DATA_TYPE,
        queryVariables,
        ['category', 'id', 'name', 'tagId', ...tagProps],
        {onSuccess}
      );

      return addedTag as TagType;
    } catch(error) {
      flux.dispatch({error, type: TAG_CONSTANTS.ADD_ITEM_ERROR});
      throw error;
    }
  };

  const addTagToProfile = async (tagId: string, tagProps: string[] = []): Promise<TagType> => {
    try {
      const queryVariables = {
        tagId: {
          type: 'ID!',
          value: tagId
        }
      };

      const onSuccess = (data: TagApiResultsType) => {
        const {tags: {addTagToProfile: tag = {}}} = data;
        return flux.dispatch({tag, type: TAG_CONSTANTS.ADD_PROFILE_SUCCESS});
      };

      const {tag: addedTag} = await appMutation(
        flux,
        'addTagToProfile',
        DATA_TYPE,
        queryVariables,
        ['category', 'id', 'name', 'tagId', ...tagProps],
        {onSuccess}
      );

      return addedTag as TagType;
    } catch(error) {
      flux.dispatch({error, type: TAG_CONSTANTS.ADD_PROFILE_ERROR});
      throw error;
    }
  };

  const deleteTag = async (tagId: string, tagProps: string[] = []): Promise<TagType> => {
    try {
      const queryVariables = {
        tagId: {
          type: 'ID!',
          value: tagId
        }
      };

      const onSuccess = (data: TagApiResultsType) => {
        const {tags: {deleteTag: tag = {}}} = data;
        return flux.dispatch({tag, type: TAG_CONSTANTS.REMOVE_ITEM_SUCCESS});
      };

      const {tag: deletedTag} = await appMutation(
        flux,
        'deleteTag',
        DATA_TYPE,
        queryVariables,
        ['category', 'id', 'name', 'tagId', ...tagProps],
        {onSuccess}
      );

      return deletedTag as TagType;
    } catch(error) {
      flux.dispatch({error, type: TAG_CONSTANTS.REMOVE_ITEM_ERROR});
      throw error;
    }
  };

  const deleteTagFromProfile = async (tagId: string, tagProps: string[] = []): Promise<TagType> => {
    try {
      const queryVariables = {
        tagId: {
          type: 'ID!',
          value: tagId
        }
      };

      const onSuccess = (data: TagApiResultsType) => {
        const {tags: {deleteTagFromProfile: tag = {}}} = data;
        return flux.dispatch({
          tag,
          type: TAG_CONSTANTS.REMOVE_PROFILE_SUCCESS
        });
      };

      const {tag: deletedTag} = await appMutation(
        flux,
        'deleteTagFromProfile',
        DATA_TYPE,
        queryVariables,
        ['category', 'id', 'name', 'tagId', ...tagProps],
        {onSuccess}
      );

      return deletedTag as TagType;
    } catch(error) {
      flux.dispatch({error, type: TAG_CONSTANTS.REMOVE_PROFILE_ERROR});
      throw error;
    }
  };

  const getTags = async (tagProps: string[] = []): Promise<TagType[]> => {
    const initialTags: TagType[] = flux.getState('tag.list', []) as TagType[];
    const cacheExpires: number = flux.getState('tag.expires', 0) as number;
    const now: number = Date.now();

    if(initialTags.length && now < cacheExpires) {
      await flux.dispatch({tags: initialTags, type: TAG_CONSTANTS.GET_LIST_SUCCESS});
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
        return flux.dispatch({
          tags: getTags,
          type: TAG_CONSTANTS.GET_LIST_SUCCESS
        });
      };

      const {tags: tagsList} = await appQuery(
        flux,
        'tags',
        DATA_TYPE,
        queryVariables,
        ['category', 'id', 'name', 'tagId', ...tagProps],
        {onSuccess}
      );

      return tagsList as TagType[];
    } catch(error) {
      flux.dispatch({error, type: TAG_CONSTANTS.GET_LIST_SUCCESS});
      throw error;
    }
  };

  const updateTag = async (tag: Partial<TagType>, tagProps: string[] = []): Promise<TagType> => {
    try {
      const queryVariables = {
        tag: {
          type: 'TagInput!',
          value: validateTag(tag, tagAdapterOptions)
        }
      };

      const onSuccess = (data: TagApiResultsType) => {
        const {tags: {updateTag: tag = {}}} = data;
        return flux.dispatch({tag, type: TAG_CONSTANTS.UPDATE_ITEM_SUCCESS});
      };

      const {tag: updatedTag} = await appMutation(
        flux,
        'updateTag',
        DATA_TYPE,
        queryVariables,
        ['category', 'id', 'name', 'tagId', ...tagProps],
        {onSuccess}
      );

      return updatedTag as TagType;
    } catch(error) {
      flux.dispatch({error, type: TAG_CONSTANTS.UPDATE_ITEM_ERROR});
      throw error;
    }
  };

  // Return the actions object
  return {
    addTag,
    addTagToProfile,
    deleteTag,
    deleteTagFromProfile,
    getTags,
    updateTag,
    updateTagAdapter,
    updateTagAdapterOptions
  };
};

