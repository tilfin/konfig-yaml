'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const merge = require('deepmerge');

let configCache = {}; // memory cache


function konfig(name, opts = {}) {
  const { useCache = true } = opts;
  const basename = name || 'app';
  const env = opts.env || process.env.NODE_ENV || 'development';
  const dir = opts.path || process.env.NODE_CONFIG_DIR || 'config'

  const cfgKey = basename + '/' + env;
  if (useCache && cfgKey in configCache) {
    return configCache[cfgKey];
  }

  const cfg = loadConfigFile(basename, path.resolve(process.cwd(), dir));
  const cfgForEnv = mergeConfig(cfg[env], cfg['default']);

  if (!cfgForEnv) {
    throw new Error('The configuration for ' + env + ' is not defined in ' + basename);
  }

  configCache[cfgKey] = cfgForEnv;
  return cfgForEnv;
}
konfig.clear = function() {
  configCache = {};
}

module.exports = konfig

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
  const strExpandedEnvs = rawStr.replace(/\$\{(.+?)\}/g, (match, p1) => {
      const [v, d] = p1.split(/:\-?/, 2)
      return envs[v] || d || '';
    });

  return yaml.load(strExpandedEnvs);
}


function mergeConfig(target, defaults) {
  return merge(defaults || {}, target || {}, {
      // Do not merging array but replacing one
      arrayMerge: (added, adding) => { return adding; }
    });
}
