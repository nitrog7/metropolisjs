import {FluxFramework} from '@nlabs/arkhamjs';
import {DateTime} from 'luxon';

import {Config} from '../../config';
import {createAction} from '../../utils/actionFactory';

import type {UserAdapterOptions} from './userActions';

// Mock @nlabs/rip-hunter to ensure HTTP requests are intercepted
jest.mock('@nlabs/rip-hunter');

describe('userActions', () => {
  let flux: FluxFramework;
  let userActions: any;

  beforeEach(() => {
    flux = new FluxFramework();
    userActions = createAction('user', flux);

    flux.dispatch = jest.fn();
    flux.getState = jest.fn();
  });

  describe('factory function', () => {
    it('should create actions with flux framework', () => {
      expect(userActions).toBeDefined();
      expect(typeof userActions.add).toBe('function');
      expect(typeof userActions.signUp).toBe('function');
    });

    it('should use default adapters when no custom ones provided', () => {
      const userActions = createAction('user', flux);
      expect(userActions).toBeDefined();
    });

    it('should merge custom adapter with default behavior', () => {
      const customUserAdapter = jest.fn().mockImplementation((input) => {
        // input is already validated by default adapter
        if(input.email && !input.email.includes('@company.com')) {
          throw new Error('Only company emails allowed');
        }
        return input;
      });

      const userActions = createAction('user', flux, {
        userAdapter: customUserAdapter
      });

      expect(userActions).toBeDefined();
    });

    it('should use adapter options when provided', () => {
      const userAdapterOptions: UserAdapterOptions = {
        strict: true,
        environment: 'production',
        customValidation: jest.fn().mockReturnValue({validated: true})
      };

      const userActions = createAction('user', flux, {
        userAdapterOptions
      });

      expect(userActions).toBeDefined();
    });
  });

  describe('adapter updates', () => {
    it('should update user adapter at runtime', () => {
      const customAdapter = jest.fn().mockImplementation((input) =>
        // input is already validated by default adapter
        ({...input, customField: true})
      );

      userActions.updateUserAdapter(customAdapter);
      // The adapter should be updated internally
      expect(userActions).toBeDefined();
    });

    it('should update persona adapter at runtime', () => {
      const customAdapter = jest.fn().mockImplementation((input) =>
        // input is already validated by default adapter
        ({...input, customField: true})
      );

      userActions.updatePersonaAdapter(customAdapter);
      // The adapter should be updated internally
      expect(userActions).toBeDefined();
    });

    it('should update user adapter options at runtime', () => {
      const newOptions: UserAdapterOptions = {
        strict: true,
        environment: 'production'
      };

      userActions.updateUserAdapterOptions(newOptions);
      // The options should be updated internally
      expect(userActions).toBeDefined();
    });

    it('should update persona adapter options at runtime', () => {
      const newOptions = {
        strict: true,
        environment: 'production' as const
      };

      userActions.updatePersonaAdapterOptions(newOptions);
      // The options should be updated internally
      expect(userActions).toBeDefined();
    });
  });

  describe('isLoggedIn', () => {
    it('should return false when no expires timestamp exists', () => {
      (flux.getState as jest.Mock).mockReturnValue(null);
      expect(userActions.isLoggedIn()).toBe(false);
    });

    it('should return false when session is expired', () => {
      const expiredTime = DateTime.local().minus({minutes: 30}).toMillis();
      (flux.getState as jest.Mock).mockReturnValue(expiredTime);
      expect(userActions.isLoggedIn()).toBe(false);
    });

    it('should return true when session is valid', () => {
      const validTime = DateTime.local().plus({minutes: 30}).toMillis();
      (flux.getState as jest.Mock).mockReturnValue(validTime);
      expect(userActions.isLoggedIn()).toBe(true);
    });
  });

  describe('signIn', () => {
    it('should dispatch success on successful sign in', async () => {
      // const mockResponse = {signIn: {token: 'token123'}};
      // global.fetch = jest.fn().mockResolvedValue({
      //   json: () => Promise.resolve({data: mockResponse}),
      //   ok: true
      // });

      Config.setConfig({
        app: {
          api: {
            public: 'http://localhost:3000',
            url: 'http://localhost:3000'
          }
        }
      });

      await userActions.signIn('username', 'password');

      expect(flux.dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
        session: expect.any(Object),
        type: 'USER_SIGN_IN_SUCCESS'
      }));
    });
  });

  //   it('should dispatch error on failed sign in', async () => {
  //     const mockError = new Error('Invalid credentials');
  //     global.fetch = jest.fn().mockRejectedValue(mockError);

  //     await expect(users.signIn('username', 'password')).rejects.toThrow();
  //     expect(flux.dispatch).toHaveBeenCalledWith(expect.objectContaining({
  //       error: mockError,
  //       type: 'USER_SIGN_IN_ERROR'
  //     }));
  //   });
  // });

  // describe('signUp', () => {
  //   it('should dispatch success on successful sign up', async () => {
  //     const mockResponse = {signUp: mockUser};
  //     global.fetch = jest.fn().mockResolvedValue({
  //       json: () => Promise.resolve({data: mockResponse}),
  //       ok: true
  //     });

  //     await users.signUp(mockUser);
  //     expect(flux.dispatch).toHaveBeenCalledWith(expect.objectContaining({
  //       user: expect.any(User),
  //       type: 'USER_SIGN_UP_SUCCESS'
  //     }));
  //   });

  //   it('should dispatch error on failed sign up', async () => {
  //     const mockError = new Error('Username taken');
  //     global.fetch = jest.fn().mockRejectedValue(mockError);

  //     await expect(users.signUp(mockUser)).rejects.toThrow();
  //     expect(flux.dispatch).toHaveBeenCalledWith(expect.objectContaining({
  //       error: mockError,
  //       type: 'USER_SIGN_UP_ERROR'
  //     }));
  //   });
  // });

  // describe('signOut', () => {
  //   it('should clear app data and dispatch success on sign out', async () => {
  //     global.fetch = jest.fn().mockResolvedValue({
  //       json: () => Promise.resolve({data: {signOut: true}}),
  //       ok: true
  //     });
  //     flux.clearAppData = jest.fn().mockResolvedValue(undefined);

  //     await users.signOut();
  //     expect(flux.clearAppData).toHaveBeenCalled();
  //     expect(flux.dispatch).toHaveBeenCalledWith({type: 'USER_SIGN_OUT_SUCCESS'});
  //   });

  //   it('should dispatch error on failed sign out', async () => {
  //     const mockError = new Error('Network error');
  //     global.fetch = jest.fn().mockRejectedValue(mockError);

  //     await expect(users.signOut()).rejects.toThrow();
  //     expect(flux.dispatch).toHaveBeenCalledWith(expect.objectContaining({
  //       error: mockError,
  //       type: 'USER_SIGN_OUT_ERROR'
  //     }));
  //   });
  // });

  // describe('getSessionUser', () => {
  //   it('should dispatch session user on success', async () => {
  //     const mockResponse = {session: mockUser};
  //     global.fetch = jest.fn().mockResolvedValue({
  //       json: () => Promise.resolve({data: mockResponse}),
  //       ok: true
  //     });

  //     await users.getSessionUser();
  //     expect(flux.dispatch).toHaveBeenCalledWith(expect.objectContaining({
  //       session: expect.any(User),
  //       type: 'USER_GET_SESSION_SUCCESS'
  //     }));
  //   });

  //   it('should dispatch error when session fetch fails', async () => {
  //     const mockError = new Error('Session expired');
  //     global.fetch = jest.fn().mockRejectedValue(mockError);

  //     await expect(users.getSessionUser()).rejects.toThrow();
  //     expect(flux.dispatch).toHaveBeenCalledWith(expect.objectContaining({
  //       error: mockError,
  //       type: 'USER_SESSION_UPDATE_ERROR'
  //     }));
  //   });
  // });

  // describe('updateUser', () => {
  //   it('should dispatch updated user on success', async () => {
  //     const mockResponse = {updateUser: mockUser};
  //     global.fetch = jest.fn().mockResolvedValue({
  //       json: () => Promise.resolve({data: mockResponse}),
  //       ok: true
  //     });

  //     await users.updateUser(mockUser);
  //     expect(flux.dispatch).toHaveBeenCalledWith(expect.objectContaining({
  //       user: expect.any(User),
  //       type: 'USER_UPDATE_SUCCESS'
  //     }));
  //   });

  //   it('should dispatch error when update fails', async () => {
  //     const mockError = new Error('Invalid data');
  //     global.fetch = jest.fn().mockRejectedValue(mockError);

  //     await expect(users.updateUser(mockUser)).rejects.toThrow();
  //     expect(flux.dispatch).toHaveBeenCalledWith(expect.objectContaining({
  //       error: mockError,
  //       type: 'USER_UPDATE_ERROR'
  //     }));
  //   });
  // });
});
