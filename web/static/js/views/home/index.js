import React              from 'react';
import { connect }        from 'react-redux';
import PostActions        from '../../actions/posts';
import SessionActions     from '../../actions/sessions';
import { push }           from 'react-router-redux';
import { TileComponent }  from '../posts/tile';


class HomeIndexView extends React.Component {
  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    const phoenixAuthToken = localStorage.getItem('phoenixAuthToken');
    dispatch(PostActions.fetchPosts());
    if (phoenixAuthToken && !currentUser) {
      dispatch(SessionActions.currentUser());
    }
  }

  onTileDoubleClick(post) {
    const { dispatch } = this.props;

    dispatch(push(`/posts/${post.id}`));
  }

  onHideClick(post) {
    const { dispatch } = this.props;
    dispatch(PostActions.hidePost(post.id));
  }

  render() {
    let { posts, currentUser } = this.props || [];
    var self = this;
    function bindHideClickHandler(post) {
      if(currentUser) {
        return self.onHideClick.bind(self, post);
      } else {
        return null;
      }
    }

    return (
      <div className="container">
          <div className="row">
            {posts.map((post) =>{
              return (
                <div className="col-xs-12" key={post.id}>
                  <TileComponent
                    post={post}
                    onDoubleClick={this.onTileDoubleClick.bind(this, post)}
                    onHide={bindHideClickHandler(post)}
                    isDetailMode={false} />
                </div>
              );
            })}
          </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
    ...state.posts
  };
};

export default connect(mapStateToProps)(HomeIndexView);
