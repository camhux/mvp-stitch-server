import {Component, PropTypes} from "react";
import stringToColor from "../colorHelper";

export default class Post extends Component {
  render() {
    var postId = this.props.post.id;
    var userId = this.props.post.userId;
    return (
        <div className="post">
        { this.props.post.text }
        <button className="close-post" onClick={ this.props.closeHandler }>Close</button>
        </div>
      );
  }
}

// Post.propTypes = {
//   post: PropTypes.shape({

//       id: PropTypes.string.isRequired,

//       userId: PropTypes.string.isRequired,

//       fragments: PropTypes.arrayOf(PropTypes.shape({
//         raw: PropTypes.string.isRequired,
//         stitched: PropTypes.string.isRequired,
//         clickHandler: PropTypes.func
//       })).isRequired

//     }).isRequired,
//   fragments: PropTypes.arrayOf
// };