/**
 * Copyright (c) 2018-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {get, merge} from '@nlabs/utils';

import type {MetropolisAdapters} from '../utils/MetropolisProvider';

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
  readonly local?: MetropolisEnvironmentConfiguration;
  readonly development?: MetropolisEnvironmentConfiguration;
  readonly production?: MetropolisEnvironmentConfiguration;
  readonly test?: MetropolisEnvironmentConfiguration;
}

export interface MetropolisEnvironmentConfiguration {
  readonly adapters?: MetropolisAdapters;
  readonly app?: Partial<ConfigAppType>;
  readonly environment?: string;
  readonly isAuth?: () => boolean;
}

export class Config {
  private static updatedConfig = {};

  static values(): MetropolisConfiguration {
    return {
      development: {
        app: {
          api: {
            public: 'http://localhost:3000/public',
            url: 'http://localhost:3000/app'
          }
        },
        environment: 'development',
        isAuth: () => true
      },
      local: {
        app: {
          api: {
            public: 'https://dev-api.torch.one/public',
            url: 'https://dev-api.torch.one/app'
          }
        },
        environment: 'local',
        isAuth: () => true
      },
      production: {
        app: {
          api: {
            public: 'https://api.torch.one/public',
            url: 'https://api.torch.one/app'
          }
        },
        environment: 'production',
        isAuth: () => true
      },
      test: {
        app: {
          api: {
            public: 'http://localhost:3000/public',
            url: 'http://localhost:3000/app'
          }
        },
        environment: 'test',
        isAuth: () => true
      }
    };
  }

  static set(override: object, environment?: string): object {
    const currentConfig = this.get();
    const targetEnvironment = environment || process.env.stage || process.env.NODE_ENV || 'local';

    if(override[targetEnvironment]) {
      this.updatedConfig = merge({}, currentConfig, override[targetEnvironment]);
    } else {
      this.updatedConfig = merge({}, currentConfig, override);
    }

    return {...this.updatedConfig};
  }

  static reset(): void {
    this.updatedConfig = {};
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static get<T = any>(path?: string | string[], defaultValue?: T): T {
    const baseConfig: MetropolisConfiguration = this.updatedConfig || this.values();
    const environment: string = process.env.stage || process.env.NODE_ENV || 'local';

    if(this.updatedConfig) {
      const overrideEnvironmentConfig = this.updatedConfig[environment] || {};
      const config = merge({}, baseConfig, overrideEnvironmentConfig);

      return path ? get(config, path, defaultValue) : config;
    }

    const localConfig = baseConfig?.local || {};
    const config = merge({}, localConfig, baseConfig[environment] || {});

    return path ? get(config, path, defaultValue) : config;
  }
}
