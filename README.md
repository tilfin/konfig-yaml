konfig-yaml
===========

[![NPM Version][npm-image]][npm-url]
[![Build Status](https://travis-ci.org/tilfin/konfig-yaml.svg?branch=master)](https://travis-ci.org/tilfin/konfig-yaml)

The loader of yaml base configuration for each run enviroments like [settingslogic](https://github.com/settingslogic/settingslogic).

- Expand environment variables (ex. `users-${NODE_ENV}`)
    - If an environment variable is not set, it is to be emtpy string.
    - If `${DB_USER:-user}` or `${DB_USER:user}` is defined, `user` is expanded unless DB_USER does not exists.
- Deep merge the environment settings and default settings (except array items)
- Node.js 4.3 or later

## Install

```
$ npm i konfig-yaml
```


## How to Use

```
const konfig = require('konfig-yaml');

config = konfig(<name>, [opts]);
```

* `name` specifys the name of `config/<name>.yml` ( default `app` )
* `opts`
  * `path` config directory path resolved from the process current one ( default `config` )
  * `env` Run environment ( default **NODE_ENV** value or `development` )
  * `useCache` whether using cache ( default `true` )

#### Clear cache

```
konfig.clear();
```


## Example

### Setup

#### config/app.yml

```
default:
  port: 8080
  logger:
    level: info
  db:
    name: ${BRAND}-app-${NODE_ENV}
    user: user
    pass: pass

production:
  port: 1080
  logger:
    level: error
  db:
    pass: Password
```

#### main.js

```
const konfig = require('konfig-yaml');
const config = konfig();

console.log(config.port);
console.log(config.logger.level);
console.log(config.db.user);
console.log(config.db.name);
console.log(config.db.password);
```

### Run

#### In development

```
$ NODE_ENV=development BRAND=normal node main.js
8080
info
normal-app-development
user
pass
```

#### In production

```
$ NODE_ENV=production BRAND=awesome node main.js
1080
error
awesome-app-production
user
Password
```


## License

  [MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/konfig-yaml.svg
[npm-url]: https://npmjs.org/package/konfig-yaml
