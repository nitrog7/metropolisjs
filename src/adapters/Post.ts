/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {parseId, parseNum, parseString} from '@nlabs/utils/lib';
import isArray from 'lodash/isArray';
import isUndefined from 'lodash/isUndefined';

import {Adapter} from './Adapter';
import {Tag} from './Tag';
import {User} from './User';

export type PostData = {
  readonly _id?: string;
  readonly _key?: string;
  readonly added?: number | string;
  readonly cached?: number;
  readonly content?: string;
  readonly groupId?: string;
  readonly id?: string;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly location?: string;
  readonly mentions?: User[];
  readonly modified?: number | string;
  readonly name?: string;
  readonly postId?: string;
  readonly reactions?: string[];
  readonly tags?: Tag[];
  readonly type?: string;
  readonly user?: User;
};

export class Post extends Adapter {
  static TYPE = 'posts';
  static TYPE_ID = 'postId';

  cached?: number;
  content: string;
  groupId?: string;
  latitude?: number;
  longitude?: number;
  location?: string;
  mentions?: User[];
  name?: string;
  postId: string;
  reactions?: string[];
  tags?: Tag[];
  type?: string;
  user?: User;

  constructor(data: Partial<PostData>) {
    super(data);

    const {
      cached,
      content,
      groupId,
      latitude,
      longitude,
      location,
      mentions,
      name,
      reactions,
      tags,
      type,
      user
    } = data;

    if(!isUndefined(cached)) {
      this.cached = parseNum(cached);
    }

    if(!isUndefined(content)) {
      this.content = parseString(content);
    }

    if(!isUndefined(groupId)) {
      this.groupId = parseId(groupId);
    }

    if(!isUndefined(latitude)) {
      this.latitude = parseNum(latitude);
    }

    if(!isUndefined(longitude)) {
      this.longitude = parseNum(longitude);
    }

    if(!isUndefined(location)) {
      this.location = parseString(location);
    }

    if(!isUndefined(name)) {
      this.name = parseString(name);
    }

    this.mentions = isArray(mentions) ? mentions : [];

    this.reactions = isArray(reactions) ? reactions : [];

    this.tags = isArray(tags) ? tags.map((tag) => new Tag(tag)) : [];

    if(!isUndefined(type)) {
      this.type = parseString(type);
    }

    if(!isUndefined(user)) {
      this.user = user;
    }
  }

  getInput(): Partial<Post> {
    return this.getValues(['content', 'groupId', 'latitude', 'location', 'longitude', 'name', 'postId']);
  }
}
