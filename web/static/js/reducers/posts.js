import Constants from '../constants';

const initialState = {
  currentPost: null,
  posts: [],
  formErrors: null,
  fetching: true
};

export default function reducer(state = initialState, action = {}) {
  switch(action.type) {
    case Constants.POSTS_FETCHING:
      return { ...state, fetching: true };
    case Constants.POST_FETCHING:
      return { ...state, fetching: true };
    case Constants.POSTS_RECEIVED:
      return { ...state, posts: action.posts, fetching: false };
    case Constants.POST_RECEIVED:
      return { ...state, currentPost: action.post, fetching: false, formErrors: null };
    case Constants.FETCH_POST_ERROR:
      console.log("FETCH POST ERROR", action);
      return { ...state, fetching: false, formErrors: action.errors};
    case Constants.CREATE_POST_ERROR:
      return { ...state, formErrors: action.errors};
    case Constants.POST_CREATING:
      return { ...state, formErrors: null };
    case Constants.POST_CREATED:
      return { ...state, formErrors: null };
    default:
      return state;
  }
}
