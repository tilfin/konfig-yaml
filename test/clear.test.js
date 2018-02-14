'use strict';

const chai = require('chai');
const expect = chai.expect;


describe('konfig', () => {
  const konfig = require('../');

  describe('#clear', () => {
    context('loading config/cleartest.yaml', () => {
      it('read configuration before clear', () => {
        process.env.BRAND = 'foo';

        const config = konfig('cleartest');
        expect(config.name).to.equal('foo');
      });

      it('read configuration after clear', () => {
        process.env.BRAND = 'bar';
        konfig.clear();

        const config = konfig('cleartest');
        expect(config.name).to.equal('bar');
      });

      it('read configuration from cache', () => {
        process.env.BRAND = 'foo';

        const config = konfig('cleartest');
        expect(config.name).to.equal('bar');
      });
    });
  });
});
