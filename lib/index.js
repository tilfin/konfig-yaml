'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const merge = require('deepmerge');

const configCache = {}; // memory cache


module.exports = function(name, opts) {
  const opts_ = opts || {};
  const basename = name || 'app';
  const env = opts_.env || process.env.NODE_ENV || 'development';
  const dirPath = path.resolve(process.cwd(), opts_.path || 'config');

  const cfgKey = basename + '/' + env;
  if (cfgKey in configCache) {
    return configCache[cfgKey];
  }

  const cfg = loadConfigFile(basename, dirPath);
  const cfgForEnv = mergeConfig(cfg[env], cfg['default']);

  if (!cfgForEnv) {
    throw new Error('The configuration for ' + env + ' is not defined in ' + basename);
  }

  configCache[cfgKey] = cfgForEnv;
  return cfgForEnv;
}


function loadConfigFile(basename, dir) {
  const pathWithoutExt = path.join(dir, basename);
  let configPath = null;
  for (let ext of ['.yml', '.yaml']) {
    const file = pathWithoutExt + ext;
    if (fs.existsSync(file)) {
      configPath = file;
      break;
    }
  }
  if (!configPath) {
    throw new Error('Not found configuration yaml file');
  }

  const rawStr = fs.readFileSync(configPath, 'utf8');

  const envs = process.env;
  const strExpandedEnvs = rawStr.replace(/\$\{(.+?)\}/g, function(match, p1) {
      return envs[p1] || '';
    });

  return yaml.load(strExpandedEnvs);
}


function mergeConfig(target, defaults) {
  return merge(defaults || {}, target || {}, {
      // Do not merging array but replacing one
      arrayMerge: function(added, adding) { return adding; }
    });
}