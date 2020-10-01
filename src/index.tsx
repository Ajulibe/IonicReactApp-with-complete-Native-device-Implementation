import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import MemoriesContextProvider from "./data/MemoriesContextProvider";

ReactDOM.render(
  <MemoriesContextProvider>
    <App />
  </MemoriesContextProvider>,
  document.getElementById("root")
);
