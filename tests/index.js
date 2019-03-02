const expect = require('chai').expect;
const NetworkEngine = require('../index').NetworkEngine;

describe('Instantiation', () => {
    it('should construct without throwing', () => {
        expect(() => {
            const engine = new NetworkEngine();
        }).to.not.throw;
    });
});