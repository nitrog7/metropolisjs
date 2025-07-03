describe('Simple Adapter Test', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string operations', () => {
    const testString = 'hello world';
    expect(testString.toUpperCase()).toBe('HELLO WORLD');
  });

  it('should handle object operations', () => {
    const testObj = {name: 'test', value: 123};
    expect(testObj.name).toBe('test');
    expect(testObj.value).toBe(123);
  });
}); 