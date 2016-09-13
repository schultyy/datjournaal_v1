import React              from 'react';
import { connect }        from 'react-redux';
import Actions            from '../../actions/posts';
import { push }           from 'react-router-redux';
import { TileComponent }  from '../posts/tile';


class HomeIndexView extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(Actions.fetchPosts());
  }

  onTileDoubleClick(post) {
    const { dispatch } = this.props;

    dispatch(push(`/posts/${post.id}`));
  }

  render() {
    let { posts } = this.props || [];

    return (
      <div className="container">
          <div className="row">
            {posts.map((post) =>{
              return (
                <div className="col-xs-12" key={post.id}>
                  <TileComponent
                    post={post}
                    onDoubleClick={this.onTileDoubleClick.bind(this, post)}
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
  return state.posts;
};

export default connect(mapStateToProps)(HomeIndexView);
