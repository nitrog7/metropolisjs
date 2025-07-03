/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {parseId, parseNum, parseString, parseVarChar} from '@nlabs/utils';

import {Post} from '../adapters/legacyCompatibility';
import {PostConstants} from '../stores/postStore';
import {appMutation, appQuery} from '../utils/api';

import type {ReaktorDbCollection} from '../utils/api';
import type {FluxFramework} from '@nlabs/arkhamjs';

const DATA_TYPE: ReaktorDbCollection = 'posts';

export type PostApiResultsType = {
  posts: {
    addPost: Post;
    getPost: Post;
    getPostsByLatest: Post[];
    getPostsByLocation: Post[];
    getPostsByReactions: Post[];
    getPostsByTags: Post[];
    deletePost: Post;
    updatePost: Post;
  };
};

export class PostActions {
  CustomAdapter: typeof Post;
  flux: FluxFramework;

  constructor(flux: FluxFramework, CustomAdapter: typeof Post = Post) {
    this.CustomAdapter = CustomAdapter;
    this.flux = flux;
  }

  async add(postData: Partial<Post>, postProps: string[] = [], CustomClass: typeof Post = Post): Promise<Post> {
    const {content, latitude, location, longitude, name} = postData;

    try {
      const parsedData = {
        content: parseString(content, 100000),
        latitude: parseNum(latitude),
        location: parseString(location, 160),
        longitude: parseNum(longitude),
        name: parseVarChar(name, 100)
      };

      const queryVariables = {
        post: {
          type: 'PostInput!',
          value: parsedData
        }
      };
      const onSuccess = (data: PostApiResultsType) => {
        const {posts: {addPost = {}}} = data;
        return this.flux.dispatch({post: new CustomClass(addPost), type: PostConstants.ADD_ITEM_SUCCESS});
      };

      const {post: addedPost} = await appMutation(this.flux, 'addPost', DATA_TYPE, queryVariables, ['postId', ...postProps], {onSuccess});
      return addedPost as Post;
    } catch(error) {
      this.flux.dispatch({error, type: PostConstants.ADD_ITEM_ERROR});
      throw error;
    }
  }

  async itemById(postId: string, postProps: string[] = [], CustomClass: typeof Post = Post): Promise<Post> {
    try {
      const queryVariables = {
        postId: {
          type: 'ID!',
          value: parseId(postId)
        }
      };

      const onSuccess = (data: PostApiResultsType) => {
        const {posts: {getPost: post = {}}} = data;
        return this.flux.dispatch({post: new CustomClass(post), type: PostConstants.GET_ITEM_SUCCESS});
      };

      const {post: postResult} = await appQuery(
        this.flux,
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
      return postResult as Post;
    } catch(error) {
      this.flux.dispatch({error, type: PostConstants.GET_ITEM_ERROR});
      throw error;
    }
  }

  async listByLatest(
    from: number = 0,
    to: number = 0,
    postProps: string[] = [],
    CustomClass: typeof Post = Post
  ): Promise<Post[]> {
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
        return this.flux.dispatch({
          list: postsByLatest.map((item) => new CustomClass(item)),
          type: PostConstants.GET_LIST_SUCCESS
        });
      };

      const {postsByLatest: list} = await appQuery(
        this.flux,
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
      return list as Post[];
    } catch(error) {
      this.flux.dispatch({error, type: PostConstants.GET_LIST_ERROR});
      throw error;
    }
  }

  async listByLocation(
    latitude: number,
    longitude: number,
    from: number = 0,
    to: number = 10,
    postProps: string[] = [],
    CustomClass: typeof Post = Post
  ): Promise<Post[]> {
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
        return this.flux.dispatch({
          list: postsByLocation.map((item) => new CustomClass(item)),
          type: PostConstants.GET_LIST_SUCCESS
        });
      };

      const {getPostsByLocation: list} = await appQuery(
        this.flux,
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
      return list as Post[];
    } catch(error) {
      this.flux.dispatch({error, type: PostConstants.GET_LIST_ERROR});
      throw error;
    }
  }

  async listByReactions(
    reactionNames: string[],
    latitude: number,
    longitude: number,
    from: number = 0,
    to: number = 10,
    postProps: string[] = [],
    CustomClass: typeof Post = Post
  ): Promise<Post[]> {
    try {
      const queryVariables = {
        latitude: {
          type: 'Int',
          value: parseNum(latitude)
        },
        longitude: {
          type: 'Int',
          value: parseNum(longitude)
        },
        from: {
          type: 'Int',
          value: parseNum(from)
        },
        reactionNames: {
          type: '[String]',
          value: reactionNames.map((name) => parseString(name))
        },
        to: {
          type: 'Int',
          value: parseNum(to)
        }
      };

      const onSuccess = (data: PostApiResultsType) => {
        const {posts: {getPostsByReactions: postsByReactions = []}} = data;
        return this.flux.dispatch({
          list: postsByReactions.map((item) => new CustomClass(item)),
          type: PostConstants.GET_LIST_SUCCESS
        });
      };

      const {postsByReactions: list} = await appQuery(
        this.flux,
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
      return list as Post[];
    } catch(error) {
      this.flux.dispatch({error, type: PostConstants.GET_LIST_ERROR});
      throw error;
    }
  }

  async listByTags(
    tags: string[],
    latitude: number,
    longitude: number,
    from: number = 0,
    to: number = 10,
    postProps: string[] = [],
    CustomClass: typeof Post = Post
  ): Promise<Post[]> {
    const formatTags: string[] = tags.map((tag: string) => tag.trim().toLowerCase());

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
          type: '[TagInput]',
          value: formatTags
        },
        to: {
          type: 'Int',
          value: parseNum(to)
        }
      };

      const onSuccess = (data: PostApiResultsType) => {
        const {posts: {getPostsByTags: postsByTags = []}} = data;
        return this.flux.dispatch({
          list: postsByTags.map((item) => new CustomClass(item)),
          type: PostConstants.GET_LIST_SUCCESS
        });
      };

      const {postsByTags: list} = await appQuery(
        this.flux,
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
      return list as Post[];
    } catch(error) {
      this.flux.dispatch({error, type: PostConstants.GET_LIST_ERROR});
      throw error;
    }
  }

  async delete(postId: string, postProps: string[] = [], CustomClass: typeof Post = Post): Promise<Post> {
    try {
      const queryVariables = {
        postId: {
          type: 'ID!',
          value: postId
        }
      };
      const onSuccess = (data: PostApiResultsType) => {
        const {posts: {deletePost: post = {}}} = data;
        return this.flux.dispatch({post: new CustomClass(post), type: PostConstants.REMOVE_ITEM_SUCCESS});
      };

      const {deletePost: deletedPost} = await appMutation(this.flux, 'deletePost', DATA_TYPE, queryVariables, ['postId', ...postProps], {onSuccess});
      return deletedPost as Post;
    } catch(error) {
      this.flux.dispatch({error, type: PostConstants.REMOVE_ITEM_ERROR});
      throw error;
    }
  }

  async update(post: Post, postProps: string[] = [], CustomClass: typeof Post = Post): Promise<Post> {
    try {
      const queryVariables = {
        post: {
          type: 'ID!',
          value: post
        }
      };

      const onSuccess = (data: PostApiResultsType) => {
        const {posts: {updatePost: post = {}}} = data;
        return this.flux.dispatch({post: new CustomClass(post), type: PostConstants.UPDATE_ITEM_SUCCESS});
      };

      const {updatePost: updatedPost} = await appMutation(
        this.flux,
        'updatePost',
        DATA_TYPE,
        queryVariables,
        ['added', 'content', 'name', 'postId', ...postProps],
        {onSuccess}
      );
      return updatedPost as Post;
    } catch(error) {
      this.flux.dispatch({error, type: PostConstants.UPDATE_ITEM_ERROR});
      throw error;
    }
  }
}
