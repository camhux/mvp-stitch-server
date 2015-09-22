import {Component, PropTypes} from "react";
import stringToColor from "../colorHelper";

export default class Fragment extends Component {
  render() {
    return (
        <span style={ stringToColor(this.props.postId) onClick={ this.props.clickHandler } }>{ this.props.model.raw }</span>
      )
  }
}