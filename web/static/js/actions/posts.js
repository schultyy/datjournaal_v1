import Constants              from '../constants';
import { routeActions }       from 'react-router-redux';
import { httpGet, httpPost }  from '../utils';

const Actions = {
  fetchPosts: () => {
    return dispatch => {
      dispatch({ type: Constants.POSTS_FETCHING });

      httpGet('/api/v1/posts')
      .then((data) => {
        dispatch({
          type: Constants.POSTS_RECEIVED,
          posts: data.posts
        });
      });
    };
  }
};

export default Actions;
