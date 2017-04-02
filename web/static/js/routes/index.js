import { IndexRoute, Route } from 'react-router';
import React from 'react';
import ShellContainer from '../containers/Shell';
import HomeIndexView from '../containers/Home.js';
import SessionsNew from '../views/sessions/new';
import PostsNew from '../views/posts/new';
import PostDetailView from '../views/posts/detail';
import StatsView from '../views/stats';
import ImprintView from '../views/imprint';
import UserDetailView from '../views/userdetails';

export default function configRoutes(store) {
  return (
    <Route>
      <Route path="/sign_in" component={SessionsNew} />

      <Route path="/" component={ShellContainer}>
        <IndexRoute component={HomeIndexView} />
        <Route path="/stats" component={StatsView} />
        <Route path="/posts/new" component={PostsNew} />
        <Route path="/about" component={ImprintView} />
        <Route path="/userdetails" component={UserDetailView} />
        <Route path="/:slug" component={PostDetailView} />
      </Route>
    </Route>
  );
}
