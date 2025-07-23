/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

export interface BaseAdapterOptions {
  strict?: boolean;
  allowPartial?: boolean;
  environment?: 'development' | 'production' | 'test';
  customValidation?: (input: unknown) => unknown;
}

/**
 * Creates a validator factory that merges custom adapters with default behavior.
 * This eliminates code duplication across all action files.
 *
 * @param defaultValidator - The default validation function
 * @param customAdapter - Optional custom adapter function
 * @param options - Adapter options
 * @returns A validator function that applies default + custom validation
 *
 * @example
 * const validateUser = createValidatorFactory(
 *   defaultUserValidator,
 *   customUserAdapter,
 *   userAdapterOptions
 * );
 */
export const createValidatorFactory = <T extends BaseAdapterOptions>(
  defaultValidator: (input: unknown, options?: T) => any,
  customAdapter?: (input: unknown, options?: T) => any,
  options?: T
) => (input: unknown, validatorOptions?: T) => {
  const mergedOptions = {...options, ...validatorOptions};

  let validated = defaultValidator(input, mergedOptions as T);

  if(customAdapter) {
    validated = customAdapter(validated, mergedOptions as T);
  }

  if(mergedOptions?.customValidation) {
    validated = mergedOptions.customValidation(validated);
  }

  return validated;
};

/**
 * Creates a validator manager that handles adapter updates and recreation.
 * This centralizes the update logic that's duplicated across action files.
 *
 * @param defaultValidator - The default validation function
 * @param initialOptions - Initial adapter options
 * @returns An object with validator and update functions
 *
 * @example
 * const { validator, updateAdapter, updateOptions } = createValidatorManager(
 *   defaultUserValidator,
 *   userAdapterOptions
 * );
 */
export const createValidatorManager = <T extends BaseAdapterOptions>(
  defaultValidator: (input: unknown, options?: T) => any,
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  initialOptions: T = {} as T
) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const defaultOptions: T = {} as T;

  let adapterOptions: T = {...defaultOptions, ...initialOptions};
  let customAdapter: ((input: unknown, options?: T) => any) | undefined;

  let validator = createValidatorFactory(defaultValidator, customAdapter, adapterOptions);

  const updateAdapter = (adapter: (input: unknown, options?: T) => any): void => {
    customAdapter = adapter;
    validator = createValidatorFactory(defaultValidator, customAdapter, adapterOptions);
  };

  const updateOptions = (options: T): void => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    adapterOptions = {...adapterOptions, ...options} as T;
    validator = createValidatorFactory(defaultValidator, customAdapter, adapterOptions);
  };

  return {
    getCustomAdapter: () => customAdapter,
    getOptions: () => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const options: T = {...adapterOptions} as T;
      return options;
    },
    updateAdapter,
    updateOptions,
    validator
  };
};