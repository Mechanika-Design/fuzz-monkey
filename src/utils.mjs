import * as R from 'ramda';
import * as behaviors from './behaviors/index.mjs';

export function runBehavior(params) {
  const keys = Object.keys(behaviors);
  const count = keys.length;
  const name = keys[Math.floor(Math.random() * count)];
  return behaviors[name](params);
}

export function mockNatives(page) {
  page.exposeFunction('alert', R.identity);
  page.exposeFunction('confirm', R.identity);
  page.exposeFunction('prompt', R.identity);
}
