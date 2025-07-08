// Mock for @nlabs/arkhamjs
class FluxFramework {
  constructor() {
    this.stores = new Map();
    this.actions = new Map();
  }

  addStore(name, store) {
    this.stores.set(name, store);
  }

  addAction(name, action) {
    this.actions.set(name, action);
  }

  dispatch(action, data) {
    // Mock dispatch implementation
    return Promise.resolve();
  }
}

class Flux {
  constructor() {
    this.framework = new FluxFramework();
  }

  dispatch(action, data) {
    return this.framework.dispatch(action, data);
  }
}

const ArkhamConstants = {
  ACTIONS: {
    USER: {
      LOGIN: 'USER_LOGIN',
      LOGOUT: 'USER_LOGOUT',
      UPDATE: 'USER_UPDATE'
    }
  }
};

module.exports = {
  FluxFramework,
  Flux,
  ArkhamConstants
};

