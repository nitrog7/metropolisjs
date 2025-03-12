/**
 * Copyright (c) 2018-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import get from 'lodash/get';
import merge from 'lodash/merge';

import {MetropolisAdapters} from '../utils/MetropolisProvider';

export interface ConfigAppSessionType {
  readonly maxMinutes?: number;
  readonly minMinutes?: number;
}

export interface ConfigAppUrls {
  readonly websocket?: string;
}

export interface ConfigAppApiType {
  readonly public?: string;
  readonly url?: string;
  readonly uploadImage?: string;
}

export interface ConfigAppType {
  readonly api?: ConfigAppApiType;
  readonly name?: string;
  readonly session?: ConfigAppSessionType;
  readonly urls?: ConfigAppUrls;
  readonly version?: string;
}

export interface MetropolisConfiguration {
  readonly adapters?: MetropolisAdapters;
  readonly app?: Partial<ConfigAppType>;
  readonly environment?: string;
  readonly isAuth?: () => boolean;
}

export class Config {
  static values: Record<string, unknown> = {};

  static setConfig(values: MetropolisConfiguration): MetropolisConfiguration {
    this.values = merge(this.values, values);
    return this.values;
  }

  static get<T = unknown>(path?: string | string[], defaultValue?: T): T {
    const environment: string = process.env.NODE_ENV || 'development';
    const configValues: MetropolisConfiguration = {...this.values, environment};

    if(!path) {
      return configValues as T;
    }

    return get(configValues, path, defaultValue) as T;
  }
}
