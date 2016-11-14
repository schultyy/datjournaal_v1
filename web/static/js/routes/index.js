import { IndexRoute, Route }        from 'react-router';
import React                        from 'react';
import MainLayout                   from '../layouts/main';
import ShellContainer               from '../containers/shell';
import HomeIndexView                from '../views/home';
import SessionsNew                  from '../views/sessions/new';
import PostsNew                     from '../views/posts/new';
import PostDetailView               from '../views/posts/detail';
import StatsView                    from '../views/stats';
import ImprintView                  from '../views/imprint';

export default function configRoutes(store) {
  return (
    <Route component={MainLayout}>
      <Route path="/sign_in" component={SessionsNew} />

      <Route path="/" component={ShellContainer}>
        <IndexRoute component={HomeIndexView} />
        <Route path="/stats" component={StatsView} />
        <Route path="/posts/new" component={PostsNew} />
        <Route path="/imprint" component={ImprintView} />
        <Route path="/:slug" component={PostDetailView} />
      </Route>
    </Route>
  );
};
