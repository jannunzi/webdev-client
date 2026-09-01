"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import CounterRedux from "./CounterRedux";

export default function ReduxExamples() {
  return (
    <Provider store={store}>
      <div id="wd-redux-examples">
        <h2>Redux Toolkit</h2>
        <CounterRedux />
        <hr />
      </div>
    </Provider>
  );
}
