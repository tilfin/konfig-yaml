konfig-yaml
===========

[![NPM Version][npm-image]][npm-url]
[![Build Status](https://travis-ci.org/tilfin/konfig-yaml.svg?branch=master)](https://travis-ci.org/tilfin/konfig-yaml)

Loader yaml base configuration for each run enviroments.

- Expand environment variables (ex. `users-#{NODE_ENV}`)
- Deep merge the environment settings and default settings (except array items)


## Install

```
$ npm i konfig-yaml
```


## How to Use

```
config = konfig(<name>, [opts]);
```

* `name` specifys the name of `config/<name>.yml`, default `app`
* `opts`
  * `path` config dir path, default `config`
  * `env` Run environment, default *NODE_ENV* or `development`


## Example

### Setup

#### config/app.yml

```
default:
  port: 8080
  logger:
    level: info
  db:
    name: app-#{NODE_ENV}
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
```

### Run

#### In development

```
$ node main.js
8080
info
app-development
user
pass
```

#### In production

```
$ NODE_ENV=production node main.js
1080
error
app-production
user
Password
```


## License

MIT
