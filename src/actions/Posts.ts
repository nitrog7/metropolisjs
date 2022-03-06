/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {FluxFramework} from '@nlabs/arkhamjs';
import {parseId, parseNum, parseString, parseVarChar} from '@nlabs/utils';

import {Post} from '../adapters/Post';
import {
  POST_ADD_ERROR,
  POST_ADD_SUCCESS,
  POST_GET_ERROR,
  POST_GET_LIST_ERROR,
  POST_GET_LIST_SUCCESS,
  POST_GET_SUCCESS,
  POST_REMOVE_ERROR,
  POST_REMOVE_SUCCESS,
  POST_UPDATE_ERROR,
  POST_UPDATE_SUCCESS
} from '../stores/postStore';
import {ApiResultsType, appMutation, appQuery} from '../utils/api';

export class Posts {
  flux: FluxFramework;

  constructor(flux: FluxFramework) {
    this.flux = flux;
  }

  async addPost(postData: any, postProps: string[] = [], CustomClass = Post): Promise<any> {
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
      const onSuccess = (data: ApiResultsType = {}) => {
        const {addPost = {}} = data;
        return this.flux.dispatch({post: new CustomClass(addPost), type: POST_ADD_SUCCESS});
      };

      return await appMutation(this.flux, 'addPost', queryVariables, ['postId', ...postProps], {onSuccess});
    } catch(error) {
      return this.flux.dispatch({error, type: POST_ADD_ERROR});
    }
  }

  async getPost(postId: string, postProps: string[] = [], CustomClass = Post): Promise<any> {
    try {
      const queryVariables = {
        postId: {
          type: 'ID!',
          value: parseId(postId)
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {post = {}} = data;
        return this.flux.dispatch({post: new CustomClass(post), type: POST_GET_SUCCESS});
      };

      return await appQuery(
        this.flux,
        'post',
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
    } catch(error) {
      return this.flux.dispatch({error, type: POST_GET_ERROR});
    }
  }

  async getPostsByLatest(from: number = 0, to: number = 0, postProps: string[] = [], CustomClass = Post): Promise<any> {
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

      const onSuccess = (data: ApiResultsType = {}) => {
        const {postsByLatest = []} = data;
        return this.flux.dispatch({
          list: postsByLatest.map((item) => new CustomClass(item)),
          type: POST_GET_LIST_SUCCESS
        });
      };

      return await appQuery(
        this.flux,
        'postsByLatest',
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
    } catch(error) {
      return this.flux.dispatch({error, type: POST_GET_LIST_ERROR});
    }
  }

  async getPostsByLocation(
    latitude: number,
    longitude: number,
    from: number = 0,
    to: number = 10,
    postProps: string[] = [],
    CustomClass = Post
  ): Promise<any> {
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

      const onSuccess = (data: ApiResultsType = {}) => {
        const {getPostsByLocation = {}} = data;
        return this.flux.dispatch({
          list: getPostsByLocation.map((item) => new CustomClass(item)),
          type: POST_GET_LIST_SUCCESS
        });
      };

      return await appQuery(
        this.flux,
        'postsByLocation',
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
    } catch(error) {
      return this.flux.dispatch({error, type: POST_GET_LIST_ERROR});
    }
  }

  async getPostsByReactions(
    reactionName: string,
    latitude: number,
    longitude: number,
    from: number = 0,
    to: number = 10,
    postProps: string[] = [],
    CustomClass = Post
  ): Promise<any> {
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
        reactionName: {
          type: 'String',
          value: parseString(reactionName)
        },
        to: {
          type: 'Int',
          value: parseNum(to)
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {postsByReactions = []} = data;
        return this.flux.dispatch({
          list: postsByReactions.map((item) => new CustomClass(item)),
          type: POST_GET_LIST_SUCCESS
        });
      };

      return await appQuery(
        this.flux,
        'postsByReactions',
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
    } catch(error) {
      return this.flux.dispatch({error, type: POST_GET_LIST_ERROR});
    }
  }

  async getPostsByTags(
    tags: string[],
    latitude: number,
    longitude: number,
    from: number = 0,
    to: number = 10,
    postProps: string[] = [],
    CustomClass = Post
  ): Promise<any> {
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

      const onSuccess = (data: ApiResultsType = {}) => {
        const {postsByTags = {}} = data;
        return this.flux.dispatch({
          list: postsByTags.map((item) => new CustomClass(item)),
          type: POST_GET_LIST_SUCCESS
        });
      };

      return await appQuery(
        this.flux,
        'postsByTags',
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
    } catch(error) {
      return this.flux.dispatch({error, type: POST_GET_LIST_ERROR});
    }
  }

  async deletePost(postId: string, postProps: string[] = [], CustomClass = Post): Promise<any> {
    try {
      const queryVariables = {
        postId: {
          type: 'ID!',
          value: postId
        }
      };
      const onSuccess = (data: ApiResultsType = {}) => {
        const {deletePost = {}} = data;
        return this.flux.dispatch({post: new CustomClass(deletePost), type: POST_REMOVE_SUCCESS});
      };

      return await appMutation(this.flux, 'deletePost', queryVariables, ['postId', ...postProps], {onSuccess});
    } catch(error) {
      return this.flux.dispatch({error, type: POST_REMOVE_ERROR});
    }
  }

  async updatePost(post: any, postProps: string[] = [], CustomClass = Post): Promise<any> {
    try {
      const queryVariables = {
        post: {
          type: 'ID!',
          value: post
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {updatePost = {}} = data;
        return this.flux.dispatch({post: new CustomClass(updatePost), type: POST_UPDATE_SUCCESS});
      };

      return await appMutation(
        this.flux,
        'updatePost',
        queryVariables,
        ['added', 'content', 'name', 'postId', ...postProps],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: POST_UPDATE_ERROR});
    }
  }
}
