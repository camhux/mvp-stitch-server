import {Component, PropTypes} from "react";

class Tapestry extends Component {

  render() {
    return (

      <div className="tapestry">

        { this.props.content.map( fragment => <Fragment model={ fragment } /> ) }

      </div>


      )
  }
}