import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import session from './session';
import registration from './registration';
import posts from './posts';
import stats from './stats';
import userPassword from './userPassword';
import twitter from './twitterKeys';
import location from './location';

export default combineReducers({
  routing: routerReducer,
  session,
  registration,
  posts,
  stats,
  userPassword,
  twitter,
  location,
});
