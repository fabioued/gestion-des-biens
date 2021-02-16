import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, withRouter, Switch, Route } from 'react-router-dom';

import App from './components/App';
import LoadingIndicator from './components/LoadingIndicator';
import NotFound from './components/NotFound';

import AuthService from './services/auth';
import MissionsService from './services/missions';
import NotificationsService from './services/notifications';

const Main = withRouter(props => ((
  <App
    authService={new AuthService()}
    missionsService={new MissionsService()}
    notyService={new NotificationsService()}
    {...props} />
)));


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Main />
      {/* <Route path="*" component={NotFound} /> */}
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
