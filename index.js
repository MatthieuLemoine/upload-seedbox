// eslint-disable-next-line no-global-assign
require = require('@std/esm')(module, { cjs: true, esm: 'js' });

module.exports = require('./src/index');
