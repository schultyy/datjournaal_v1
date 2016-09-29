import Constants from '../constants';

const initialState = {
  currentPost: null,
  posts: [],
  formErrors: null,
  fetching: true
};

function replaceHiddenPost(posts, hiddenPost) {
  return posts.map(function(post) {
    if(post.id === hiddenPost.id) {
      return hiddenPost;
    } else {
      return post;
    }
  });
}

export default function reducer(state = initialState, action = {}) {
  switch(action.type) {
    case Constants.POSTS_FETCHING:
      return { ...state, fetching: true };
    case Constants.POST_FETCHING:
      return { ...state, fetching: true };
    case Constants.POSTS_RECEIVED:
      return { ...state, posts: action.posts, fetching: false, currentPost: null };
    case Constants.POST_RECEIVED:
      return { ...state, currentPost: action.post, fetching: false, formErrors: null };
    case Constants.FETCH_POST_ERROR:
      return { ...state, fetching: false, formErrors: action.errors};
    case Constants.CREATE_POST_ERROR:
      return { ...state, formErrors: action.errors};
    case Constants.POST_CREATING:
      return { ...state, formErrors: null };
    case Constants.POST_CREATED:
      return { ...state, formErrors: null };
    case Constants.HIDING_POST:
      return { ...state, formErrors: null };
    case Constants.POST_HIDDEN:
      if(state.currentPost) {
        return { ...state, currentPost: action.post, fetching: false, formErrors: null };
      }
      else {
        return { ...state,posts: replaceHiddenPost(state.posts, action.post), currentPost: null, fetching: false, formErrors: null };
      }
    default:
      return state;
  }
}
