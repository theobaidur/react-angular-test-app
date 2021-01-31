import { createBrowserHistory } from 'history';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';

import rootReducer from './';
import initialState, { Dossier } from './initialState';

export const history = createBrowserHistory();

declare global {
  interface Window {
    moment: any;
  }
}

function configureStoreDev(history: any, initialState: Dossier) {
  const reactRouterMiddleware = routerMiddleware(history);
  const middlewares = [reactRouterMiddleware, thunk];

  const store = createStore(rootReducer(history), { ...initialState }, compose(applyMiddleware(...middlewares)));
  return store;
}

const store = configureStoreDev(history, initialState);

export default store;
