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
import PensionPlanning from '../app_core/pensionPlanning/pensionPlanning';
import LeftBehindPlanning from '../app_core/leftBehindPlanning/leftBehindPlanning';
import DisabilityPlaning from '../app_core/disabiltyPlanning/disabilityPlanning';

type Prop = {
  form: 'profile' | 'pension-planning' | 'disability-planning' | 'left-behind-planning';
}

export const App: React.FC<Prop> = ({form}) => {

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
            { form === 'profile' && <Profile /> }
            { form === 'pension-planning' && <PensionPlanning /> }
            { form === 'left-behind-planning' && <LeftBehindPlanning /> }
            { form === 'disability-planning' && <DisabilityPlaning /> }

          </FormContainer>
        </ConnectedRouter>
      </Provider>
    </ThemeProvider>
  );
};

export default process.env.NODE_ENV === 'development' ? hot(App) : App;
