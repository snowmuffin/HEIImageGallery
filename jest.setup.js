
import 'whatwg-fetch';
global.setImmediate = global.setImmediate || ((fn, ...args) => setTimeout(fn, 0, ...args));


if (typeof global.FormData === 'undefined') {
  global.FormData = require('form-data');
}
