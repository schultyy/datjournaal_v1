import React              from 'react';
import { connect }        from 'react-redux';
import PostActions        from '../../actions/posts';
import SessionActions     from '../../actions/sessions';
import { push }           from 'react-router-redux';
import { TileComponent }  from '../posts/tile';
import DocMeta            from 'react-doc-meta';

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

  getMetaTags() {
    const meta = [
      { property: 'og:description', content: "" },
      { property: 'og:image', content: "" },
      { property: 'twitter:card', content: "" },
      { property: 'twitter:image', content: "" },
      { property: 'twitter:title', content: "" }
    ];
    return meta;
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

    const meta = this.getMetaTags();

    return (
      <div className="container">
          <DocMeta tags={meta} />
          <div className="row">
            {posts.map((post, index) =>{
              return (
                <div className="col-xs-12" key={post.slug}>
                  <TileComponent
                    post={post}
                    onDoubleClick={this.onTileDoubleClick.bind(this, post)}
                    onHide={bindHideClickHandler(post)}
                    onShow={bindShowClickHandler(post)}
                    isFirst={index === 0}
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
