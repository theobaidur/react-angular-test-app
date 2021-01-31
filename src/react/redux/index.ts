import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import {
  myPersonReducer,
  myPartnerReducer,
  myConnectionReducer,
  loginReducer,
  accountReducer,
  syncReducer,
  specialistReducer
} from './reducers';

export default (history: any) =>
  combineReducers({
    myPerson: myPersonReducer,
    myPartner: myPartnerReducer,
    myConnection: myConnectionReducer,
    account: accountReducer,
    router: connectRouter(history),
    authInfo: loginReducer,
    sync: syncReducer,
    specialist: specialistReducer
  });
