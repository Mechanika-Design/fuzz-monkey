<img src="media/logo.png" alt="Fuzzmonkey" width="350" />

> Robust and versatile headless monkey (fuzz) testing for the web with reproducible steps, error alerts, strategy sharing and many other good things.

![Travis](http://img.shields.io/travis/com/bell-lab-apps/fuzz-monkey.svg?style=for-the-badge)
![Project Status: WIP](https://img.shields.io/badge/REPO%20STATUS-WIP-orange?style=for-the-badge)

![screenshot](media/screenshot.png "screenshot")

It's important to remember that [monkey testing](https://en.wikipedia.org/wiki/Monkey_testing) should be used in conjunction with smarter tests such as [integration tests](https://en.wikipedia.org/wiki/Integration_testing).

## Getting Started

Once `fuzzmonkey` has been installed globally, you can begin testing by supplying the `--url` parameter you'd like to test. As that's the only required field, testing begins immediately and proceeds with 50 actions.

```console
fuzzmonkey --url https://bellhelmets.com/
```

For other parameters you can type `fuzzmonkey --help` at any time.

### Authenticating

Oftentimes you'll want to authenticate before proceeding with the testing. In cases such as these `fuzzmonkey` provides a hooks file where you export two optional functions &mdash; `create` and `destroy` &mdash; you can specify the location of the hooks file with the `--hooks` parameter.

The hooks file **must** be in the `*.mjs` format &ndash; for instance to authenticate on a fictitious website one might implement the following.

```javascript
export const create = async (page) => {
    await page.goto('https://www.example.com/');
    await page.focus('#username');
    await page.keyboard.type('fuzzmonkey');
    await page.focus('#password');
    await page.keyboard.type('monkeynuts');
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
};
```

## Meet the Team

Currently we have the following set of monkeys that perform various actions on your supplied domain:

<table>
    <tr>
        <td><img src="media/team/clicker.svg" alt="Fuzzmonkey" width="150" /></td>
        <td><strong>Clicker</strong></td>
        <td>Performs clicks in random regions of the visible viewport.</td>
    </tr>
    <tr>
        <td><img src="media/team/networker.svg" alt="Fuzzmonkey" width="150" /></td>
        <td><strong>Networker</strong></td>
        <td>Cycles through a list of preset network conditions.</td>
    </tr>
    <tr>
        <td><img src="media/team/scroller.svg" alt="Fuzzmonkey" width="150" /></td>
        <td><strong>Scroller</strong></td>
        <td>Scrolls the viewport to different areas of the page.</td>
    </tr>
    <tr>
        <td><img src="media/team/sizer.svg" alt="Fuzzmonkey" width="150" /></td>
        <td><strong>Sizer</strong></td>
        <td>Randomly selects a different height and width for the viewport.</td>
    </tr>
    <tr>
        <td><img src="media/team/toucher.svg" alt="Fuzzmonkey" width="150" /></td>
        <td><strong>Toucher</strong></td>
        <td>Similar to the <code>clicker</code> action but instead performs touches.</td>
    </tr>
    <tr>
        <td><img src="media/team/typer.svg" alt="Fuzzmonkey" width="150" /></td>
        <td><strong>Typer</strong></td>
        <td>Focuses on random input fields and types random characters.</td>
    </tr>
    <tr>
        <td><img src="media/team/refresher.svg" alt="Fuzzmonkey" width="150" /></td>
        <td><strong>Refresher</strong></td>
        <td>Refreshes the page occasionally.</td>
    </tr>
</table>
