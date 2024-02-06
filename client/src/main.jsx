import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { CookiesProvider } from 'react-cookie';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
    <Provider store={store}>
      <App />
    </Provider>
    </CookiesProvider>
  </React.StrictMode>
);
