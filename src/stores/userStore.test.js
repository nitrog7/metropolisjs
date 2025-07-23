const {USER_CONSTANTS, defaultValues, userStore} = require('./userStore');

describe('userStore', () => {
  it('should have expected USER_CONSTANTS values', () => {
    expect(USER_CONSTANTS).toEqual({
      USER_ADD_SUCCESS: 'USER_ADD_SUCCESS',
      USER_AUTHENTICATION_UPDATE: 'USER_AUTHENTICATION_UPDATE',
      USER_CONFIRM_CODE_SUCCESS: 'USER_CONFIRM_CODE_SUCCESS',
      USER_CONFIRM_SIGN_UP_SUCCESS: 'USER_CONFIRM_SIGN_UP_SUCCESS',
      USER_DELETE_SUCCESS: 'USER_DELETE_SUCCESS',
      USER_FORGOT_PASSWORD_SUCCESS: 'USER_FORGOT_PASSWORD_SUCCESS',
      USER_GET_DETAILS_SUCCESS: 'USER_GET_DETAILS_SUCCESS',
      USER_GET_ITEM_SUCCESS: 'USER_GET_ITEM_SUCCESS',
      USER_GET_LIST_SUCCESS: 'USER_GET_LIST_SUCCESS',
      USER_HAS_USER_REACTIONS: 'USER_HAS_USER_REACTIONS',
      USER_IS_LOGGED_IN: 'USER_IS_LOGGED_IN',
      USER_LIST_BY_CONNECTION_SUCCESS: 'USER_LIST_BY_CONNECTION_SUCCESS',
      USER_LIST_BY_LATEST_SUCCESS: 'USER_LIST_BY_LATEST_SUCCESS',
      USER_LIST_BY_REACTIONS_SUCCESS: 'USER_LIST_BY_REACTIONS_SUCCESS',
      USER_LIST_BY_TAGS_SUCCESS: 'USER_LIST_BY_TAGS_SUCCESS',
      USER_REFRESH_SESSION_SUCCESS: 'USER_REFRESH_SESSION_SUCCESS',
      USER_RESET_PASSWORD_SUCCESS: 'USER_RESET_PASSWORD_SUCCESS',
      USER_SESSION_SUCCESS: 'USER_SESSION_SUCCESS',
      USER_SIGN_IN_SUCCESS: 'USER_SIGN_IN_SUCCESS',
      USER_SIGN_OUT_SUCCESS: 'USER_SIGN_OUT_SUCCESS',
      USER_SIGN_UP_SUCCESS: 'USER_SIGN_UP_SUCCESS',
      USER_UPDATE_PROFILE_SUCCESS: 'USER_UPDATE_PROFILE_SUCCESS',
      USER_UPDATE_SUCCESS: 'USER_UPDATE_SUCCESS'
    });
  });

  it('should have expected defaultValues', () => {
    expect(defaultValues).toEqual({
      authentication: {isAuthenticated: false, userId: null},
      error: null,
      isInit: false,
      lists: {},
      user: null
    });
  });

  describe('userStore function', () => {
    it('should return default state for unknown action type', () => {
      const action = {type: 'UNKNOWN_ACTION'};
      const result = userStore(action.type, action);
      expect(result).toEqual(defaultValues);
    });

    it('should handle USER_ADD_SUCCESS action', () => {
      const action = {
        type: 'USER_ADD_SUCCESS',
        user: {id: '1', username: 'testuser', email: 'test@example.com'}
      };
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: false, userId: null},
        error: null,
        isInit: true,
        lists: {},
        user: {id: '1', username: 'testuser', email: 'test@example.com'}
      });
    });

    it('should handle USER_UPDATE_SUCCESS action', () => {
      const action = {
        type: 'USER_UPDATE_SUCCESS',
        user: {id: '1', username: 'updateduser', email: 'updated@example.com'}
      };
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: false, userId: null},
        error: null,
        isInit: true,
        lists: {},
        user: {id: '1', username: 'updateduser', email: 'updated@example.com'}
      });
    });

    it('should handle USER_DELETE_SUCCESS action', () => {
      const action = {type: 'USER_DELETE_SUCCESS'};
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: false, userId: null},
        error: null,
        isInit: true,
        lists: {},
        user: null
      });
    });

    it('should handle USER_GET_ITEM_SUCCESS action', () => {
      const action = {
        type: 'USER_GET_ITEM_SUCCESS',
        user: {id: '1', username: 'testuser'}
      };
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: false, userId: null},
        error: null,
        isInit: true,
        lists: {},
        user: {id: '1', username: 'testuser'}
      });
    });

    it('should handle USER_GET_ITEM_SUCCESS with null user', () => {
      const action = {type: 'USER_GET_ITEM_SUCCESS', user: null};
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: false, userId: null},
        error: null,
        isInit: true,
        lists: {},
        user: null
      });
    });

    it('should handle USER_GET_LIST_SUCCESS action', () => {
      const action = {
        type: 'USER_GET_LIST_SUCCESS',
        users: [{id: '1', username: 'user1'}, {id: '2', username: 'user2'}]
      };
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: false, userId: null},
        error: null,
        isInit: true,
        lists: {users: [{id: '1', username: 'user1'}, {id: '2', username: 'user2'}]},
        user: null
      });
    });

    it('should handle USER_SIGN_IN_SUCCESS action', () => {
      const action = {
        type: 'USER_SIGN_IN_SUCCESS',
        user: {id: '1', username: 'testuser'}
      };
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: true, userId: '1'},
        error: null,
        isInit: true,
        lists: {},
        user: {id: '1', username: 'testuser'}
      });
    });

    it('should handle USER_SIGN_OUT_SUCCESS action', () => {
      const action = {type: 'USER_SIGN_OUT_SUCCESS'};
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: false, userId: null},
        error: null,
        isInit: true,
        lists: {},
        user: null
      });
    });

    it('should handle USER_SIGN_UP_SUCCESS action', () => {
      const action = {
        type: 'USER_SIGN_UP_SUCCESS',
        user: {id: '1', username: 'newuser'}
      };
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: false, userId: null},
        error: null,
        isInit: true,
        lists: {},
        user: {id: '1', username: 'newuser'}
      });
    });

    it('should handle USER_SESSION_SUCCESS action', () => {
      const action = {
        type: 'USER_SESSION_SUCCESS',
        user: {id: '1', username: 'testuser'}
      };
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: true, userId: '1'},
        error: null,
        isInit: true,
        lists: {},
        user: {id: '1', username: 'testuser'}
      });
    });

    it('should handle USER_UPDATE_PROFILE_SUCCESS action', () => {
      const action = {
        type: 'USER_UPDATE_PROFILE_SUCCESS',
        profile: {bio: 'test-bio', name: 'test-name'}
      };
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: false, userId: null},
        error: null,
        isInit: true,
        lists: {},
        user: {profile: {bio: 'test-bio', name: 'test-name'}}
      });
    });

    it('should handle USER_CONFIRM_CODE_SUCCESS action', () => {
      const action = {type: 'USER_CONFIRM_CODE_SUCCESS'};
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: false, userId: null},
        error: null,
        isInit: true,
        lists: {},
        user: null
      });
    });

    it('should handle USER_CONFIRM_SIGN_UP_SUCCESS action', () => {
      const action = {type: 'USER_CONFIRM_SIGN_UP_SUCCESS'};
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: false, userId: null},
        error: null,
        isInit: true,
        lists: {},
        user: null
      });
    });

    it('should handle USER_FORGOT_PASSWORD_SUCCESS action', () => {
      const action = {type: 'USER_FORGOT_PASSWORD_SUCCESS'};
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: false, userId: null},
        error: null,
        isInit: true,
        lists: {},
        user: null
      });
    });

    it('should handle USER_RESET_PASSWORD_SUCCESS action', () => {
      const action = {type: 'USER_RESET_PASSWORD_SUCCESS'};
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: false, userId: null},
        error: null,
        isInit: true,
        lists: {},
        user: null
      });
    });

    it('should handle USER_REFRESH_SESSION_SUCCESS action', () => {
      const action = {
        type: 'USER_REFRESH_SESSION_SUCCESS',
        user: {id: '1', username: 'testuser'}
      };
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: true, userId: '1'},
        error: null,
        isInit: true,
        lists: {},
        user: {id: '1', username: 'testuser'}
      });
    });

    it('should handle USER_IS_LOGGED_IN action', () => {
      const action = {type: 'USER_IS_LOGGED_IN', isLoggedIn: true};
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: true, userId: null},
        error: null,
        isInit: true,
        lists: {},
        user: null
      });
    });

    it('should handle USER_LIST_BY_CONNECTION_SUCCESS action', () => {
      const action = {
        type: 'USER_LIST_BY_CONNECTION_SUCCESS',
        connections: [{id: '1', userId: 'user1'}, {id: '2', userId: 'user2'}]
      };
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: false, userId: null},
        error: null,
        isInit: true,
        lists: {connections: [{id: '1', userId: 'user1'}, {id: '2', userId: 'user2'}]},
        user: null
      });
    });

    it('should handle USER_LIST_BY_LATEST_SUCCESS action', () => {
      const action = {
        type: 'USER_LIST_BY_LATEST_SUCCESS',
        latest: [{id: '1', username: 'user1'}, {id: '2', username: 'user2'}]
      };
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: false, userId: null},
        error: null,
        isInit: true,
        lists: {latest: [{id: '1', username: 'user1'}, {id: '2', username: 'user2'}]},
        user: null
      });
    });

    it('should handle USER_LIST_BY_REACTIONS_SUCCESS action', () => {
      const action = {
        type: 'USER_LIST_BY_REACTIONS_SUCCESS',
        reactions: [{id: '1', reactions: ['like']}, {id: '2', reactions: ['love']}]
      };
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: false, userId: null},
        error: null,
        isInit: true,
        lists: {reactions: [{id: '1', reactions: ['like']}, {id: '2', reactions: ['love']}]},
        user: null
      });
    });

    it('should handle USER_LIST_BY_TAGS_SUCCESS action', () => {
      const action = {
        type: 'USER_LIST_BY_TAGS_SUCCESS',
        tags: [{id: '1', tags: ['tag1']}, {id: '2', tags: ['tag2']}]
      };
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: false, userId: null},
        error: null,
        isInit: true,
        lists: {tags: [{id: '1', tags: ['tag1']}, {id: '2', tags: ['tag2']}]},
        user: null
      });
    });

    it('should handle USER_GET_DETAILS_SUCCESS action', () => {
      const action = {
        type: 'USER_GET_DETAILS_SUCCESS',
        details: {userId: '1', profile: {bio: 'test-bio'}}
      };
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: false, userId: null},
        error: null,
        isInit: true,
        lists: {details: {userId: '1', profile: {bio: 'test-bio'}}},
        user: null
      });
    });

    it('should handle USER_HAS_USER_REACTIONS action', () => {
      const action = {
        type: 'USER_HAS_USER_REACTIONS',
        hasReactions: true
      };
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: false, userId: null},
        error: null,
        isInit: true,
        lists: {hasReactions: true},
        user: null
      });
    });

    it('should handle USER_AUTHENTICATION_UPDATE action', () => {
      const action = {
        type: 'USER_AUTHENTICATION_UPDATE',
        authentication: {isAuthenticated: true, userId: '1'}
      };
      const result = userStore(action.type, action);
      expect(result).toEqual({
        authentication: {isAuthenticated: true, userId: '1'},
        error: null,
        isInit: true,
        lists: {},
        user: null
      });
    });
  });
});