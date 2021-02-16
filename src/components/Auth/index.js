import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const Auth = ({
  path, props, component: Component, isAuthenticated,
}) => (
  <Route
    exact
    path={path}
    render={
      (routerProps) => {
        if (isAuthenticated) {
          return <Component {...props} {...routerProps} />;
        }
        return <Redirect to="/se-connecter" />;
      }
    }
  />
);

export default Auth;