/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {parseId, parseNum} from '@nlabs/utils';

import {validatePostInput} from '../adapters/postAdapter';
import {POST_CONSTANTS} from '../stores/postStore';
import {appMutation, appQuery} from '../utils/api';
import {createBaseActions} from '../utils/baseActionFactory';

import type {FluxFramework} from '@nlabs/arkhamjs';
import type {PostType} from '../adapters/postAdapter';
import type {ReaktorDbCollection} from '../utils/api';
import type {BaseAdapterOptions} from '../utils/validatorFactory';

const DATA_TYPE: ReaktorDbCollection = 'posts';

export interface PostAdapterOptions extends BaseAdapterOptions {
  // Post-specific options can be added here
}

export interface PostActionsOptions {
  postAdapter?: (input: unknown, options?: PostAdapterOptions) => any;
  postAdapterOptions?: PostAdapterOptions;
}

export type PostApiResultsType = {
  posts: {
    addPost: PostType;
    getPost: PostType;
    getPostsByLatest: PostType[];
    getPostsByLocation: PostType[];
    getPostsByReactions: PostType[];
    getPostsByTags: PostType[];
    deletePost: PostType;
    updatePost: PostType;
  };
};

export interface PostActions {
  add: (postData: Partial<PostType>, postProps?: string[]) => Promise<PostType>;
  itemById: (postId: string, postProps?: string[]) => Promise<PostType>;
  listByLatest: (from?: number, to?: number, postProps?: string[]) => Promise<PostType[]>;
  listByLocation: (latitude: number, longitude: number, from?: number, to?: number, postProps?: string[]) => Promise<PostType[]>;
  listByReactions: (reactionNames: string[], latitude: number, longitude: number, from?: number, to?: number, postProps?: string[]) => Promise<PostType[]>;
  listByTags: (tags: string[], latitude: number, longitude: number, from?: number, to?: number, postProps?: string[]) => Promise<PostType[]>;
  delete: (postId: string, postProps?: string[]) => Promise<PostType>;
  update: (post: Partial<PostType>, postProps?: string[]) => Promise<PostType>;
  updatePostAdapter: (adapter: (input: unknown, options?: PostAdapterOptions) => any) => void;
  updatePostAdapterOptions: (options: PostAdapterOptions) => void;
}

// Default validation function
const defaultPostValidator = (input: unknown, options?: PostAdapterOptions) => validatePostInput(input);

/**
 * Factory function to create PostActions with enhanced adapter injection capabilities.
 * Custom adapters are merged with default behavior, allowing partial overrides.
 *
 * @example
 * // Basic usage with default adapters
 * const postActions = createPostActions(flux);
 *
 * @example
 * // Custom adapter that extends default behavior
 * const customPostAdapter = (input: unknown, options?: PostAdapterOptions) => {
 *   // input is already validated by default adapter
 *   if (input.content && input.content.length > 1000) {
 *     throw new Error('Post content too long');
 *   }
 *   return input;
 * };
 *
 * const postActions = createPostActions(flux, {
 *   postAdapter: customPostAdapter
 * });
 */
export const createPostActions = (
  flux: FluxFramework,
  options?: PostActionsOptions
): PostActions => {
  // Create base actions for post validation
  const postBase = createBaseActions(flux, defaultPostValidator, {
    adapter: options?.postAdapter,
    adapterOptions: options?.postAdapterOptions
  });

  // Action implementations
  const add = async (postData: Partial<PostType>, postProps: string[] = []): Promise<PostType> => {
    try {
      const queryVariables = {
        post: {
          type: 'PostInput!',
          value: postBase.validator(postData)
        }
      };

      const onSuccess = (data: PostApiResultsType) => {
        const {posts: {addPost = {}}} = data;
        return flux.dispatch({post: addPost, type: POST_CONSTANTS.ADD_ITEM_SUCCESS});
      };

      const {post: addedPost} = await appMutation(flux, 'addPost', DATA_TYPE, queryVariables, ['postId', ...postProps], {onSuccess});
      return addedPost as PostType;
    } catch(error) {
      flux.dispatch({error, type: POST_CONSTANTS.ADD_ITEM_ERROR});
      throw error;
    }
  };

  const itemById = async (postId: string, postProps: string[] = []): Promise<PostType> => {
    try {
      const queryVariables = {
        postId: {
          type: 'ID!',
          value: parseId(postId)
        }
      };

      const onSuccess = (data: PostApiResultsType) => {
        const {posts: {getPost: post = {}}} = data;
        return flux.dispatch({post, type: POST_CONSTANTS.GET_ITEM_SUCCESS});
      };

      const {post: postResult} = await appQuery(
        flux,
        'post',
        DATA_TYPE,
        queryVariables,
        [
          'added',
          'content',
          'isSaved',
          'modified',
          'name',
          'postId',
          'tags {name, tagId}',
          'user {birthdate, imageUrl, thumbUrl, userId, username}',
          'viewCount',
          ...postProps
        ],
        {onSuccess}
      );
      return postResult as PostType;
    } catch(error) {
      flux.dispatch({error, type: POST_CONSTANTS.GET_ITEM_ERROR});
      throw error;
    }
  };

  const listByLatest = async (
    from: number = 0,
    to: number = 0,
    postProps: string[] = []
  ): Promise<PostType[]> => {
    try {
      const queryVariables = {
        from: {
          type: 'Int',
          value: parseNum(from)
        },
        to: {
          type: 'Int',
          value: parseNum(to)
        }
      };

      const onSuccess = (data: PostApiResultsType) => {
        const {posts: {getPostsByLatest: postsByLatest = []}} = data;
        return flux.dispatch({
          list: postsByLatest,
          type: POST_CONSTANTS.GET_LIST_SUCCESS
        });
      };

      const {postsByLatest: list} = await appQuery(
        flux,
        'postsByLatest',
        DATA_TYPE,
        queryVariables,
        [
          'added',
          'content',
          'isSaved',
          'modified',
          'name',
          'postId',
          'tags {name, tagId}',
          'user {birthdate, imageUrl, thumbUrl, userId, username}',
          'viewCount',
          ...postProps
        ],
        {onSuccess}
      );
      return list as PostType[];
    } catch(error) {
      flux.dispatch({error, type: POST_CONSTANTS.GET_LIST_ERROR});
      throw error;
    }
  };

  const listByLocation = async (
    latitude: number,
    longitude: number,
    from: number = 0,
    to: number = 10,
    postProps: string[] = []
  ): Promise<PostType[]> => {
    try {
      const queryVariables = {
        from: {
          type: 'Int',
          value: parseNum(from)
        },
        latitude: {
          type: 'Float',
          value: parseNum(latitude)
        },
        longitude: {
          type: 'Float',
          value: parseNum(longitude)
        },
        to: {
          type: 'Int',
          value: parseNum(to)
        }
      };

      const onSuccess = (data: PostApiResultsType) => {
        const {posts: {getPostsByLocation: postsByLocation = []}} = data;
        return flux.dispatch({
          list: postsByLocation,
          type: POST_CONSTANTS.GET_LIST_SUCCESS
        });
      };

      const {getPostsByLocation: list} = await appQuery(
        flux,
        'postsByLocation',
        DATA_TYPE,
        queryVariables,
        [
          'added',
          'content',
          'isSaved',
          'modified',
          'name',
          'postId',
          'tags {name, tagId}',
          'user {birthdate, imageUrl, thumbUrl, userId, username}',
          'viewCount',
          ...postProps
        ],
        {onSuccess}
      );
      return list as PostType[];
    } catch(error) {
      flux.dispatch({error, type: POST_CONSTANTS.GET_LIST_ERROR});
      throw error;
    }
  };

  const listByReactions = async (
    reactionNames: string[],
    latitude: number,
    longitude: number,
    from: number = 0,
    to: number = 10,
    postProps: string[] = []
  ): Promise<PostType[]> => {
    try {
      const queryVariables = {
        from: {
          type: 'Int',
          value: parseNum(from)
        },
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
          value: reactionNames
        },
        to: {
          type: 'Int',
          value: parseNum(to)
        }
      };

      const onSuccess = (data: PostApiResultsType) => {
        const {posts: {getPostsByReactions: postsByReactions = []}} = data;
        return flux.dispatch({
          list: postsByReactions,
          type: POST_CONSTANTS.GET_LIST_SUCCESS
        });
      };

      const {getPostsByReactions: list} = await appQuery(
        flux,
        'postsByReactions',
        DATA_TYPE,
        queryVariables,
        [
          'added',
          'content',
          'isSaved',
          'modified',
          'name',
          'postId',
          'tags {name, tagId}',
          'user {birthdate, imageUrl, thumbUrl, userId, username}',
          'viewCount',
          ...postProps
        ],
        {onSuccess}
      );
      return list as PostType[];
    } catch(error) {
      flux.dispatch({error, type: POST_CONSTANTS.GET_LIST_ERROR});
      throw error;
    }
  };

  const listByTags = async (
    tags: string[],
    latitude: number,
    longitude: number,
    from: number = 0,
    to: number = 10,
    postProps: string[] = []
  ): Promise<PostType[]> => {
    try {
      const queryVariables = {
        from: {
          type: 'Int',
          value: parseNum(from)
        },
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
          value: tags
        },
        to: {
          type: 'Int',
          value: parseNum(to)
        }
      };

      const onSuccess = (data: PostApiResultsType) => {
        const {posts: {getPostsByTags: postsByTags = []}} = data;
        return flux.dispatch({
          list: postsByTags,
          type: POST_CONSTANTS.GET_LIST_SUCCESS
        });
      };

      const {getPostsByTags: list} = await appQuery(
        flux,
        'postsByTags',
        DATA_TYPE,
        queryVariables,
        [
          'added',
          'content',
          'isSaved',
          'modified',
          'name',
          'postId',
          'tags {name, tagId}',
          'user {birthdate, imageUrl, thumbUrl, userId, username}',
          'viewCount',
          ...postProps
        ],
        {onSuccess}
      );
      return list as PostType[];
    } catch(error) {
      flux.dispatch({error, type: POST_CONSTANTS.GET_LIST_ERROR});
      throw error;
    }
  };

  const deletePost = async (postId: string, postProps: string[] = []): Promise<PostType> => {
    try {
      const queryVariables = {
        postId: {
          type: 'ID!',
          value: parseId(postId)
        }
      };

      const onSuccess = (data: PostApiResultsType) => {
        const {posts: {deletePost = {}}} = data;
        return flux.dispatch({post: deletePost, type: POST_CONSTANTS.REMOVE_ITEM_SUCCESS});
      };

      const {post: deletedPost} = await appMutation(flux, 'deletePost', DATA_TYPE, queryVariables, ['postId', ...postProps], {onSuccess});
      return deletedPost as PostType;
    } catch(error) {
      flux.dispatch({error, type: POST_CONSTANTS.REMOVE_ITEM_ERROR});
      throw error;
    }
  };

  const update = async (post: Partial<PostType>, postProps: string[] = []): Promise<PostType> => {
    try {
      const queryVariables = {
        post: {
          type: 'PostUpdateInput!',
          value: postBase.validator(post)
        }
      };

      const onSuccess = (data: PostApiResultsType) => {
        const {posts: {updatePost = {}}} = data;
        return flux.dispatch({post: updatePost, type: POST_CONSTANTS.UPDATE_ITEM_SUCCESS});
      };

      const {post: updatedPost} = await appMutation(flux, 'updatePost', DATA_TYPE, queryVariables, ['postId', ...postProps], {onSuccess});
      return updatedPost as PostType;
    } catch(error) {
      flux.dispatch({error, type: POST_CONSTANTS.UPDATE_ITEM_ERROR});
      throw error;
    }
  };

  // Return the actions object
  return {
    add,
    itemById,
    listByLatest,
    listByLocation,
    listByReactions,
    listByTags,
    delete: deletePost,
    update,
    updatePostAdapter: postBase.updateAdapter,
    updatePostAdapterOptions: postBase.updateOptions
  };
};
