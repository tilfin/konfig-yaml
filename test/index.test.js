'use strict';

const path = require('path');
const chai = require('chai');
const expect = chai.expect;

process.chdir('test')

describe('konfig', () => {
  const konfig = require('../');

  context('loading config/app.yml', () => {
    it('read configuration for NODE_ENV=development rightly', () => {
      process.env.NODE_ENV = 'development';
      process.env.BRAND = 'awesome';

      const config = konfig();

      expect(config.port).to.equal(8080);
      expect(config.logger.file).to.equal('info');
      expect(config.logger.stdout).to.equal('debug');
      expect(config.endpoint.api).to.equal('http://dev.example.com/api');

      // Override array items
      expect(config.levels.length).to.equal(2);
      expect(config.levels[0]).to.equal('info');
      expect(config.levels[1]).to.equal('error');
      expect(config.user_names.length).to.equal(2);
      expect(config.user_names[0]).to.equal('ken');
      expect(config.user_names[1]).to.equal('taro');

      expect(config.resource.some_table).to.equal('prefix-awesome-development');
      expect(config.resource.user_table).to.equal('users-development');
      expect(config.dev.foo).to.equal('Foo');

      expect(config.db.user).to.equal('user');
      expect(config.db.pass).to.equal('password');
    });

    it('read configuration for NODE_ENV=test rightly', () => {
      process.env.NODE_ENV = 'test';
      process.env.BRAND = 'ok';
      process.env.DATABASE_USER = 'myUser';
      process.env.DATABASE_PASSWORD = 'PassworD';

      const config = konfig(null);

      expect(config.port).to.equal(8080);
      expect(config.logger.file).to.equal('debug');
      expect(config.logger.stdout).to.equal('debug');
      expect(config.endpoint.api).to.equal('http://test.example.com/api');
      expect(config.resource.some_table).to.equal('prefix-ok-test');
      expect(config.resource.user_table).to.equal('no-table');
      expect(config.dev.foo).to.equal('Foo');

      // Override array items
      expect(config.levels.length).to.equal(1);
      expect(config.levels[0]).to.equal('debug');
      expect(config.user_names.length).to.equal(1);
      expect(config.user_names[0]).to.equal('hanako');

      expect(config.test_resources[0]).to.equal('one');
      expect(config.test_resources[1]).to.equal(2);

      expect(config.db.user).to.equal('myUser');
      expect(config.db.pass).to.equal('PassworD');
    });

    it('read configuration for NODE_ENV=production rightly', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.BRAND;

      // name is default app, path is absolute.
      const config = konfig(null, { path: path.join(__dirname, 'config') });

      expect(config.port).to.equal(8080);
      expect(config.logger.file).to.equal('error');
      expect(config.logger.stdout).to.equal('info');
      expect(config.endpoint.api).to.equal('http://www.example.com/api');
      expect(config.resource.some_table).to.equal('prefix--production');
      expect(config.resource.user_table).to.equal('production-users');
      expect(config.resource.book_table).to.equal('-books');
      expect(config.dev).to.be.undefined;

      // Default array items
      expect(config.levels.length).to.equal(2);
      expect(config.levels[0]).to.equal('trace');
      expect(config.levels[1]).to.equal('info');
    });
  });

  context('loading config/another.yaml', () => {
    it('read configuration for NODE_ENV=integration rightly', () => {
      process.env.NODE_ENV = 'integration';

      // path is default config.
      const config = konfig('another');

      expect(config.port).to.equal(10080);
    });

    it('read configuration for NODE_ENV=unknown rightly', () => {
      process.env.NODE_ENV = 'unknown';

      // path is absolute.
      const config = konfig('another', { path: path.join(__dirname, 'config') });

      expect(config.port).to.be.undefined;
    });
  });

  context('loading config/cachetest.yml', () => {
    it('read configuration', () => {
      process.env.BRAND = 'awesome';

      const config = konfig('cachetest');

      expect(config.name).to.equal('awesome');
    });

    it('read configuration using cache default', () => {
      process.env.BRAND = '';

      const config = konfig('cachetest');

      expect(config.name).to.equal('awesome');
    });

    it('read configuration with useCache=true', () => {
      process.env.BRAND = 'another';

      const config = konfig('cachetest', { useCache: true });

      expect(config.name).to.equal('awesome');
    });

    it('read configuration with useCache=false', () => {
      const config = konfig('cachetest', { useCache: false });

      expect(config.name).to.equal('another');
    });
  });

  context('loading setting/app.yaml', () => {
    it('read configuration with path', () => {
      const config = konfig(null, { path: 'setting' });
      expect(config.foo).to.equal('aaa');
    });

    it('read configuration with path and env', () => {
      const config = konfig(null, { path: 'setting', env: 'test2' });
      expect(config.foo).to.equal('bbb');
    });
  });
});
