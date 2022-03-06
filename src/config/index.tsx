/**
 * Copyright (c) 2018-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {FluxFramework} from '@nlabs/arkhamjs';
import get from 'lodash/get';
import merge from 'lodash/merge';

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
  readonly appConfig?: Partial<ConfigAppType>;
  readonly isAuth?: () => boolean;
}

export class Config {
  static flux: FluxFramework;
  static values: any = {};

  static setConfig(values: object): any {
    return merge(this.values, values);
  }

  static get(path: string | string[], defaultValue?: any): any {
    const environment: string = process.env.NODE_ENV || 'development';
    const configValues: object = {...this.values, environment};
    return get(configValues, path, defaultValue);
  }

  static getFlux(): FluxFramework {
    return this.flux;
  }

  static setFlux(flux: FluxFramework): void {
    this.flux = flux;
  }
}
