import React       from 'react';
import { connect } from 'react-redux';
import Actions     from '../../actions/posts';
import { TileComponent }    from '../posts/tile';

class HomeIndexView extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(Actions.fetchPosts());
  }

  render() {
    let { posts } = this.props || [];

    return (
      <div className="container">
          {posts.map((post) =>{
            return (
              <TileComponent key={post.id} description={post.description} />
            );
          })}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state.posts;
};

export default connect(mapStateToProps)(HomeIndexView);
