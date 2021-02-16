import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const RedirectIfAuth = ({
  path, props, component: Component, isAuthenticated,
}) => (<Route
  exact
  path={path}
  render={
    (routerProps) => {
      if (!isAuthenticated) {
        return <Component {...props} {...routerProps} />;
      }

      return <Redirect to="/sections" />;
    }
  }
/>
);

export default RedirectIfAuth;