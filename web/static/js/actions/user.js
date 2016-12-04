import Constants from '../constants';
import { httpPost }  from '../utils';

const Actions = {
  updatePassword: (oldPassword, newPassword) => {
    return dispatch => {
      dispatch({ type: Constants.UPDATING_USER_PASSWORD });
      const data = { old_password: oldPassword, password: newPassword };
      httpPost('/api/v1/users/reset_password', data)
      .then((data) => {
        dispatch({ type: Constants.UPDATED_USER_PASSWORD });
      })
      .catch((error) => {
        dispatch({
          type: Constants.UPDATE_USER_PASSWORD_ERROR,
          errors: error
        });
      });
    };
  }
};

export default Actions;