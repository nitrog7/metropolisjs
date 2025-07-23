const {PROFILE_CONSTANTS, initialProfileState, profileStore} = require('./profileStore');

describe('profileStore', () => {
  it('should have expected PROFILE_CONSTANTS values', () => {
    expect(PROFILE_CONSTANTS).toEqual({
      PROFILE_ADD_SUCCESS: 'PROFILE_ADD_SUCCESS',
      PROFILE_DELETE_SUCCESS: 'PROFILE_DELETE_SUCCESS',
      PROFILE_GET_ITEM_SUCCESS: 'PROFILE_GET_ITEM_SUCCESS',
      PROFILE_GET_LIST_SUCCESS: 'PROFILE_GET_LIST_SUCCESS',
      PROFILE_UPDATE_SUCCESS: 'PROFILE_UPDATE_SUCCESS'
    });
  });

  it('should have expected initialProfileState', () => {
    expect(initialProfileState).toEqual({
      error: null,
      isInit: false,
      lists: {},
      profile: null
    });
  });

  describe('profileStore function', () => {
    it('should return initial state for unknown action type', () => {
      const action = {type: 'UNKNOWN_ACTION'};
      const result = profileStore(action.type, action);
      expect(result).toEqual(initialProfileState);
    });

    it('should handle PROFILE_ADD_SUCCESS action', () => {
      const action = {
        type: 'PROFILE_ADD_SUCCESS',
        profile: {id: '1', name: 'test-name', bio: 'test-bio'}
      };
      const result = profileStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {},
        profile: {id: '1', name: 'test-name', bio: 'test-bio'}
      });
    });

    it('should handle PROFILE_UPDATE_SUCCESS action', () => {
      const action = {
        type: 'PROFILE_UPDATE_SUCCESS',
        profile: {id: '1', name: 'updated-name', bio: 'updated-bio'}
      };
      const result = profileStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {},
        profile: {id: '1', name: 'updated-name', bio: 'updated-bio'}
      });
    });

    it('should handle PROFILE_DELETE_SUCCESS action', () => {
      const action = {type: 'PROFILE_DELETE_SUCCESS'};
      const result = profileStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {},
        profile: null
      });
    });

    it('should handle PROFILE_GET_ITEM_SUCCESS action', () => {
      const action = {
        type: 'PROFILE_GET_ITEM_SUCCESS',
        profile: {id: '1', name: 'test-name', bio: 'test-bio'}
      };
      const result = profileStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {},
        profile: {id: '1', name: 'test-name', bio: 'test-bio'}
      });
    });

    it('should handle PROFILE_GET_ITEM_SUCCESS with null profile', () => {
      const action = {type: 'PROFILE_GET_ITEM_SUCCESS', profile: null};
      const result = profileStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {},
        profile: null
      });
    });

    it('should handle PROFILE_GET_LIST_SUCCESS action', () => {
      const action = {
        type: 'PROFILE_GET_LIST_SUCCESS',
        profiles: [{id: '1', name: 'profile1'}, {id: '2', name: 'profile2'}]
      };
      const result = profileStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {profiles: [{id: '1', name: 'profile1'}, {id: '2', name: 'profile2'}]},
        profile: null
      });
    });

    it('should handle PROFILE_ADD_SUCCESS with full profile data', () => {
      const action = {
        type: 'PROFILE_ADD_SUCCESS',
        profile: {
          id: '1',
          name: 'full-name',
          bio: 'full-bio',
          email: 'test@example.com',
          phone: '123-456-7890'
        }
      };
      const result = profileStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {},
        profile: {
          id: '1',
          name: 'full-name',
          bio: 'full-bio',
          email: 'test@example.com',
          phone: '123-456-7890'
        }
      });
    });

    it('should handle PROFILE_UPDATE_SUCCESS with minimal profile data', () => {
      const action = {
        type: 'PROFILE_UPDATE_SUCCESS',
        profile: {id: '1', name: 'minimal-name'}
      };
      const result = profileStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {},
        profile: {id: '1', name: 'minimal-name'}
      });
    });

    it('should handle PROFILE_GET_LIST_SUCCESS with empty profiles array', () => {
      const action = {
        type: 'PROFILE_GET_LIST_SUCCESS',
        profiles: []
      };
      const result = profileStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {profiles: []},
        profile: null
      });
    });

    it('should handle PROFILE_GET_LIST_SUCCESS with single profile', () => {
      const action = {
        type: 'PROFILE_GET_LIST_SUCCESS',
        profiles: [{id: '1', name: 'single-profile'}]
      };
      const result = profileStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {profiles: [{id: '1', name: 'single-profile'}]},
        profile: null
      });
    });

    it('should handle PROFILE_ADD_SUCCESS with undefined profile', () => {
      const action = {type: 'PROFILE_ADD_SUCCESS', profile: undefined};
      const result = profileStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {},
        profile: undefined
      });
    });

    it('should handle PROFILE_UPDATE_SUCCESS with undefined profile', () => {
      const action = {type: 'PROFILE_UPDATE_SUCCESS', profile: undefined};
      const result = profileStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {},
        profile: undefined
      });
    });

    it('should handle PROFILE_GET_ITEM_SUCCESS with undefined profile', () => {
      const action = {type: 'PROFILE_GET_ITEM_SUCCESS', profile: undefined};
      const result = profileStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {},
        profile: undefined
      });
    });

    it('should handle PROFILE_GET_LIST_SUCCESS with undefined profiles', () => {
      const action = {type: 'PROFILE_GET_LIST_SUCCESS', profiles: undefined};
      const result = profileStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {profiles: undefined},
        profile: null
      });
    });

    it('should handle action with missing type', () => {
      const action = {};
      const result = profileStore(action.type, action);
      expect(result).toEqual(initialProfileState);
    });

    it('should handle action with null type', () => {
      const action = {type: null};
      const result = profileStore(action.type, action);
      expect(result).toEqual(initialProfileState);
    });

    it('should handle action with empty type', () => {
      const action = {type: ''};
      const result = profileStore(action.type, action);
      expect(result).toEqual(initialProfileState);
    });
  });
});