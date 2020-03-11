const assert = require('assert');
const calculator = require('../app');

describe('calculator', () => {
  describe('add function', () => {
    it('adds numbers', () => {
      const result = calculator.add(1, 1);
      assert.equal(result, 2);
    });
  });
});
