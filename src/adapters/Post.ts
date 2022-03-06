/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {parseArangoId, parseId, parseNum, parseString} from '@nlabs/utils/lib';
import {isNil} from 'lodash';
import isArray from 'lodash/isArray';
import isUndefined from 'lodash/isUndefined';

import {Adapter} from './Adapter';
import {Tag} from './Tag';
import {User} from './User';

export class Post extends Adapter {
  added?: number;
  cached?: number;
  content: string;
  groupId?: string;
  id?: string;
  latitude?: number;
  longitude?: number;
  location?: string;
  mentions?: User[];
  modified?: number;
  name?: string;
  postId: string;
  reactions?: string[];
  tags?: Tag[];
  type?: string;
  user?: User;

  constructor(data: any) {
    super();

    const {
      _id,
      _key,
      added,
      cached,
      content,
      groupId,
      id,
      latitude,
      longitude,
      location,
      mentions,
      modified,
      name,
      postId,
      reactions,
      tags,
      type,
      user
    } = data;

    // ID
    if(!isNil(_id) || !isNil(id)) {
      this.id = parseArangoId(_id || id);
    } else if(!isNil(postId)) {
      this.id = `posts/${parseId(postId)}`;
    }
    if(!isNil(_key) || !isNil(postId)) {
      this.postId = this.postId;
    }

    if(!isUndefined(added)) {
      this.added = parseNum(added);
    }

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

    if(!isUndefined(modified)) {
      this.modified = parseNum(modified);
    }

    this.reactions = isArray(reactions) ? reactions : [];

    this.tags = isArray(tags) ? tags : [];

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
