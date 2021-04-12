![Bell Lab Logo](https://bell-lab.s3-us-west-1.amazonaws.com/bell-lab-logo.png "Bell Lab Logo")

Fuzz Monkey
---

> Robust and versatile headless monkey (fuzz) testing for the web with reproducible steps, error alerts, strategy sharing and many other good things.

![Travis](http://img.shields.io/travis/com/bell-lab-apps/fuzz-monkey.svg?style=for-the-badge)
![Project Status: WIP](https://img.shields.io/badge/REPO%20STATUS-WIP-orange?style=for-the-badge)

![screenshot](media/screenshot.png "screenshot")

It's important to remember that [monkey testing](https://en.wikipedia.org/wiki/Monkey_testing) should be used in conjunction with smarter tests such as [integration tests](https://en.wikipedia.org/wiki/Integration_testing).

## Getting Started
```console
node --experimental-modules ./bin/index.mjs --debug --url https://bellhelmets.com/
```
