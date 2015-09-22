import "babel/polyfill";
import React from "react";
import {Provider} from "react-redux";
import {createStore} from "redux";
import App from "./components/App"

var container = document.getElementById("container");

var getPostsFromServer = function() {
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.addEventListener(function() {
      resolve(this.response);
    });
    request.open("GET", "/api/content");
  });
};

var getPostFromServer = function(postId) {
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.addEventListener(function() {
      resolve(this.response);
    });
    response.open("GET", "/api/content/" + postId)
  });
}

getPostsFromServer.then(function(data) {
  React.render(
    <App content={ data } />,
    container
    );
});