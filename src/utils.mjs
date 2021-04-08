import * as behaviors from './behaviors/index.mjs';

export function runBehavior(page) {
  const keys = Object.keys(behaviors);
  const count = keys.length;
  const name = keys[Math.floor(Math.random() * count)];
  return behaviors[name](page);
}
