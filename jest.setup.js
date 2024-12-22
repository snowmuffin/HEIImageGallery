import 'jest-expo';
import 'whatwg-fetch';

if (typeof global.FormData === 'undefined') {
  global.FormData = require('form-data');
}
