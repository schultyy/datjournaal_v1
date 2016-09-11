import React, { PropTypes }     from 'react';
import { connect }              from 'react-redux';
import PostActions              from '../../actions/posts';
import { push }                 from 'react-router-redux';
import { TileComponent }    from '../posts/tile';


class PostDetailComponent extends React.Component {
  componentDidMount() {
    const { dispatch, currentUser } = this.props;

    const postId = this.props.params.id;
    dispatch(PostActions.fetchPost(postId));
  }

  render() {
    const { fetching, post } = this.props;

    if(fetching) {
      return (
        <div>Fetching...</div>
      );
    }

    const imageUrl = `/${post.image}`;

    return (
      <TileComponent
        imageUrl={imageUrl}
        description={post.description}
        postedAt={post.inserted_at}
        userHandle={post.user.handle} />
    );
  }
}
const mapStateToProps = (state) => {
  return {
    fetching: state.posts.fetching,
    post: state.posts.currentPost
  };
};

export default connect(mapStateToProps)(PostDetailComponent);
