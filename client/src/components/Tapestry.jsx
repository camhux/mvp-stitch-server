import React, {Component, PropTypes} from "react";
import Fragment from "./Fragment";

export default class Tapestry extends Component {

  render() {
    console.log(this.props);
    return (

      <div className="tapestry">

        { this.props.content.map( (fragment, i) => <Fragment key={ i } model={ fragment } /> ) }

      </div>


      )
  }
}