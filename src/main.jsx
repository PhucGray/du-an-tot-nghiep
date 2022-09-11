import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// @styles
import "antd/dist/antd.css";
import "./styles/bootstrap.css";
import "./styles/index.css";

// @redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import storeInit from "./store";

// @navigation
import { BrowserRouter } from "react-router-dom";

const { store, persistor } = storeInit();

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
);
