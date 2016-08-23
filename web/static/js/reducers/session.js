import Constants from '../constants';

const initialState = {
  currentUser: null,
  socket: null,
  error: null,
};

export default function reducer(state = initialState, action = {}) {
  switch(action.type) {
    case Constants.CURRENT_USER:
      return { ...state, currentUser: action.currentUser };
    case Constants.REGISTRATIONS_ERROR:
      return { ...state, errors: action.errors };
    default:
      return state;
  }
}
