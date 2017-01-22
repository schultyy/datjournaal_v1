import Constants from '../constants';
import { httpPost } from '../utils';

const Actions = {
  updatePassword: (oldPassword, newPassword) => (dispatch) => {
    dispatch({ type: Constants.UPDATING_USER_PASSWORD });
    const data = { old_password: oldPassword, password: newPassword };
    httpPost('/api/v1/users/reset_password', data)
      .then((data) => {
        dispatch({ type: Constants.UPDATED_USER_PASSWORD });
      })
      .catch((error) => {
        const response = error.response;
        response.json()
        .then((json) => {
          dispatch({
            type: Constants.UPDATE_USER_PASSWORD_ERROR,
            errors: json.errors,
          });
        });
      });
  },
  postTwitterAccessToken: twitter_key => (dispatch) => {
    dispatch({ type: Constants.POSTING_TWITTER_ACCESS_KEY });

    httpPost('/api/v1/users/twitter', twitter_key)
      .then((data) => {
        dispatch({ type: Constants.POSTED_TWITTER_ACCESS_KEY });
      })
      .catch((error) => {
        const response = error.response;
        response.json()
        .then((json) => {
          dispatch({
            type: Constants.POST_TWITTER_ACCESS_KEY_ERROR,
            errors: json.errors,
          });
        });
      });
  },
};

export default Actions;
