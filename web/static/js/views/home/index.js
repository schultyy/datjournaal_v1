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
          <div className="row">
            {posts.map((post) =>{
              return (
                <div className="col-xs-12">
                  <TileComponent key={post.id} imageUrl={post.image} description={post.description} postedAt={post.inserted_at} />
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
