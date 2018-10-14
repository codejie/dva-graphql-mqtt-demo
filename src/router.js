import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import GraphQLPage from './routes/graphql-page';
import MQTTPage from './routes/mqtt-page';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/graphql" exact component={GraphQLPage} />
        <Route path="/mqtt" exact component={MQTTPage} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
