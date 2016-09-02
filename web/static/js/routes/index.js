import { IndexRoute, Route }        from 'react-router';
import React                        from 'react';
import MainLayout                   from '../layouts/main';
import ShellContainer               from '../containers/shell';
import HomeIndexView                from '../views/home';
import RegistrationsNew             from '../views/registrations/new';
import SessionsNew                  from '../views/sessions/new';
import PostsNew                     from '../views/posts/new';

export default function configRoutes(store) {
  return (
    <Route component={MainLayout}>
      <Route path="/sign_up" component={RegistrationsNew} />
      <Route path="/sign_in" component={SessionsNew} />

      <Route path="/" component={ShellContainer}>
        <IndexRoute component={HomeIndexView} />
        <Route path="/posts/new" component={PostsNew} />
      </Route>
    </Route>
  );
};
