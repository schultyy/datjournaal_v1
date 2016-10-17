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

    dispatch(push(`/${post.slug}`));
  }

  onHideClick(post) {
    const { dispatch } = this.props;
    dispatch(PostActions.hidePost(post.slug));
  }

  onShowClick(post) {
    const { dispatch } = this.props;
    dispatch(PostActions.showPost(post.slug));
  }

  render() {
    let { posts, currentUser } = this.props || [];
    const bindHideClickHandler = (post) => {
      if(currentUser) {
        return this.onHideClick.bind(this, post);
      } else {
        return null;
      }
    };

    const bindShowClickHandler = (post) => {
      if(currentUser) {
        return this.onShowClick.bind(this, post);
      } else {
        return null;
      }
    }

    return (
      <div className="container">
          <div className="row">
            {posts.map((post) =>{
              return (
                <div className="col-xs-12" key={post.slug}>
                  <TileComponent
                    post={post}
                    onDoubleClick={this.onTileDoubleClick.bind(this, post)}
                    onHide={bindHideClickHandler(post)}
                    onShow={bindShowClickHandler(post)}
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
