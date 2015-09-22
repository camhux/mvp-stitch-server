import {Component, PropTypes} from "react";
import stringToColor from "../colorHelper";

export default class Fragment extends Component {

  getInitialState() {
    return {revealRaw: false};
  }

  render() {
    var text = this.state.showRaw ? this.props.model.raw : this.props.model.inline;
    var className = this.state.showRaw ? "revealed" : "inline";
    return (
        <span style={ stringToColor(this.props.model.postId) } onMouseEnter={ this.showRaw() } onMouseExit={ this.showInline() } >{ text }</span>
      )
  }

  showRaw() {
    this.setState({showRaw: true});
  }

  showInline() {
    this.setState({showRaw: false});
  }
}