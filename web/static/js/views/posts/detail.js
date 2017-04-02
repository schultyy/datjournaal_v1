import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import PostActions from '../../actions/posts';
import SessionActions from '../../actions/sessions';
import { push } from 'react-router-redux';
import TileComponent from '../posts/tile';
import DocMeta from 'react-doc-meta';
import { absoluteUrlForPost } from '../../utils';


class PostDetailComponent extends React.Component {
  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    const phoenixAuthToken = localStorage.getItem('phoenixAuthToken');
    if (phoenixAuthToken && !currentUser) {
      dispatch(SessionActions.currentUser());
    }
    const postId = this.props.params.slug;
    dispatch(PostActions.fetchPost(postId));
  }

  onHideClick(post) {
    const { dispatch } = this.props;
    dispatch(PostActions.hidePost(post.slug));
  }

  onShowClick(post) {
    const { dispatch } = this.props;
    dispatch(PostActions.showPost(post.slug));
  }

  getMetaTags() {
    const { post } = this.props;
    if (!post) {
      return {};
    }
    const meta = [
      { property: 'title', content: 'Dat Journaal' },
      { property: 'description', content: post.description },
    ];
    return meta;
  }

  render() {
    const { fetching, errors, post, currentUser } = this.props;
    if (fetching) {
      return (
        <div>Fetching...</div>
      );
    } else if (errors) {
      return (
        <div>{errors[0].message}</div>
      );
    }
    if (!post) {
      return false;
    }

    if (currentUser) {
      var onHideClick = this.onHideClick.bind(this, post);
      var onShowClick = this.onShowClick.bind(this, post);
    } else {
      var onHideClick = null;
      var onShowClick = null;
    }

    const meta = this.getMetaTags();

    return (
      <div className="detail-view">
        <DocMeta tags={meta} />
        <TileComponent
          post={post}
          onHide={onHideClick}
          onShow={onShowClick}
          isDetailMode
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  fetching: state.posts.fetching,
  post: state.posts.currentPost,
  errors: state.posts.formErrors,
  currentUser: state.session.currentUser,
});

export default connect(mapStateToProps)(PostDetailComponent);
