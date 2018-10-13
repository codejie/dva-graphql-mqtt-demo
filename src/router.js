import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import GraphQLPage from './routes/graphql-page';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/graphql" exact component={GraphQLPage} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
