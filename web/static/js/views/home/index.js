import React       from 'react';
import { connect } from 'react-redux';
import Actions     from '../../actions/posts';

class HomeIndexView extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(Actions.fetchPosts());
  }

  render() {
    let { posts } = this.props || [];

    return (
      <div className="container">
        <ul>
          {posts.map((post) =>{
            return (
              <li key={post.id}>
                {post.description}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state.posts;
};

export default connect(mapStateToProps)(HomeIndexView);
