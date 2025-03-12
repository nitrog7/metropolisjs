/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {parseBoolean, parseChar, parseId, parseNum, parseString} from '@nlabs/utils';
import {isArray} from 'lodash';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';

import {Adapter} from './Adapter';
import {Tag} from './Tag';

import type {Image} from './Image';

export interface ProfileData {
  readonly _id?: string;
  readonly _key?: string;
  readonly active: boolean;
  readonly added: number;
  readonly gender: string;
  readonly hasLike: boolean;
  readonly hasView: boolean;
  readonly id: string;
  readonly images: Image[];
  readonly imageCount: number;
  readonly imageId: string;
  readonly imageUrl: string;
  readonly likeCount: number;
  readonly modified: number;
  readonly name: string;
  readonly tags: Tag[];
  readonly thumbUrl: string;
  readonly userId: string;
  readonly viewCount: number;
}

export class Profile extends Adapter {
  static TYPE = 'profiles';
  static TYPE_ID = 'profileId';

  active: boolean;
  gender: string;
  hasLike: boolean;
  hasView: boolean;
  images: Image[];
  imageCount: number;
  imageId: string;
  imageUrl: string;
  likeCount: number;
  name: string;
  tags: Tag[];
  thumbUrl: string;
  userId: string;
  viewCount: number;

  constructor(data: Partial<ProfileData>) {
    super(data);

    const {
      active,
      gender,
      hasLike,
      hasView,
      images,
      imageCount,
      imageId,
      imageUrl,
      likeCount,
      name,
      tags,
      thumbUrl,
      userId,
      viewCount
    } = data;

    if(!isNil(userId)) {
      this.userId = parseId(userId);
    }
    if(!isNil(name)) {
      this.name = parseString(name, 64);
    }

    // Stats
    if(!isNil(hasLike)) {
      this.hasLike = parseBoolean(hasLike);
    }
    if(!isNil(hasView)) {
      this.hasView = parseBoolean(hasView);
    }
    if(!isNil(likeCount)) {
      this.likeCount = parseNum(likeCount);
    }
    if(!isNil(viewCount)) {
      this.viewCount = parseNum(viewCount);
    }

    // Active status
    if(!isNil(active)) {
      this.active = parseBoolean(active);
    }

    // Images
    if(!isNil(images)) {
      this.images = images;
    }
    if(!isNil(imageCount)) {
      this.imageCount = parseNum(imageCount);
    }
    if(!isNil(imageId)) {
      this.imageId = parseId(imageId);
    }
    if(!isNil(imageUrl)) {
      this.imageUrl = imageUrl;
    }
    if(isString(thumbUrl)) {
      this.thumbUrl = thumbUrl;
    }

    // Gender
    if(isString(gender)) {
      this.gender = parseChar(data.gender, 1);
    }

    // Tags
    if(isArray(tags)) {
      this.tags = tags.map((tag) => new Tag(tag));
    }
  }

  getInput(): Partial<Profile> {
    return this.getValues([
      'active',
      'added',
      'gender',
      'hasLike',
      'hasView',
      'imageId',
      'imageUrl',
      'likeCount',
      'modified',
      'name',
      'tags',
      'thumbUrl',
      'timestamp',
      'token',
      'userId',
      'viewCount'
    ]);
  }
}
