/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {parseString} from '@nlabs/utils';

import {Image} from '../adapters/Image';
import {Config} from '../config';
import {ImageConstants} from '../stores/imageStore';
import {appMutation, appQuery, uploadImage} from '../utils/api';
import {convertFileToBase64} from '../utils/file';

import type {ApiResultsType,ReaktorDbCollection} from '../utils/api';
import type {FluxFramework} from '@nlabs/arkhamjs';

const DATA_TYPE: ReaktorDbCollection = 'images';

export type ImageApiResultsType = {
  addImage: Image;
  deleteImage: Image;
  image: Image;
  updateImage: Image;
  uploadFileImages: Image[];
  getImageCount: number;
  getImagesByItem: Image[];
  getImagesByReactions: Image[];
};


export class ImageActions {
  CustomAdapter: typeof Image;
  flux: FluxFramework;

  constructor(flux: FluxFramework, CustomAdapter: typeof Image = Image) {
    this.CustomAdapter = CustomAdapter;
    this.flux = flux;
  }

  async add(
    image: Partial<Image>,
    type: string = 'image',
    CustomClass: typeof Image = Image
  ): Promise<Image> {
    try {
      const {base64, description, itemId} = new Image(image).getInput();
      const formatImage = {
        base64,
        description: description ? parseString(description, 500) : undefined,
        fileType: 'image/jpeg',
        itemId,
        itemType: type
      };

      const {image: newImage} = await uploadImage(this.flux, formatImage);
      await this.flux.dispatch({image: new CustomClass(newImage), type: ImageConstants.ADD_ITEM_SUCCESS});
      return newImage as Image;
    } catch(error) {
      this.flux.dispatch({error, type: ImageConstants.ADD_ITEM_ERROR});
      throw error;
    }
  }

  async delete(
    imageId: string,
    imageProps: string[] = [],
    CustomClass: typeof Image = Image
  ): Promise<Image> {
    try {
      const queryVariables = {
        imageId: {
          type: 'ID!',
          value: imageId
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {deleteImage = {}} = data;
        return this.flux.dispatch({image: new CustomClass(deleteImage), type: ImageConstants.REMOVE_ITEM_SUCCESS});
      };

      const {deleteImage} = await appMutation(this.flux, 'deleteImage', DATA_TYPE, queryVariables, ['id', ...imageProps], {onSuccess});
      return deleteImage as Image;
    } catch(error) {
      this.flux.dispatch({error, type: ImageConstants.REMOVE_ITEM_ERROR});
      throw error;
    }
  }

  async update(
    image: Partial<Image>,
    type: string = 'image',
    CustomClass: typeof Image = Image
  ): Promise<Image> {
    try {
      const {base64, description, itemId} = new Image(image).getInput();
      const formatImage = {
        base64,
        description: description ? parseString(description, 500) : undefined,
        fileType: 'image/jpeg',
        itemId,
        itemType: type
      };

      const {image: newImage} = await uploadImage(this.flux, formatImage);
      await this.flux.dispatch({image: new CustomClass(newImage), type: ImageConstants.ADD_ITEM_SUCCESS});
      return newImage as Image;
    } catch(error) {
      this.flux.dispatch({error, type: ImageConstants.ADD_ITEM_ERROR});
      throw error;
    }
  }

  async upload(
    imageFiles: File[],
    itemId: string,
    itemType: string = 'users'
  ): Promise<Image[]> {
    try {
      const savedImages = await Promise.all(
        imageFiles.map(async (file: File) => {
          const base64: string = await convertFileToBase64(file, Config.get('app.images.maxImageSize'));
          const {type: fileType} = file;
          return this.add({base64, fileType, itemId}, itemType);
        })
      );

      await this.flux.dispatch({images: savedImages, type: ImageConstants.UPLOAD_ITEM_SUCCESS});
      return savedImages;
    } catch(error) {
      this.flux.dispatch({error, type: ImageConstants.UPLOAD_ITEM_ERROR});
      throw error;
    }
  }

  async countByItem(itemId: string): Promise<number> {
    try {
      const queryVariables = {
        itemId: {
          type: 'String!',
          value: itemId
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {imageCount: count = 0} = data;
        return this.flux.dispatch({itemId, count, type: ImageConstants.GET_COUNT_SUCCESS});
      };

      const {imageCount} = await appQuery(this.flux, 'imageCount', DATA_TYPE, queryVariables, ['count'], {onSuccess});
      return imageCount as number;
    } catch(error) {
      this.flux.dispatch({error, type: ImageConstants.GET_COUNT_ERROR});
      throw error;
    }
  }

  async listByItem(
    itemId: string,
    from: number = 0,
    to: number = 10,
    imageProps: string[] = [],
    CustomClass: typeof Image = Image
  ): Promise<Image[]> {
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
        const {imagesByItem = []} = data as {imagesByItem: Image[]};
        return this.flux.dispatch({
          itemId,
          list: imagesByItem.map((item) => new CustomClass(item)),
          type: ImageConstants.GET_LIST_SUCCESS
        });
      };

      const {imagesByItem} = await appQuery(
        this.flux,
        'imagesByItem',
        DATA_TYPE,
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
      return imagesByItem as Image[];
    } catch(error) {
      this.flux.dispatch({error, type: ImageConstants.GET_LIST_ERROR});
      throw error;
    }
  }

  async listByReactions(
    reactions: string[],
    from: number = 0,
    to: number = 10,
    imageProps: string[] = [],
    CustomClass: typeof Image = Image
  ): Promise<Image[]> {
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
        const {imagesByReaction = []} = data as {imagesByReaction: Image[]};
        return this.flux.dispatch({
          list: imagesByReaction.map((item) => new CustomClass(item)),
          type: ImageConstants.GET_LIST_SUCCESS
        });
      };

      const {imagesByReaction: list} = await appQuery(
        this.flux,
        'imagesByReaction',
        DATA_TYPE,
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
      return list as Image[];
    } catch(error) {
      this.flux.dispatch({error, type: ImageConstants.GET_LIST_ERROR});
      throw error;
    }
  }
}
