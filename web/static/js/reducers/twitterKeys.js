import Constants from '../constants';

const initialState = {
  formErrors: null,
  updating: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Constants.POSTING_TWITTER_ACCESS_KEY:
      return Object.assign({}, state, {
        updating: true,
        formErrors: null,
      });
    case Constants.POSTED_TWITTER_ACCESS_KEY:
      return Object.assign({}, initialState);
    case Constants.POST_TWITTER_ACCESS_KEY_ERROR:
      return Object.assign({}, state, {
        updating: false,
        formErrors: action.errors,
      });
    default:
      return state;
  }
}
