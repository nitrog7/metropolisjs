/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {Flux, FluxFramework} from '@nlabs/arkhamjs';

import {Reaction} from '../adapters/Reaction';
import {
  REACTION_ADD_ERROR,
  REACTION_ADD_SUCCESS,
  REACTION_COUNT_ERROR,
  REACTION_COUNT_SUCCESS,
  REACTION_DELETE_ERROR,
  REACTION_DELETE_SUCCESS,
  REACTION_HAS_ERROR,
  REACTION_HAS_SUCCESS
} from '../stores/reactionStore';
import {ApiResultsType, appMutation, appQuery} from '../utils/api';

export class Reactions {
  CustomAdapter: any;
  flux: FluxFramework;

  constructor(flux: FluxFramework, CustomAdapter: any = Reaction) {
    this.CustomAdapter = CustomAdapter;
    this.flux = flux;
  }

  async addReaction(
    itemId: string,
    itemType: string,
    reaction: any,
    reactionProps: string[] = [],
    CustomClass = Reaction
  ) {
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

      const onSuccess = (data: ApiResultsType = {}) => {
        const {addReaction = {}} = data;
        return Flux.dispatch({itemId, itemType, reaction: new CustomClass(addReaction), type: REACTION_ADD_SUCCESS});
      };
      return await appMutation(this.flux, 'addReaction', queryVariables, ['id', 'name', 'value', ...reactionProps], {
        onSuccess
      });
    } catch(error) {
      return Flux.dispatch({error, type: REACTION_ADD_ERROR});
    }
  }

  async deleteReaction(
    itemId: string,
    itemType: string,
    reactionName: string,
    reactionProps: string[] = [],
    CustomClass = Reaction
  ) {
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

      const onSuccess = (data: ApiResultsType = {}) => {
        const {deleteReaction = {}} = data;
        return Flux.dispatch({
          itemId,
          itemType,
          reaction: new CustomClass(deleteReaction),
          type: REACTION_DELETE_SUCCESS
        });
      };
      return await appMutation(this.flux, 'deleteReaction', queryVariables, ['id', 'name', 'value', ...reactionProps], {
        onSuccess
      });
    } catch(error) {
      return Flux.dispatch({error, type: REACTION_DELETE_ERROR});
    }
  }

  async getReactionCount(itemId: string, itemType: string, reactionName: string) {
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

      const onSuccess = (data: ApiResultsType = {}) => {
        const {reactionCount: {count = 0} = {}} = data;
        return Flux.dispatch({
          count,
          itemId,
          name: reactionName,
          type: REACTION_COUNT_SUCCESS
        });
      };
      return await appQuery(this.flux, 'reactionCount', queryVariables, ['count'], {onSuccess});
    } catch(error) {
      return Flux.dispatch({error, type: REACTION_COUNT_ERROR});
    }
  }

  async hasReaction(itemId: string, itemType: string, reactionName: string, direction: string) {
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

      const onSuccess = (data: ApiResultsType = {}) => {
        const {hasReaction = false} = data;
        return Flux.dispatch({
          hasReaction,
          itemId: `${itemType}/${itemId}`,
          name: reactionName,
          type: REACTION_HAS_SUCCESS
        });
      };
      return await appQuery(this.flux, 'hasReaction', queryVariables, null, {onSuccess});
    } catch(error) {
      return Flux.dispatch({error, type: REACTION_HAS_ERROR});
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
