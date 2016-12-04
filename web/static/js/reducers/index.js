import { combineReducers }  from 'redux';
import { routerReducer }    from 'react-router-redux';
import session              from './session';
import registration         from './registration';
import posts                from './posts';
import stats                from './stats';
import user                 from './user';

export default combineReducers({
  routing: routerReducer,
  session: session,
  registration: registration,
  posts: posts,
  stats: stats,
  user: user
});
