import React, { PropTypes }     from 'react';
import { connect }              from 'react-redux';
import PostActions              from '../../actions/posts';
import SessionActions           from '../../actions/sessions';
import { push }                 from 'react-router-redux';


class NewPostComponent extends React.Component {
  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    const phoenixAuthToken = localStorage.getItem('phoenixAuthToken');

    if (phoenixAuthToken && !currentUser) {
      dispatch(SessionActions.currentUser());
    } else {
      dispatch(push('/'));
    }
  }

  render() {
    return (
      <div className="container">
        <h3>Create a new post</h3>
        <form>
          <div className="form-group">
            <label htmlFor="post-description">Description</label>
            <textarea className="post-description" rows="3" className="form-control">
            </textarea>
          </div>
          <button>Create Post</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(NewPostComponent);
