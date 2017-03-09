// LICENSE : MIT
"use strict";
import React from "react";
import { Context, Dispatcher, StoreGroup } from "almin";
import AlminDevTools from "../../../src/almin-devtools"
import Counter from './Counter';
import { CounterStore } from "../store/CounterStore";
// a single dispatcher
const dispatcher = new Dispatcher();
// a single store
const store = new StoreGroup([new CounterStore()]);
const appContext = new Context({
    dispatcher,
    store
});
export default class App extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = appContext.getState();
    }

    componentDidMount() {
        // when change store, update component
        const onChangeHandler = () => {
            this.setState(appContext.getState());
        };
        appContext.onChange(onChangeHandler);
        // init devTools
        this.devTools = new AlminDevTools(appContext);
        this.devTools.connect();
        this.unsubscribe = this.devTools.subscribe((message) => {
            if (message.type === "DISPATCH" && message.payload.type === "JUMP_TO_ACTION") {
                this.setState(JSON.parse(message.state));
            }
        });
        this.devTools.init(this.state);
    }

    componentWillUnmount() {
        this.unsubscribe();
        this.devTools.disconnect();
    }

    render() {
        /*
         Where is "CounterState" come from? 
         It is CounterStore#getState()'s key name

         getState() {
             return {
                counterState: this.state
             }
         }
        */
        const counterState = this.state.counterState;
        return <Counter counterState={counterState}
                        appContext={appContext}/>
    }
}
