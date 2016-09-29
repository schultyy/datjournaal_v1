import React, { PropTypes }     from 'react';
import { connect }              from 'react-redux';
import PostActions              from '../../actions/posts';
import SessionActions           from '../../actions/sessions';
import { push }                 from 'react-router-redux';
import { TileComponent }        from '../posts/tile';


class PostDetailComponent extends React.Component {
  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    const phoenixAuthToken = localStorage.getItem('phoenixAuthToken');
    dispatch(PostActions.fetchPosts());
    if (phoenixAuthToken && !currentUser) {
      dispatch(SessionActions.currentUser());
    }
    const postId = this.props.params.id;
    dispatch(PostActions.fetchPost(postId));
  }

  onHideClick(post) {
    const { dispatch } = this.props;
    dispatch(PostActions.hidePost(post.id));
  }

  onShowClick(post) {
    const { dispatch } = this.props;
    dispatch(PostActions.showPost(post.id));
  }

  render() {
    const { fetching, errors, post, currentUser } = this.props;
    if(fetching) {
      return (
        <div>Fetching...</div>
      );
    }
    else if(errors) {
      return (
        <div>{errors[0].message}</div>
      );
    }
    if(!post) {
      return false;
    }

    if(currentUser) {
      var onHideClick = this.onHideClick.bind(this, post);
      var onShowClick = this.onShowClick.bind(this, post);
    } else {
      var onHideClick = null;
      var onShowClick = null;
    }

    return (
      <TileComponent
        post={post}
        onHide={onHideClick}
        onShow={onShowClick}
        isDetailMode={true} />
    );
  }
}
const mapStateToProps = (state) => {
  return {
    fetching: state.posts.fetching,
    post: state.posts.currentPost,
    errors: state.posts.formErrors,
    currentUser: state.session.currentUser
  };
};

export default connect(mapStateToProps)(PostDetailComponent);
