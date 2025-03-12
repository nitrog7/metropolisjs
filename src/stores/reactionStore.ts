export class ReactionConstants {
  static readonly ADD_ITEM_SUCCESS: string = 'REACTION_ADD_ITEM_SUCCESS';
  static readonly ADD_ITEM_ERROR: string = 'REACTION_ADD_ITEM_ERROR';
  static readonly REMOVE_ITEM_SUCCESS: string = 'REACTION_REMOVE_ITEM_SUCCESS';
  static readonly REMOVE_ITEM_ERROR: string = 'REACTION_REMOVE_ITEM_ERROR';
  static readonly GET_COUNT_SUCCESS: string = 'REACTION_GET_COUNT_SUCCESS';
  static readonly GET_COUNT_ERROR: string = 'REACTION_GET_COUNT_ERROR';
  static readonly HAS_SUCCESS: string = 'REACTION_HAS_SUCCESS';
  static readonly HAS_ERROR: string = 'REACTION_HAS_ERROR';
}

interface ReactionState {
  reactions?: Record<string, {
    count?: number;
    hasReaction?: boolean;
  }>;
}

export const defaultValues: ReactionState = {
  reactions: {}
};

export const reactionStore = (type: string, data: Partial<ReactionState>, state = defaultValues): ReactionState => {
  switch(type) {
    default: {
      return state;
    }
  }
};
