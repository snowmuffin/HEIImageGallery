
import 'whatwg-fetch';
global.setImmediate = global.setImmediate || ((fn, ...args) => setTimeout(fn, 0, ...args));
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

if (typeof global.FormData === 'undefined') {
  global.FormData = require('form-data');
}
