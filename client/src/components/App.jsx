import React, {Component} from "react";
import Tapestry from "./Tapestry";
import Prompt from "./Prompt";
import Submit from "./Submit";

export default class App extends Component {

  // getInitialState() {
  //   return {
  //     userId: localStorage.getItem("com.eurygloss.userid")
  //   }
  // }
  constructor(props) {
    super(props);
    this.state = {content: []};
    this.updateStateFromServer();
  }

  render() {

    // var submitView = this.state.userId === null ? <Prompt /> : <Submit />

    return (
      <div className="app">

        <Tapestry content={ this.state.content } />

        <button className="refresh" onClick={ this.updateStateFromServer.bind(this) }>Reload</button>

      </div>
      )
  }

  updateStateFromServer() {
    return new Promise(function(resolve, reject) {
      var request = new XMLHttpRequest();
      request.open("GET", "http://localhost:1800/api/content");
      request.onload = function() {
        resolve(request.response);
      };
      request.send();
    }).then(function(content) {
      console.log("Updated state from server...")
      this.setState({content: JSON.parse(content)});
    }.bind(this));
  }
}