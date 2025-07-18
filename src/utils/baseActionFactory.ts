/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

import {createValidatorManager} from './validatorFactory';

import type {BaseAdapterOptions} from './validatorFactory';
import type {FluxFramework} from '@nlabs/arkhamjs';

export interface BaseActionOptions<T extends BaseAdapterOptions = BaseAdapterOptions> {
  adapter?: (input: unknown, options?: T) => any;
  adapterOptions?: T;
}

/**
 * Base action factory that provides common functionality for all action creators.
 * This consolidates the initialization and update patterns used across action files.
 *
 * @param flux - The flux framework instance
 * @param defaultValidator - The default validation function
 * @param options - Action options including adapter and adapter options
 * @returns An object with validator, update functions, and common utilities
 *
 * @example
 * const { validator, updateAdapter, updateOptions, createMutationAction } = createBaseActions(
 *   flux,
 *   defaultUserValidator,
 *   options
 * );
 */
export const createBaseActions = <T extends BaseAdapterOptions>(
  flux: FluxFramework,
  defaultValidator: (input: unknown, options?: T) => any,
  options?: BaseActionOptions<T>
) => {
  const {validator, updateAdapter, updateOptions} = createValidatorManager(
    defaultValidator,
    options?.adapterOptions
  );

  // Initialize with custom adapter if provided
  if(options?.adapter) {
    updateAdapter(options.adapter);
  }

  /**
   * Creates a mutation action with common error handling and dispatch patterns.
   * This consolidates the try-catch and dispatch logic used across action files.
   *
   * @param mutationName - The GraphQL mutation name
   * @param dataType - The data type for the mutation
   * @param queryVariables - Variables for the GraphQL query
   * @param props - Properties to select from the response
   * @param successType - The success action type
   * @param errorType - The error action type
   * @param mutationFn - The mutation function (appMutation, publicMutation, etc.)
   * @returns A function that executes the mutation with proper error handling
   */
  const createMutationAction = <R = any>(
    mutationName: string,
    dataType: string,
    queryVariables: Record<string, any>,
    props: string[],
    successType: string,
    errorType: string,
    mutationFn: any
  ) => async (input?: unknown): Promise<R> => {
    try {
      const variables = input ? {
        ...queryVariables,
        [Object.keys(queryVariables)[0]]: {
          ...queryVariables[Object.keys(queryVariables)[0]],
          value: validator(input)
        }
      } : queryVariables;

      const onSuccess = (data: any) => {
        const result = data[dataType]?.[mutationName] || {};
        return flux.dispatch({[dataType.slice(0, -1)]: result, type: successType});
      };

      const result = await mutationFn(
        flux,
        mutationName,
        dataType,
        variables,
        props,
        {onSuccess}
      );

      const key = Object.keys(result)[0];
      return result[key] as R;
    } catch(error) {
      flux.dispatch({error, type: errorType});
      throw error;
    }
  };

  /**
   * Creates a query action with common error handling and dispatch patterns.
   * This consolidates the try-catch and dispatch logic used across action files.
   *
   * @param queryName - The GraphQL query name
   * @param dataType - The data type for the query
   * @param queryVariables - Variables for the GraphQL query
   * @param props - Properties to select from the response
   * @param successType - The success action type
   * @param errorType - The error action type
   * @param queryFn - The query function (appQuery, publicQuery, etc.)
   * @returns A function that executes the query with proper error handling
   */
  const createQueryAction = <R = any>(
    queryName: string,
    dataType: string,
    queryVariables: Record<string, any>,
    props: string[],
    successType: string,
    errorType: string,
    queryFn: any
  ) => async (): Promise<R> => {
    try {
      const onSuccess = (data: any) => {
        const result = data[dataType]?.[queryName] || {};
        return flux.dispatch({[dataType.slice(0, -1)]: result, type: successType});
      };

      const result = await queryFn(
        flux,
        queryName,
        dataType,
        queryVariables,
        props,
        {onSuccess}
      );

      const key = Object.keys(result)[0];
      return result[key] as R;
    } catch(error) {
      flux.dispatch({error, type: errorType});
      throw error;
    }
  };

  return {
    createMutationAction,
    createQueryAction,
    flux,
    updateAdapter,
    updateOptions,
    validator
  };
};