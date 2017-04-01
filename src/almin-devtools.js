// MIT © 2017 azu
"use strict";

/**
 * @type {boolean}
 */
const withDevTools = (
    // process.env.NODE_ENV === 'development' &&
    typeof window !== 'undefined' && window.devToolsExtension
);

/**
 * This connect from Almin's context to DevTools
 *
 * - If the state is changed by dispatching
 *   - When anyone payload is dispatched and the UseCase did executed, send to devTools.
 *   - When anyone payload is dispatched and the state is changed, send to devTools
 * - If the state is changed by UseCase
 *   - When anyone UseCase is completed, send to devTools
 *
 * @param {Context} alminContext
 * @param {*} devTools
 */
const contextToDevTools = (alminContext, devTools) => {
    /**
     * @type {Object[]}
     */
    let currentDispatching = [];
    const sendDispatched = () => {
        if (currentDispatching.length > 0) {
            const currentState = alminContext.getState();
            currentDispatching.forEach(payload => {
                devTools.send(payload.type, currentState);
            });
            currentDispatching = [];
        }
    };
    alminContext.onDispatch((payload, meta) => {
        currentDispatching.push(payload);
    });
    alminContext.onChange(() => {
        sendDispatched()
    });
    alminContext.onDidExecuteEachUseCase(() => {
        sendDispatched();
    });
    alminContext.onCompleteEachUseCase((payload, meta) => {
        requestAnimationFrame(() => {
            devTools.send(`UseCase:${meta.useCase.name}`, alminContext.getState());
        });
    });
    alminContext.onErrorDispatch((payload) => {
        devTools.error(payload.error.message);
    });
}


const DefaultDevToolsOptions = {
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
};

module.exports = class AlminDevTools {
    /**
     * @param {Context} alminContext
     */
    constructor(alminContext) {
        this.devTools = undefined;
        this.alminContext = alminContext;
    }

    /**
     * connect to devTools
     * @param {Object} options redux-devtools-extension options
     * @see http://extension.remotedev.io/docs/API/Arguments.html
     */
    connect(options = DefaultDevToolsOptions) {
        if (!withDevTools) {
            return;
        }
        this.devTools = window.devToolsExtension.connect(options);
        contextToDevTools(this.alminContext, this.devTools);
    }

    /**
     * initialize state
     * @param {*} state
     */
    init(state = this.alminContext.getState()) {
        if (!withDevTools) {
            return;
        }
        this.devTools.init(state);
    }

    /**
     * register subscribe handler to devTools
     * @param {function(message: Object)} handler
     * @returns {function()} unsubscribe function
     */
    subscribe(handler) {
        return this.devTools.subscribe(handler);
    }

    /**
     * @param {*} action
     * @param {*} state
     * @see http://extension.remotedev.io/docs/API/Methods.html
     */
    send(action, state) {
        if (!withDevTools) {
            return;
        }
        this.devTools.send(action, state);
    }

    /**
     * @param {*} message
     * @see http://extension.remotedev.io/docs/API/Methods.html
     */
    error(message) {
        if (!withDevTools) {
            return;
        }
        this.devTools.error(message);
    }

    /**
     * disconnect to devTools
     */
    disconnect() {
        if (!withDevTools) {
            return;
        }
        this.devTools.disconnect();
    }
};