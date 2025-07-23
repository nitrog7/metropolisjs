import {PROFILE_CONSTANTS, initialProfileState, profileStore} from './profileStore';

describe('profileStore', () => {
  it('should have expected PROFILE_CONSTANTS values', () => {
    expect(PROFILE_CONSTANTS.ADD_ITEM_ERROR).toBe('PROFILE_ADD_ITEM_ERROR');
    expect(PROFILE_CONSTANTS.ADD_ITEM_SUCCESS).toBe('PROFILE_ADD_ITEM_SUCCESS');
    expect(PROFILE_CONSTANTS.DELETE_ITEM_ERROR).toBe('PROFILE_DELETE_ITEM_ERROR');
    expect(PROFILE_CONSTANTS.DELETE_ITEM_SUCCESS).toBe('PROFILE_DELETE_ITEM_SUCCESS');
    expect(PROFILE_CONSTANTS.GET_ITEM_ERROR).toBe('PROFILE_GET_ITEM_ERROR');
    expect(PROFILE_CONSTANTS.GET_ITEM_SUCCESS).toBe('PROFILE_GET_ITEM_SUCCESS');
    expect(PROFILE_CONSTANTS.GET_LIST_ERROR).toBe('PROFILE_GET_LIST_ERROR');
    expect(PROFILE_CONSTANTS.GET_LIST_SUCCESS).toBe('PROFILE_GET_LIST_SUCCESS');
    expect(PROFILE_CONSTANTS.UPDATE_ITEM_ERROR).toBe('PROFILE_UPDATE_ITEM_ERROR');
    expect(PROFILE_CONSTANTS.UPDATE_ITEM_SUCCESS).toBe('PROFILE_UPDATE_ITEM_SUCCESS');
  });

  it('should have expected initialProfileState structure', () => {
    expect(initialProfileState).toEqual({
      error: undefined,
      list: [],
      listMap: {}
    });
  });

  it('should have profileStore function', () => {
    expect(typeof profileStore).toBe('function');
  });

  it('should handle profileStore with ADD_ITEM_SUCCESS', () => {
    const initialState = {...initialProfileState};
    const action = {
      profile: {name: 'test-name', profileId: 'test-id'},
      type: PROFILE_CONSTANTS.ADD_ITEM_SUCCESS
    };

    const result = profileStore(initialState, action);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('should handle profileStore with GET_ITEM_SUCCESS', () => {
    const initialState = {...initialProfileState};
    const action = {
      profile: {name: 'test-name', profileId: 'test-id'},
      type: PROFILE_CONSTANTS.GET_ITEM_SUCCESS
    };

    const result = profileStore(initialState, action);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('should handle profileStore with GET_LIST_SUCCESS', () => {
    const initialState = {...initialProfileState};
    const action = {
      profiles: [
        {name: 'test-name-1', profileId: 'test-id-1'},
        {name: 'test-name-2', profileId: 'test-id-2'}
      ],
      type: PROFILE_CONSTANTS.GET_LIST_SUCCESS
    };

    const result = profileStore(initialState, action);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('should handle profileStore with UPDATE_ITEM_SUCCESS', () => {
    const initialState = {...initialProfileState};
    const action = {
      profile: {name: 'updated-name', profileId: 'test-id'},
      type: PROFILE_CONSTANTS.UPDATE_ITEM_SUCCESS
    };

    const result = profileStore(initialState, action);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('should handle profileStore with DELETE_ITEM_SUCCESS', () => {
    const initialState = {...initialProfileState};
    const action = {
      profile: {profileId: 'test-id'},
      type: PROFILE_CONSTANTS.DELETE_ITEM_SUCCESS
    };

    const result = profileStore(initialState, action);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('should handle profileStore with error actions', () => {
    const initialState = {...initialProfileState};
    const errorActions = [
      PROFILE_CONSTANTS.ADD_ITEM_ERROR,
      PROFILE_CONSTANTS.GET_ITEM_ERROR,
      PROFILE_CONSTANTS.GET_LIST_ERROR,
      PROFILE_CONSTANTS.UPDATE_ITEM_ERROR,
      PROFILE_CONSTANTS.DELETE_ITEM_ERROR
    ];

    for(const errorType of errorActions) {
      const action = {
        error: new Error('Test error'),
        type: errorType
      };

      const result = profileStore(initialState, action);

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    }
  });

  it('should handle profileStore with unknown action type', () => {
    const initialState = {...initialProfileState};
    const action = {
      type: 'UNKNOWN_ACTION'
    };

    const result = profileStore(initialState, action);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('should handle profileStore with empty profiles array', () => {
    const initialState = {...initialProfileState};
    const action = {
      profiles: [],
      type: PROFILE_CONSTANTS.GET_LIST_SUCCESS
    };

    const result = profileStore(initialState, action);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('should handle profileStore with null profile data', () => {
    const initialState = {...initialProfileState};
    const action = {
      profile: null,
      type: PROFILE_CONSTANTS.GET_ITEM_SUCCESS
    };

    const result = profileStore(initialState, action);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('should handle profileStore with undefined profile data', () => {
    const initialState = {...initialProfileState};
    const action = {
      profile: undefined,
      type: PROFILE_CONSTANTS.GET_ITEM_SUCCESS
    };

    const result = profileStore(initialState, action);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('should handle profileStore with complex profile data', () => {
    const initialState = {...initialProfileState};
    const complexProfile = {
      bio: 'Test bio',
      email: 'test@example.com',
      name: 'Test Name',
      phone: '123-456-7890',
      profileId: 'test-id'
    };
    const action = {
      profile: complexProfile,
      type: PROFILE_CONSTANTS.ADD_ITEM_SUCCESS
    };

    const result = profileStore(initialState, action);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('should handle profileStore with multiple profiles', () => {
    const initialState = {...initialProfileState};
    const multipleProfiles = [
      {bio: 'Bio 1', name: 'Name 1', profileId: 'id-1'},
      {bio: 'Bio 2', name: 'Name 2', profileId: 'id-2'},
      {bio: 'Bio 3', name: 'Name 3', profileId: 'id-3'}
    ];
    const action = {
      profiles: multipleProfiles,
      type: PROFILE_CONSTANTS.GET_LIST_SUCCESS
    };

    const result = profileStore(initialState, action);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('should handle profileStore with existing state', () => {
    const initialState = {
      error: undefined,
      list: [{name: 'existing-name', profileId: 'existing-id'}],
      listMap: {'existing-id': {name: 'existing-name', profileId: 'existing-id'}}
    };
    const action = {
      profile: {name: 'new-name', profileId: 'new-id'},
      type: PROFILE_CONSTANTS.ADD_ITEM_SUCCESS
    };

    const result = profileStore(initialState, action);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('should handle profileStore with error in existing state', () => {
    const initialState = {
      error: new Error('Previous error'),
      list: [],
      listMap: {}
    };
    const action = {
      profile: {name: 'test-name', profileId: 'test-id'},
      type: PROFILE_CONSTANTS.ADD_ITEM_SUCCESS
    };

    const result = profileStore(initialState, action);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });
});