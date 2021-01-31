import React, { useLayoutEffect } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { ThemeProvider } from '@material-ui/styles';
import { hot } from 'react-hot-loader/root';

import store, { history } from '../redux/store';
import muiTheme from '../assets/themeProvider';

import '../styles/App.css';
import '../utils/i18n';
import Profile from '../app_core/profile';
import FormContainer from './form-container';

export const App: React.FC = () => {

  useLayoutEffect(() => {
    window.addEventListener('resize', () => {
      const vh: number = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <Provider store={store}>
        <ConnectedRouter key={Math.random() /* <- makes routes work after a hot-reload occurs*/} history={history}>
          <FormContainer>
            <Profile />
          </FormContainer>
        </ConnectedRouter>
      </Provider>
    </ThemeProvider>
  );
};

export default process.env.NODE_ENV === 'development' ? hot(App) : App;
