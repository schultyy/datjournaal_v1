import React from 'react';
import DocMeta from 'react-doc-meta';
import { push } from 'react-router-redux';
import PostActions from '../../actions/posts';
import SessionActions from '../../actions/sessions';
import TileComponent from '../posts/tile';
import { setDocumentTitle } from '../../utils';


export default class HomeIndexView extends React.Component {
  componentDidMount() {
    setDocumentTitle('Dat Journaal');
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
      { property: 'og:description', content: '' },
      { property: 'og:image', content: '' },
      { property: 'twitter:card', content: '' },
      { property: 'twitter:image', content: '' },
      { property: 'twitter:title', content: '' },
      { property: 'twitter:description', content: '' },
    ];
    return meta;
  }

  render() {
    const { posts, currentUser } = this.props || [];
    const bindHideClickHandler = (post) => {
      if (currentUser) {
        return this.onHideClick.bind(this, post);
      }
      return null;
    };

    const bindShowClickHandler = (post) => {
      if (currentUser) {
        return this.onShowClick.bind(this, post);
      }
      return null;
    };

    const meta = this.getMetaTags();

    return (
      <div>
        <DocMeta tags={meta} />
        <div className="tile-list">
          {posts.map((post, index) => (
            <div key={post.slug}>
              <TileComponent
                post={post}
                onDoubleClick={this.onTileDoubleClick.bind(this, post)}
                onHide={bindHideClickHandler(post)}
                onShow={bindShowClickHandler(post)}
                isFirst={index === 0}
                isDetailMode={false}
              />
            </div>
              ))}
        </div>
      </div>
    );
  }
}
