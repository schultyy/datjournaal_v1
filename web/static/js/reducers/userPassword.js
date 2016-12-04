import Constants from '../constants';

const initialState = {
  formErrors: false,
  updating: false
};

export default function reducer(state = initialState, action = {}) {
  switch(action.type) {
    case Constants.UPDATING_USER_PASSWORD:
      return Object.assign({}, state, {
        updating: true,
        formErrors: null
      });
    case Constants.UPDATED_USER_PASSWORD:
      return Object.assign({}, initialState);
    case Constants.UPDATE_USER_PASSWORD_ERROR:
      return Object.assign({}, state, {
        updating: false,
        formErrors: action.errors
      });
    default:
      return state;
  }
}