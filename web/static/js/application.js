import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import invariant from 'invariant';
import configureStore from './store';
import configRoutes from './routes';

const target = document.getElementById('main_container');
const configuredStore = configureStore(browserHistory);

const RootView = (routerHistory, store) => {
  invariant(
    routerHistory,
    '<Root /> needs either a routingContext or routerHistory to render.',
  );

  return (
    <Provider store={store}>
      <Router history={routerHistory}>
        {configRoutes(store)}
      </Router>
    </Provider>
  );
};

RootView.propTypes = {
  routerHistory: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

ReactDOM.render(RootView(
  syncHistoryWithStore(browserHistory, configuredStore),
  configuredStore,
), target);
