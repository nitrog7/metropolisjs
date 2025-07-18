/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {Flux} from '@nlabs/arkhamjs';

import {validateReactionInput} from '../../adapters/reactionAdapter/reactionAdapter';
import {REACTION_CONSTANTS} from '../../stores/reactionStore';
import {appMutation, appQuery} from '../../utils/api';

import type {FluxFramework} from '@nlabs/arkhamjs';
import type {ReactionType} from '../../adapters/reactionAdapter/reactionAdapter';
import type {ReaktorDbCollection} from '../../utils/api';

const DATA_TYPE: ReaktorDbCollection = 'reactions';

export interface ReactionAdapterOptions {
  strict?: boolean;
  allowPartial?: boolean;
  environment?: 'development' | 'production' | 'test';
  customValidation?: (input: unknown) => unknown;
}

export interface ReactionActionsOptions {
  reactionAdapter?: (input: unknown, options?: ReactionAdapterOptions) => any;
  reactionAdapterOptions?: ReactionAdapterOptions;
}

export type ReactionApiResultsType = {
  reactions: {
    addReaction: ReactionType;
    deleteReaction: ReactionType;
    getReactionCount: number;
    hasReaction: boolean;
  };
};

export interface ReactionActions {
  addReaction: (itemId: string, itemType: string, reaction: Partial<ReactionType>, reactionProps?: string[]) => Promise<ReactionType>;
  deleteReaction: (itemId: string, itemType: string, reactionName: string, reactionProps?: string[]) => Promise<ReactionType>;
  getReactionCount: (itemId: string, itemType: string, reactionName: string) => Promise<number>;
  hasReaction: (itemId: string, itemType: string, reactionName: string, direction: string) => Promise<boolean>;
  abbreviateCount: (count: number) => string;
  updateReactionAdapter: (adapter: (input: unknown, options?: ReactionAdapterOptions) => any) => void;
  updateReactionAdapterOptions: (options: ReactionAdapterOptions) => void;
}

// Default validation function
const defaultReactionValidator = (input: unknown, options?: ReactionAdapterOptions) => validateReactionInput(input);

// Enhanced validation function that merges custom logic with defaults
const createReactionValidator = (
  customAdapter?: (input: unknown, options?: ReactionAdapterOptions) => any,
  options?: ReactionAdapterOptions
) => (input: unknown, validatorOptions?: ReactionAdapterOptions) => {
  const mergedOptions = {...options, ...validatorOptions};

  // Start with default validation
  let validated = defaultReactionValidator(input, mergedOptions);

  // Apply custom validation if provided
  if(customAdapter) {
    validated = customAdapter(validated, mergedOptions);
  }

  // Apply custom validation from options if provided
  if(mergedOptions?.customValidation) {
    validated = mergedOptions.customValidation(validated) as ReactionType;
  }

  return validated;
};

/**
 * Factory function to create ReactionActions with enhanced adapter injection capabilities.
 * Custom adapters are merged with default behavior, allowing partial overrides.
 *
 * @example
 * // Basic usage with default adapters
 * const reactionActions = createReactionActions(flux);
 *
 * @example
 * // Custom adapter that extends default behavior
 * const customReactionAdapter = (input: unknown, options?: ReactionAdapterOptions) => {
 *   // input is already validated by default adapter
 *   if (input.value && input.value > 5) {
 *     throw new Error('Reaction value too high');
 *   }
 *   return input;
 * };
 *
 * const reactionActions = createReactionActions(flux, {
 *   reactionAdapter: customReactionAdapter
 * });
 */
export const createReactionActions = (
  flux: FluxFramework,
  options?: ReactionActionsOptions
): ReactionActions => {
  // Initialize adapter state
  let reactionAdapterOptions: ReactionAdapterOptions = options?.reactionAdapterOptions || {};
  let customReactionAdapter = options?.reactionAdapter;

  // Create validators that merge custom adapters with defaults
  let validateReaction = createReactionValidator(customReactionAdapter, reactionAdapterOptions);

  // Update functions that recreate validators
  const updateReactionAdapter = (adapter: (input: unknown, options?: ReactionAdapterOptions) => any): void => {
    customReactionAdapter = adapter;
    validateReaction = createReactionValidator(customReactionAdapter, reactionAdapterOptions);
  };

  const updateReactionAdapterOptions = (options: ReactionAdapterOptions): void => {
    reactionAdapterOptions = {...reactionAdapterOptions, ...options};
    validateReaction = createReactionValidator(customReactionAdapter, reactionAdapterOptions);
  };

  // Action implementations
  const addReaction = async (
    itemId: string,
    itemType: string,
    reaction: Partial<ReactionType>,
    reactionProps: string[] = []
  ): Promise<ReactionType> => {
    const validatedReaction = validateReaction(reaction, reactionAdapterOptions);
    const {value} = validatedReaction;
    const formatValue = value !== undefined ? value.toString() : value;

    try {
      const queryVariables = {
        itemId: {
          type: 'ID!',
          value: `${itemType}/${itemId}`
        },
        reaction: {
          type: 'ReactionInput',
          value: {
            ...validatedReaction,
            value: formatValue
          }
        }
      };

      const onSuccess = (data: ReactionApiResultsType) => {
        const {reactions: {addReaction: reaction = {}}} = data;
        return Flux.dispatch({itemId, itemType, reaction, type: REACTION_CONSTANTS.ADD_ITEM_SUCCESS});
      };

      const {reaction: addedReaction} = await appMutation(flux, 'addReaction', DATA_TYPE, queryVariables, ['id', 'name', 'value', ...reactionProps], {
        onSuccess
      });

      return addedReaction as ReactionType;
    } catch(error) {
      flux.dispatch({error, type: REACTION_CONSTANTS.ADD_ITEM_ERROR});
      throw error;
    }
  };

  const deleteReaction = async (
    itemId: string,
    itemType: string,
    reactionName: string,
    reactionProps: string[] = []
  ): Promise<ReactionType> => {
    try {
      const queryVariables = {
        itemId: {
          type: 'ID!',
          value: `${itemType}/${itemId}`
        },
        reactionName: {
          type: 'String',
          value: reactionName
        }
      };

      const onSuccess = (data: ReactionApiResultsType) => {
        const {reactions: {deleteReaction: reaction = {}}} = data;
        return Flux.dispatch({
          itemId,
          itemType,
          reaction,
          type: REACTION_CONSTANTS.REMOVE_ITEM_SUCCESS
        });
      };

      const {reaction: deletedReaction} = await appMutation(flux, 'deleteReaction', DATA_TYPE, queryVariables, ['id', 'name', 'value', ...reactionProps], {
        onSuccess
      });

      return deletedReaction as ReactionType;
    } catch(error) {
      flux.dispatch({error, type: REACTION_CONSTANTS.REMOVE_ITEM_ERROR});
      throw error;
    }
  };

  const getReactionCount = async (itemId: string, itemType: string, reactionName: string): Promise<number> => {
    try {
      const queryVariables = {
        itemId: {
          type: 'ID!',
          value: `${itemType}/${itemId}`
        },
        reactionName: {
          type: 'String',
          value: reactionName
        }
      };

      const onSuccess = (data: ReactionApiResultsType) => {
        const {reactions: {getReactionCount}} = data;
        return flux.dispatch({
          count: getReactionCount,
          itemId,
          name: reactionName,
          type: REACTION_CONSTANTS.GET_COUNT_SUCCESS
        });
      };

      const {count: reactionCount} = await appQuery(
        flux,
        'reactionCount',
        DATA_TYPE,
        queryVariables,
        ['count'],
        {onSuccess}
      );
      return reactionCount as number;
    } catch(error) {
      flux.dispatch({error, type: REACTION_CONSTANTS.GET_COUNT_ERROR});
      throw error;
    }
  };

  const hasReaction = async (itemId: string, itemType: string, reactionName: string, direction: string): Promise<boolean> => {
    try {
      const queryVariables = {
        direction: {
          type: 'String',
          value: direction
        },
        itemId: {
          type: 'ID!',
          value: `${itemType}/${itemId}`
        },
        reactionName: {
          type: 'String',
          value: reactionName
        }
      };

      const onSuccess = (data: ReactionApiResultsType) => {
        const {reactions: {hasReaction}} = data;
        return Flux.dispatch({
          hasReaction,
          itemId: `${itemType}/${itemId}`,
          name: reactionName,
          type: REACTION_CONSTANTS.HAS_SUCCESS
        });
      };

      const {hasReaction: hasReactionResult} = await appQuery(
        flux,
        'hasReaction',
        DATA_TYPE,
        queryVariables,
        [],
        {onSuccess}
      );
      return hasReactionResult as boolean;
    } catch(error) {
      flux.dispatch({error, type: REACTION_CONSTANTS.HAS_ERROR});
      throw error;
    }
  };

  const abbreviateCount = (count: number): string => {
    const value: number = count || 0;
    let newValue: string = value.toString();

    if(value >= 1000) {
      const suffixes: string[] = ['', 'k', 'm', 'b', 't'];
      const suffixNum: number = Math.floor(`${value}`.length / 3);
      let shortValue: number = 0;
      let shortString: string = '';

      for(let precision = 2; precision >= 1; precision--) {
        shortValue = parseFloat((suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(precision));
        shortString = shortValue.toString();
        const dotLessShortValue: string = `${shortValue}`.replace(/[^a-zA-Z 0-9]+/g, '');

        if(dotLessShortValue.length <= 2) {
          break;
        }
      }

      if(shortValue % 1 !== 0) {
        shortString = shortValue.toFixed(1);
      }

      newValue = shortString + suffixes[suffixNum];
    }

    return newValue;
  };

  // Return the actions object
  return {
    addReaction,
    deleteReaction,
    getReactionCount,
    hasReaction,
    abbreviateCount,
    updateReactionAdapter,
    updateReactionAdapterOptions
  };
};

