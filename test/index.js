'use strict';

const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const konfig = require('../lib');


describe('konfig', () => {
  const konfig = require('../lib/');

  context('loading config/app.yml', () => {
    it('read configuration for NODE_ENV=development rightly', () => {
      process.env.NODE_ENV = 'development';
      process.env.BRAND = 'awesome';

      const config = konfig(null, { dir: path.join(__dirname, 'config') });

      expect(config.port).to.equal(8080);
      expect(config.logger.file).to.equal('info');
      expect(config.logger.stdout).to.equal('debug');
      expect(config.endpoint.api).to.equal('http://dev.example.com/api');
      expect(config.resource.some_table).to.equal('prefix-awesome-development');
      expect(config.resource.user_table).to.equal('users-development');
      expect(config.dev.foo).to.equal('Foo');
    });

    it('read configuration for NODE_ENV=test rightly', () => {
      process.env.NODE_ENV = 'test';
      process.env.BRAND = 'ok';

      const config = konfig(null, { dir: path.join(__dirname, 'config') });

      expect(config.port).to.equal(8080);
      expect(config.logger.file).to.equal('debug');
      expect(config.logger.stdout).to.equal('debug');
      expect(config.endpoint.api).to.equal('http://test.example.com/api');
      expect(config.resource.some_table).to.equal('prefix-ok-test');
      expect(config.resource.user_table).to.equal('no-table');
      expect(config.dev.foo).to.equal('Foo');
      expect(config.test_resources[0]).to.equal('one');
      expect(config.test_resources[1]).to.equal(2);
    });

    it('read configuration for NODE_ENV=production rightly', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.BRAND;

      const config = konfig(null, { dir: path.join(__dirname, 'config') });

      expect(config.port).to.equal(8080);
      expect(config.logger.file).to.equal('error');
      expect(config.logger.stdout).to.equal('info');
      expect(config.endpoint.api).to.equal('http://www.example.com/api');
      expect(config.resource.some_table).to.equal('prefix--production');
      expect(config.resource.user_table).to.equal('production-users');
      expect(config.resource.book_table).to.equal('-books');
      expect(config.dev).to.be.undefined;
    });
  });

  context('loading config/another.yaml', () => {
    it('read configuration for NODE_ENV=integration rightly', () => {
      process.env.NODE_ENV = 'integration';

      const config = konfig('another', { dir: path.join(__dirname, 'config') });

      expect(config.port).to.equal(10080);
    });

    it('read configuration for NODE_ENV=unknown rightly', () => {
      process.env.NODE_ENV = 'unknown';

      const config = konfig('another', { dir: path.join(__dirname, 'config') });

      expect(config.port).to.be.undefined;
    });
  });

});
