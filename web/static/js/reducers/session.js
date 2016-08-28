import Constants from '../constants';

const initialState = {
  currentUser: null,
  socket: null,
  errors: null,
};

export default function reducer(state = initialState, action = {}) {
  switch(action.type) {
    case Constants.CURRENT_USER:
      return { ...state, currentUser: action.currentUser, errors: null };
    case Constants.SESSIONS_ERROR:
      return { ...state, errors: action.error };
    case Constants.REGISTRATIONS_ERROR:
      return { ...state, errors: action.errors };
    case Constants.USER_SIGNED_OUT:
      return initialState;
    default:
      return state;
  }
}
