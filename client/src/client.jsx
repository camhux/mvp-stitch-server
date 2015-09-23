// import "babel/polyfill";
import React from "react";
import {Provider} from "react-redux";
import {createStore} from "redux";
import App from "./components/App"

var container = document.getElementById("container");

var getTextFromServer = function() {
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open("GET", "http://localhost:1800/api/content");
    request.onload = function() {
      resolve(request.response);
    };
    request.send();
  });
};

// var getPostFromServer = function(postId) {
//   return new Promise(function(resolve, reject) {
//     var request = new XMLHttpRequest();
//     request.addEventListener(function() {
//       resolve(this.response);
//     });
//     response.open("GET", "/api/content/" + postId)
//   });
// }

getTextFromServer().then(function(data) {
  console.log("AJAX successful: ", data);
  React.render(
    <App content={ JSON.parse(data) } />,
    container
    );
});