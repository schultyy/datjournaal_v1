import Constants              from '../constants';
import { push }               from 'react-router-redux';
import {
  httpGet,
  httpPost,
  httpPostFormData,
  requestLocation
}  from '../utils';

function FormData(data) {
  this.description = data.description;
  this.postOnTwitter = data.postOnTwitter;
  this.image = data.image;
  this.lat = null;
  this.lng = null;
}

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
  },
  fetchPost: (slug) => {
    return dispatch => {
      dispatch({type: Constants.POST_FETCHING});

      httpGet(`/api/v1/posts/${slug}`)
      .then((data) => {
        dispatch({
          type: Constants.POST_RECEIVED,
          post: data
        });
      })
      .catch((error) => {
        error.response.json()
        .then((errorJSON) => {
          dispatch({
            type: Constants.FETCH_POST_ERROR,
            errors: [errorJSON]
          });
        })
      });
    };
  },
  createPost: (data) => {
    return dispatch => {
      dispatch({ type: Constants.POST_CREATED });
      const requestLocationPromise = data.includeLocation ? requestLocation() : Promise.resolve();

      requestLocationPromise
      .then(position => {
        let formData = new FormData(data);
        console.log(position);
        console.log(position.coords);
        if(position) {

          formData.lat = position.coords.latitude;
          formData.lng = position.coords.longitude;
        }
        return httpPostFormData('/api/v1/posts', formData);
      })
      .then((data) => {
        dispatch(push("/"));
      })
      .catch((error) => {
        error.response.json()
        .then((errorJSON) => {
          dispatch({
            type: Constants.CREATE_POST_ERROR,
            errors: errorJSON.errors
          });
        });
      });
    };
  },
  hidePost: (slug) => {
    return dispatch => {
      dispatch({ type: Constants.HIDING_POST });

      httpPost(`/api/v1/posts/${slug}/hide`)
      .then((data) => {
        dispatch({
          type: Constants.POST_HIDDEN,
          post: data
        });
      })
      .catch((error) => {
        error.response.json()
        .then((errorJSON) => {
          dispatch({
            type: Constants.HIDE_POST_ERROR,
            errors: errorJSON.errors
          });
        });
      });
    };
  },
  showPost: (slug) => {
    return dispatch => {
      dispatch({ type: Constants.SHOWING_POST });

      httpPost(`/api/v1/posts/${slug}/show`)
      .then((data) => {
        dispatch({
          type: Constants.POST_SHOWN,
          post: data
        });
      })
      .catch((error) => {
        error.response.json()
        .then((errorJSON) => {
          dispatch({
            type: Constants.HIDE_POST_ERROR,
            errors: errorJSON.errors
          });
        });
      });
    };
  }
};

export default Actions;
