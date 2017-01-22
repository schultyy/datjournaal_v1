import Constants from '../constants';
import { push } from 'react-router-redux';
import {
  httpGet,
  httpPost,
  httpPostFormData,
  requestLocation,
} from '../utils';

function FormData(data) {
  this.description = data.description;
  this.postOnTwitter = data.postOnTwitter;
  this.image = data.image;
  if (data.places_id) {
    this.places_id = data.places_id;
  }
}

const Actions = {
  fetchPosts: () => (dispatch) => {
    dispatch({ type: Constants.POSTS_FETCHING });

    httpGet('/api/v1/posts')
      .then((data) => {
        dispatch({
          type: Constants.POSTS_RECEIVED,
          posts: data.posts,
        });
      });
  },
  fetchPost: slug => (dispatch) => {
    dispatch({ type: Constants.POST_FETCHING });

    httpGet(`/api/v1/posts/${slug}`)
      .then((data) => {
        dispatch({
          type: Constants.POST_RECEIVED,
          post: data,
        });
      })
      .catch((error) => {
        error.response.json()
        .then((errorJSON) => {
          dispatch({
            type: Constants.FETCH_POST_ERROR,
            errors: [errorJSON],
          });
        });
      });
  },
  createPost: data => (dispatch) => {
    dispatch({ type: Constants.POST_CREATED });
    const requestLocationPromise = data.includeLocation ? requestLocation() : Promise.resolve();

    requestLocationPromise
      .then((position) => {
        const formData = new FormData(data);
        if (position) {
          formData.lat = position.coords.latitude;
          formData.lng = position.coords.longitude;
        }
        return httpPostFormData('/api/v1/posts', formData);
      })
      .then((data) => {
        dispatch(push('/'));
      })
      .catch((error) => {
        if (typeof error.json === 'undefined') {
          // Mostly a geolocation error
          dispatch({
            type: Constants.CREATE_POST_ERROR,
            errors: [{ message: error.message }],
          });
        } else {
          error.response.json()
          .then((errorJSON) => {
            dispatch({
              type: Constants.CREATE_POST_ERROR,
              errors: errorJSON.errors,
            });
          });
        }
      });
  },
  hidePost: slug => (dispatch) => {
    dispatch({ type: Constants.HIDING_POST });

    httpPost(`/api/v1/posts/${slug}/hide`)
      .then((data) => {
        dispatch({
          type: Constants.POST_HIDDEN,
          post: data,
        });
      })
      .catch((error) => {
        error.response.json()
        .then((errorJSON) => {
          dispatch({
            type: Constants.HIDE_POST_ERROR,
            errors: errorJSON.errors,
          });
        });
      });
  },
  showPost: slug => (dispatch) => {
    dispatch({ type: Constants.SHOWING_POST });

    httpPost(`/api/v1/posts/${slug}/show`)
      .then((data) => {
        dispatch({
          type: Constants.POST_SHOWN,
          post: data,
        });
      })
      .catch((error) => {
        error.response.json()
        .then((errorJSON) => {
          dispatch({
            type: Constants.HIDE_POST_ERROR,
            errors: errorJSON.errors,
          });
        });
      });
  },
  queryLocationName: locationName => (dispatch) => {
    dispatch({ type: Constants.START_LOCATION_NAME_QUERY });

    const encodedLocationName = encodeURIComponent(locationName);

    httpGet(`/api/v1/location?location_name=${encodedLocationName}`)
      .then((data) => {
        dispatch({
          type: Constants.LOCATION_NAME_QUERY_RESULT,
          locations: data,
        });
      })
      .catch((error) => {
        error.response.json()
        .then((errorJSON) => {
          dispatch({
            type: Constants.LOCATION_NAME_QUERY_ERROR,
            errors: errorJSON.errors,
          });
        });
      });
  },
  clearLocationSuggestions() {
    return {
      type: Constants.CLEAR_LOCATION_SUGGESTIONS,
    };
  },
};

export default Actions;
