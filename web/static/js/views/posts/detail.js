import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import DocMeta from 'react-doc-meta';
import PostActions from '../../actions/posts';
import TileComponent from '../posts/tile';



class PostDetailComponent extends React.Component {
  componentDidMount() {
    const { dispatch, params } = this.props;
    const postId = params.slug;
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

  onDeleteClick(post) {
    const { dispatch } = this.props;
    dispatch(PostActions.deletePost(post.slug));
    dispatch(push('/'));
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
      var onDeleteClick = this.onDeleteClick.bind(this, post);
    } else {
      var onHideClick = null;
      var onShowClick = null;
      var onDeleteClick = null;
    }

    const meta = this.getMetaTags();

    return (
      <div className="detail-view">
        <DocMeta tags={meta} />
        <TileComponent
          post={post}
          onHide={onHideClick}
          onShow={onShowClick}
          onDelete={onDeleteClick}
          currentUser={currentUser}
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
