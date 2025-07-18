/**
 * Copyright (c) 2023-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import { initialProfileState, PROFILE_CONSTANTS, profileStore } from './profileStore';

describe('profileStore', () => {
  it('should return initial state', () => {
    const state = profileStore.reducer(undefined, {type: 'UNKNOWN_ACTION'});
    expect(state).toEqual(initialProfileState);
  });

  it('should handle ADD_ITEM_SUCCESS', () => {
    const profile = {profileId: '123', name: 'Test Profile'};
    const state = profileStore.reducer(initialProfileState, {
      profile,
      type: PROFILE_CONSTANTS.ADD_ITEM_SUCCESS
    });

    expect(state.list).toHaveLength(1);
    expect(state.list[0]).toEqual(profile);
    expect(state.listMap['123']).toEqual(profile);
  });

  it('should handle UPDATE_ITEM_SUCCESS', () => {
    const initialProfile = {profileId: '123', name: 'Test Profile'};
    const initialState = {
      ...initialProfileState,
      list: [initialProfile],
      listMap: {'123': initialProfile}
    };

    const updatedProfile = {profileId: '123', name: 'Updated Profile'};
    const state = profileStore.reducer(initialState, {
      profile: updatedProfile,
      type: PROFILE_CONSTANTS.UPDATE_ITEM_SUCCESS
    });

    expect(state.list).toHaveLength(1);
    expect(state.list[0]).toEqual(updatedProfile);
    expect(state.listMap['123']).toEqual(updatedProfile);
  });

  it('should handle GET_ITEM_SUCCESS', () => {
    const profile = {profileId: '123', name: 'Test Profile'};
    const state = profileStore.reducer(initialProfileState, {
      profile,
      type: PROFILE_CONSTANTS.GET_ITEM_SUCCESS
    });

    expect(state.list).toHaveLength(1);
    expect(state.list[0]).toEqual(profile);
    expect(state.listMap['123']).toEqual(profile);
  });

  it('should handle DELETE_ITEM_SUCCESS', () => {
    const initialProfile = {profileId: '123', name: 'Test Profile'};
    const initialState = {
      ...initialProfileState,
      list: [initialProfile],
      listMap: {'123': initialProfile}
    };

    const state = profileStore.reducer(initialState, {
      profile: initialProfile,
      type: PROFILE_CONSTANTS.DELETE_ITEM_SUCCESS
    });

    expect(state.list).toHaveLength(0);
    expect(state.listMap['123']).toBeUndefined();
  });

  it('should handle GET_LIST_SUCCESS', () => {
    const profiles = [
      {profileId: '123', name: 'Test Profile 1'},
      {profileId: '456', name: 'Test Profile 2'}
    ];

    const state = profileStore.reducer(initialProfileState, {
      profiles,
      type: PROFILE_CONSTANTS.GET_LIST_SUCCESS
    });

    expect(state.list).toHaveLength(2);
    expect(state.list).toEqual(profiles);
    expect(state.listMap['123']).toEqual(profiles[0]);
    expect(state.listMap['456']).toEqual(profiles[1]);
  });

  it('should handle error actions', () => {
    const error = new Error('Test error');
    const state = profileStore.reducer(initialProfileState, {
      error,
      type: PROFILE_CONSTANTS.ADD_ITEM_ERROR
    });

    expect(state.error).toEqual(error);
  });
});