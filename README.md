# almin-devtools

Integrate almin into [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension "Redux DevTools Extension").

![ScreenShot](https://monosnap.com/file/rkqr6ZDlKdmAe49mvfw6NCI0gjJKjb.png)

## Features

- Lets you inspect every state and UseCase/dispatch
- See diff of the state
- Import/Export log

## Installation

1. Install [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension "Redux DevTools Extension") to browser
2. Install `almin-devtools` via npm
3. Connect almin to Redux DevTools Extension

### Installation of DevTools extension

#### 1. For Chrome
 - from [Chrome Web Store](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd);
 - or build it with `npm i && npm run build:extension` and [load the extension's folder](https://developer.chrome.com/extensions/getstarted#unpacked) `./build/extension`;
 - or run it in dev mode with `npm i && npm start` and [load the extension's folder](https://developer.chrome.com/extensions/getstarted#unpacked) `./dev`.

#### 2. For Firefox
 - from [Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/remotedev/);
 - or build it with `npm i && npm run build:firefox` and [load the extension's folder](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Temporary_Installation_in_Firefox) `./build/firefox` (just select a file from inside the dir).

#### 3. For Electron
  - just specify `REDUX_DEVTOOLS` in [`electron-devtools-installer`](https://github.com/GPMDP/electron-devtools-installer).

#### 4. For other browsers and non-browser environment
  - use [`remote-redux-devtools`](https://github.com/zalmoxisus/remote-redux-devtools). 

### Installation of almin-devtools

Install with [npm](https://www.npmjs.com/):

    npm install almin-devtools
    
## Usage

Write connection code in your application.

```js
import { Context, Dispatcher, StoreGroup } from "almin";
import AlminDevTools from "almin-devtools"
import { CounterStore } from "../store/CounterStore";
const dispatcher = new Dispatcher();
const store = new StoreGroup([new CounterStore()]);
const appContext = new Context({
    dispatcher,
    store
});
// initialize devTools
const devTools = new AlminDevTools(appContext);
devTools.connect(); // connect
/* customize redux-devtools options
devTools.connect({
    features: {
        pause: true, // start/pause recording of dispatched actions
        lock: true, // lock/unlock dispatching actions and side effects
        persist: false, // persist states on page reloading
        export: true, // export history of actions in a file
        import: 'almin-log', // import history of actions from a file
        jump: false, // jump back and forth (time travelling)
        skip: false, // skip (cancel) actions
        reorder: false, // drag and drop actions in the history list
        dispatch: false, // dispatch custom actions or action creators
        test: true // generate tests for the selected actions
    }
});
*/
devTools.init(appContext.getState()); // record initial state
```

See [Methods (advanced API) · Redux DevTools Extension](http://extension.remotedev.io/docs/API/Methods.html "Methods (advanced API) · Redux DevTools Extension") for more details.

## Alternative

- [almin/almin-logger: logger for Almin.js](https://github.com/almin/almin-logger "almin/almin-logger: logger for Almin.js")

## Changelog

See [Releases page](https://github.com/almin/almin-devtools/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/almin/almin-devtools/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
