import { push } from 'react-router-redux';
import Constants from '../constants';
import { Socket } from '../phoenix.js';
import { httpGet, httpPost, httpDelete, setAuthToken, removeAuthToken } from '../utils';

function setCurrentUser(dispatch, user) {
  dispatch({
    type: Constants.CURRENT_USER,
    currentUser: user,
  });
}

const Actions = {
  currentUser: () => (dispatch) => {
    httpGet('/api/v1/current_user')
      .then((data) => {
        setCurrentUser(dispatch, data);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  signOut: () => (dispatch) => {
    httpDelete('/api/v1/sessions')
      .then((data) => {
        removeAuthToken();

        dispatch({
          type: Constants.USER_SIGNED_OUT,
        });

        dispatch({ type: Constants.FLUSH_POSTS });
        dispatch(push('/'));
      })
      .catch((error) => {
        console.log(error);
      });
  },
  signIn: (email, password) => (dispatch) => {
    const data = {
      session: {
        email,
        password,
      },
    };
    dispatch({ type: Constants.SIGNING_IN });
    httpPost('/api/v1/sessions', data)
      .then((data) => {
        setAuthToken(data.jwt);
        setCurrentUser(dispatch, data.user);
        dispatch({ type: Constants.SIGNED_IN });
        dispatch(push('/'));
      })
      .catch((error) => {
        error.response.json()
        .then((errorJSON) => {
          dispatch({
            type: Constants.SESSIONS_ERROR,
            error: errorJSON.error,
          });
        });
      });
  },

  // ...
};

export default Actions;
