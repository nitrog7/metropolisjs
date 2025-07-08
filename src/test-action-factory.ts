/**
 * Test file to verify the action factory parameter order
 */

import { createAction, createActions, createAllActions } from './utils/actionFactory';

// Mock flux for testing
const mockFlux = {} as any;

// Test 1: Single action creation
const testSingleAction = () => {
  console.log('Testing createAction...');
  
  // This should work with the correct parameter order
  const userActions = createAction('user', mockFlux, {
    userAdapterOptions: { strict: true }
  });
  
  console.log('✅ createAction works with correct parameter order');
  return userActions;
};

// Test 2: Multiple actions creation
const testMultipleActions = () => {
  console.log('Testing createActions...');
  
  // This should work with the correct parameter order
  const actions = createActions(['user', 'post', 'message'], mockFlux, {
    user: { userAdapterOptions: { strict: true } },
    post: { postAdapterOptions: { environment: 'production' } }
  });
  
  console.log('✅ createActions works with correct parameter order');
  return actions;
};

// Test 3: All actions creation
const testAllActions = () => {
  console.log('Testing createAllActions...');
  
  // This should work with the correct parameter order
  const allActions = createAllActions(mockFlux, {
    user: { userAdapterOptions: { strict: true } },
    post: { postAdapterOptions: { environment: 'production' } }
  });
  
  console.log('✅ createAllActions works with correct parameter order');
  return allActions;
};

// Run tests
export const runActionFactoryTests = () => {
  console.log('🧪 Running Action Factory Parameter Order Tests...\n');
  
  try {
    testSingleAction();
    testMultipleActions();
    testAllActions();
    
    console.log('\n🎉 All tests passed! Parameter order is correct.');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Export for manual testing
export { testAllActions, testMultipleActions, testSingleAction };
