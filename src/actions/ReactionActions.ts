/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {Flux} from '@nlabs/arkhamjs';

import {Reaction} from '../adapters/legacyCompatibility';
import {ReactionConstants} from '../stores/reactionStore';
import {appMutation, appQuery} from '../utils/api';

import type {ReaktorDbCollection} from '../utils/api';
import type {FluxFramework} from '@nlabs/arkhamjs';

const DATA_TYPE: ReaktorDbCollection = 'reactions';

export type ReactionApiResultsType = {
  reactions: {
    addReaction: Reaction;
    deleteReaction: Reaction;
    getReactionCount: number;
    hasReaction: boolean;
  };
};

export class ReactionActions {
  CustomAdapter: typeof Reaction;
  flux: FluxFramework;

  constructor(flux: FluxFramework, CustomAdapter: typeof Reaction = Reaction) {
    this.CustomAdapter = CustomAdapter;
    this.flux = flux;
  }

  async addReaction(
    itemId: string,
    itemType: string,
    reaction: Partial<Reaction>,
    reactionProps: string[] = [],
    CustomClass: typeof Reaction = Reaction
  ): Promise<Reaction> {
    const {value} = reaction;
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
            ...reaction,
            value: formatValue
          }
        }
      };

      const onSuccess = (data: ReactionApiResultsType) => {
        const {reactions: {addReaction: reaction = {}}} = data;
        return Flux.dispatch({itemId, itemType, reaction: new CustomClass(reaction), type: ReactionConstants.ADD_ITEM_SUCCESS});
      };
      const {reaction: addedReaction} = await appMutation(this.flux, 'addReaction', DATA_TYPE, queryVariables, ['id', 'name', 'value', ...reactionProps], {
        onSuccess
      });

      return addedReaction as Reaction;
    } catch(error) {
      this.flux.dispatch({error, type: ReactionConstants.ADD_ITEM_ERROR});
      throw error;
    }
  }

  async deleteReaction(
    itemId: string,
    itemType: string,
    reactionName: string,
    reactionProps: string[] = [],
    CustomClass = Reaction
  ): Promise<Reaction> {
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
          reaction: new CustomClass(reaction),
          type: ReactionConstants.REMOVE_ITEM_SUCCESS
        });
      };
      const {reaction: deletedReaction} = await appMutation(this.flux, 'deleteReaction', DATA_TYPE, queryVariables, ['id', 'name', 'value', ...reactionProps], {
        onSuccess
      });

      return deletedReaction as Reaction;
    } catch(error) {
      this.flux.dispatch({error, type: ReactionConstants.REMOVE_ITEM_ERROR});
      throw error;
    }
  }

  async getReactionCount(itemId: string, itemType: string, reactionName: string): Promise<number> {
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
        return this.flux.dispatch({
          count: getReactionCount,
          itemId,
          name: reactionName,
          type: ReactionConstants.GET_COUNT_SUCCESS
        });
      };
      const {count: reactionCount} = await appQuery(
        this.flux,
        'reactionCount',
        DATA_TYPE,
        queryVariables,
        ['count'],
        {onSuccess}
      );
      return reactionCount as number;
    } catch(error) {
      this.flux.dispatch({error, type: ReactionConstants.GET_COUNT_ERROR});
      throw error;
    }
  }

  async hasReaction(itemId: string, itemType: string, reactionName: string, direction: string): Promise<boolean> {
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
          type: ReactionConstants.HAS_SUCCESS
        });
      };
      const {hasReaction: hasReactionResult} = await appQuery(
        this.flux,
        'hasReaction',
        DATA_TYPE,
        queryVariables,
        null,
        {onSuccess}
      );
      return hasReactionResult as boolean;
    } catch(error) {
      this.flux.dispatch({error, type: ReactionConstants.HAS_ERROR});
      throw error;
    }
  }

  abbreviateCount(count: number): string {
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
  }
}
