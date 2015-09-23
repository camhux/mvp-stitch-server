import React from "react";
import {Provider} from "react-redux";
import {createStore} from "redux";
import App from "./components/App"

var container = document.getElementById("container");

React.render(
  <App />,
  container
);
