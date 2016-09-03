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
    case Constants.POST_CREATING:
      console.log('POST CREATING', { ...state, formErrors: null });
      return { ...state, formErrors: null };
    case Constants.POST_CREATED:
      return { ...state, formErrors: null };
    default:
      return state;
  }
}
