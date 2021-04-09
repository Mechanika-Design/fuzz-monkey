import * as R from 'ramda';
import * as behaviors from './behaviors/index.mjs';

export function runBehavior(params) {
  const keys = Object.keys(behaviors);
  const count = keys.length;
  const name = keys[Math.floor(Math.random() * count)];
  return behaviors[name](params);
}

export function silenceDialogs(page) {
  page.exposeFunction('alert', R.identity);
  page.exposeFunction('confirm', R.identity);
  page.exposeFunction('prompt', R.identity);
}

export function exposeFunctions(page) {
    page.exposeFunction('randomBetween', randomBetween);
    page.exposeFunction('fiftyFifty', fiftyFifty);
}

export async function awaitPage(page, timeout) {
    try {
        await page.waitForNavigation({
            waitUntil: 'load',
            timeout
        });
    } catch {}
}

export function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function fiftyFifty() {
    return Math.random() > 0.5;
}
