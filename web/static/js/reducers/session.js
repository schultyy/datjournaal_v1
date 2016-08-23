import Constants from '../constants';

const initialState = {
  currentUser: null,
  socket: null,
  error: null,
};

export default function reducer(state = initialState, action = {}) {
  console.log("CONSTANTS", Constants);
  switch(action.type) {
    case Constants.CURRENT_USER:
      return { ...state, currentUser: action.currentUser, error: null };
    case Constants.SESSIONS_ERROR:
      return { ...state, error: action.error };
    case Constants.REGISTRATIONS_ERROR:
      return { ...state, errors: action.errors };
    case Constants.USER_SIGNED_OUT:
      return initialState;
    default:
      return state;
  }
}
