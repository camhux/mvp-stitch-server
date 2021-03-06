import React, {Component, PropTypes} from "react";
import stringToColor from "../colorHelper";

export default class Fragment extends Component {

  constructor(props) {
    super(props);
    this.state = {showRaw: false};
  }

  render() {
    var text = this.state.showRaw ? this.props.model.raw : this.props.model.inline;
    var className = this.state.showRaw ? "revealed" : "inline";
    return (
        <span style={ {"color": stringToColor(this.props.model.postId)} } onMouseEnter={ this.showRaw.bind(this) } onMouseLeave={ this.showInline.bind(this) } >{ text } </span>
      )
  }

  showRaw() {
    this.setState({showRaw: true});
  }

  showInline() {
    this.setState({showRaw: false});
  }
}