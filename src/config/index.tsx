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

export interface ConfigAppType {
  readonly name?: string;
  readonly session?: ConfigAppSessionType;
  readonly urls?: ConfigAppUrls;
  readonly version?: string;
}

export interface MetropolisConfiguration {
  readonly adapters?: MetropolisAdapters;
  readonly appConfig?: Partial<ConfigAppType>;
  readonly isAuth?: () => boolean;
}

export class Config {
  static values: any = {};

  static setConfig(values: object): any {
    this.values = merge(this.values, values);
    return this.values;
  }

  static get(path?: string | string[], defaultValue?: any): any {
    const environment: string = process.env.NODE_ENV || 'development';
    const configValues: object = {...this.values, environment};

    if(!path) {
      return configValues;
    }

    return get(configValues, path, defaultValue);
  }
}
