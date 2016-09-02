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
    case Constants.CREATE_POST_ERROR:
      return { ...state, formErrors: action.errors};
    default:
      return state;
  }
}
