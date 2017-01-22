import Constants from '../constants';

const initialState = {
  signingIn: false,
  currentUser: null,
  socket: null,
  errors: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.CURRENT_USER:
      return { ...state, currentUser: action.currentUser, errors: null };
    case Constants.SIGNING_IN:
      return { ...state, currentUser: null, errors: null, signingIn: true };
    case Constants.SIGNED_IN:
      return { ...state, currentUser: action.currentUser, errors: null, signingIn: false };
    case Constants.SESSIONS_ERROR:
      return { ...state, errors: action.error, signingIn: false };
    case Constants.REGISTRATIONS_ERROR:
      return { ...state, errors: action.errors };
    case Constants.USER_SIGNED_OUT:
      return initialState;
    default:
      return state;
  }
}
