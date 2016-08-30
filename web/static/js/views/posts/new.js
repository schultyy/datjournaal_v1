import React, { PropTypes }     from 'react';
import { connect }              from 'react-redux';
import PostActions              from '../../actions/posts';
import SessionActions           from '../../actions/sessions';
import { push }                 from 'react-router-redux';


class NewPostComponent extends React.Component {
  constructor(props) {
    super(props);
    this.createNewPost = this.createNewPost.bind(this);
  }
  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    const phoenixAuthToken = localStorage.getItem('phoenixAuthToken');

    if (phoenixAuthToken && !currentUser) {
      dispatch(SessionActions.currentUser());
    } else {
      dispatch(push('/'));
    }
  }

  createNewPost(event) {
    event.preventDefault();
    const { dispatch } = this.props;

    let formData = new FormData("post");
    formData.append("description", this.refs.description.value);
    formData.append("image", this.refs.file.files[0]);

    dispatch(PostActions.createPost(formData));
  }

  render() {
    return (
      <div className="container">
        <h3>Create a new post</h3>
        <form>
          <div className="form-group">
            <label htmlFor="post-file">Pick a file</label>
            <input type="file" ref="file" className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="post-description">Description</label>
            <textarea ref="description" className="post-description" rows="3" className="form-control">
            </textarea>
          </div>
          <button onClick={this.createNewPost}>Create Post</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(NewPostComponent);
