/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {FluxFramework} from '@nlabs/arkhamjs';
import {parseString} from '@nlabs/utils';

import {Image} from '../adapters/Image';
import {Config} from '../config';
import {
  IMAGE_ADD_ERROR,
  IMAGE_ADD_SUCCESS,
  IMAGE_DELETE_ERROR,
  IMAGE_DELETE_SUCCESS,
  IMAGE_GET_COUNT_ERROR,
  IMAGE_GET_COUNT_SUCCESS,
  IMAGE_GET_LIST_ERROR,
  IMAGE_GET_LIST_SUCCESS,
  IMAGE_UPLOAD_ERROR,
  IMAGE_UPLOAD_SUCCESS
} from '../stores/imageStore';
import {ApiResultsType, appMutation, appQuery, uploadImage} from '../utils/api';
import {convertFileToBase64} from '../utils/file';

export class Images {
  flux: FluxFramework;

  constructor(flux: FluxFramework) {
    this.flux = flux;
  }

  async addUserImage(image: Partial<Image>, type: string = 'image', CustomClass: any = Image): Promise<any> {
    try {
      const {base64, description, itemId} = new Image(image).getInput();
      const formatImage = {
        base64,
        description: description ? parseString(description, 500) : undefined,
        fileType: 'image/jpeg',
        itemId,
        itemType: type
      };

      const {image: newImage} = await uploadImage(formatImage);
      return this.flux.dispatch({image: new CustomClass(newImage), type: IMAGE_ADD_SUCCESS});
    } catch(error) {
      return this.flux.dispatch({error, type: IMAGE_ADD_ERROR});
    }
  }

  async deleteImage(imageId: string, imageProps: string[] = [], CustomClass: any = Image): Promise<any> {
    try {
      const queryVariables = {
        imageId: {
          type: 'ID!',
          value: imageId
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {deleteImage = {}} = data;
        return this.flux.dispatch({image: new CustomClass(deleteImage), type: IMAGE_DELETE_SUCCESS});
      };

      return await appMutation(this.flux, 'deleteImage', queryVariables, ['id', ...imageProps], {onSuccess});
    } catch(error) {
      return this.flux.dispatch({error, type: IMAGE_DELETE_ERROR});
    }
  }

  async uploadFileImages(imageFiles: File[], itemId: string, itemType: string = 'users'): Promise<any> {
    try {
      const savedImages = await Promise.all(
        imageFiles.map(async (file: File) => {
          const base64: string = await convertFileToBase64(file, Config.get('app.images.maxImageSize'));
          const {type: fileType} = file;
          return this.addUserImage({base64, fileType, itemId}, itemType);
        })
      );

      return this.flux.dispatch({images: savedImages, type: IMAGE_UPLOAD_SUCCESS});
    } catch(error) {
      return this.flux.dispatch({error, type: IMAGE_UPLOAD_ERROR});
    }
  }

  async getImageCount(itemId: string): Promise<any> {
    try {
      const queryVariables = {
        itemId: {
          type: 'String!',
          value: itemId
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {imageCount: count = 0} = data;
        return this.flux.dispatch({itemId, count, type: IMAGE_GET_COUNT_SUCCESS});
      };

      return appQuery(this.flux, 'imageCount', queryVariables, ['count'], {onSuccess});
    } catch(error) {
      return this.flux.dispatch({error, type: IMAGE_GET_COUNT_ERROR});
    }
  }

  getImagesByItem(
    itemId: string,
    from: number = 0,
    to: number = 10,
    imageProps: string[] = [],
    CustomClass: any = Image
  ): Promise<any> {
    try {
      const queryVariables = {
        from: {
          type: 'Int',
          value: from
        },
        itemId: {
          type: 'ID!',
          value: itemId
        },
        to: {
          type: 'Int',
          value: to
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {imagesByItem = []} = data;
        return this.flux.dispatch({
          itemId,
          list: imagesByItem.map((item) => new CustomClass(item)),
          type: IMAGE_GET_LIST_SUCCESS
        });
      };

      return appQuery(
        this.flux,
        'imagesByItem',
        queryVariables,
        [
          'color',
          'description',
          'height',
          'imageId',
          'imageUrl',
          'likeCount',
          'thumbUrl',
          'userId',
          'viewCount',
          'width',
          ...imageProps
        ],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: IMAGE_GET_LIST_ERROR});
    }
  }

  getImagesByReactions(
    reactions: string[],
    from: number = 0,
    to: number = 10,
    imageProps: string[] = [],
    CustomClass: any = Image
  ): Promise<any> {
    try {
      const queryVariables = {
        from: {
          type: 'Int',
          value: from
        },
        reactions: {
          type: '[String]!',
          value: reactions
        },
        to: {
          type: 'Int',
          value: to
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {imagesByReaction = []} = data;
        return this.flux.dispatch({
          list: imagesByReaction.map((item) => new CustomClass(item)),
          type: IMAGE_GET_LIST_SUCCESS
        });
      };

      return appQuery(
        this.flux,
        'imagesByReaction',
        queryVariables,
        [
          'color',
          'description',
          'height',
          'imageId',
          'imageUrl',
          'likeCount',
          'thumbUrl',
          'userId',
          'viewCount',
          'width',
          ...imageProps
        ],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: IMAGE_GET_LIST_ERROR});
    }
  }
}
