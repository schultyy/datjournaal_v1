import Constants from '../constants';

const initialState = {
  posts: [],
  formErrors: null,
  fetching: true
};

export default function reducer(state = initialState, action = {}) {
  switch(action.type) {
    case Constants.POSTS_FETCHING:
      return { ...state, fetching: true };
    case Constants.POSTS_RECEIVED:
      return { ...state, posts: action.posts, fetching: false };
    default:
      return state;
  }
}
