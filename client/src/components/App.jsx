import {Component} from "react";
import Tapestry from "./Tapestry";
import Prompt from "./Prompt";
import Submit from "./Submit";

class App extends Component {

  getInitialState() {
    return {
      userId: localStorage.getItem("com.eurygloss.userid")
    }
  }

  render() {

    var submitView = this.state.userId === null ? <Prompt /> : <Submit />

    return (
      <div className="app">

        <Tapestry { ...this.props } />

        { submitView }

      </div>
      )
  }
}