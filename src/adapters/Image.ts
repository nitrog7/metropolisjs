/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {parseChar, parseId, parseString, parseUrl, parseVarChar} from '@nlabs/utils';
import isString from 'lodash/isString';

import {Adapter} from './Adapter';

export interface ImageData {
  readonly _id?: string;
  readonly _key?: string;
  readonly base64?: string;
  readonly color?: string;
  readonly description?: string;
  readonly fileType?: string;
  readonly id?: string;
  readonly imageId?: string;
  readonly imageUrl?: string;
  readonly itemId?: string;
  readonly itemType?: string;
  readonly thumbUrl?: string;
}

export class Image extends Adapter {
  static TYPE = 'images';
  static TYPE_ID = 'imageId';

  base64?: string;
  color?: string;
  description?: string;
  fileType?: string = 'image/jpeg';
  imageId?: string;
  imageUrl?: string;
  itemId?: string;
  itemType?: string;
  likeCount?: number;
  thumbUrl?: string;
  userId?: string;
  viewCount?: number;

  getInput: () => Partial<Image> = () =>
    this.getValues(['base64', 'description', 'fileType', 'id', 'imageId', 'itemId', 'itemType']);

  constructor(data: Partial<ImageData>) {
    super(data);

    const {base64, color, description, fileType, imageUrl, itemId, itemType, thumbUrl} = data;

    if(isString(base64)) {
      this.base64 = parseString(base64);
    }
    if(isString(color)) {
      this.color = parseVarChar(color, 7);
    }

    if(isString(description)) {
      this.description = parseString(description, 500);
    }

    if(isString(fileType)) {
      this.fileType = parseChar(fileType, 16);
    }

    if(isString(imageUrl)) {
      this.imageUrl = parseUrl(imageUrl);
    }
    if(isString(thumbUrl)) {
      this.thumbUrl = parseUrl(thumbUrl);
    }

    if(isString(itemId)) {
      this.itemId = parseId(itemId);
    }

    if(isString(itemType)) {
      this.itemType = parseChar(itemType, 16);
    }
  }
}
