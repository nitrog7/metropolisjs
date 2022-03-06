/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {parseChar, parseId, parseString, parseUrl, parseVarChar} from '@nlabs/utils';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';

import {Adapter} from './Adapter';

export class Image extends Adapter {
  base64?: string;
  color?: string;
  description?: string;
  fileType?: string = 'image/jpeg';
  id?: string;
  imageId?: string;
  imageUrl?: string;
  itemId?: string;
  itemType?: string;
  likeCount?: number;
  thumbUrl?: string;
  userId?: string;
  viewCount?: number;

  getInput?: any;

  constructor(data: any) {
    super();

    const {_id, _key, base64, color, description, fileType, id, imageId, imageUrl, itemId, itemType, thumbUrl} = data;

    if(!isNil(_id) || isString(id)) {
      this.id = parseId(_id || id);
    }
    if(!isNil(_key) || isString(imageId)) {
      this.imageId = parseId(_key || imageId);
    }

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

    this.getInput = (): Partial<Image> =>
      this.getValues(['base64', 'description', 'fileType', 'id', 'imageId', 'itemId', 'itemType']);
  }
}
