import React, { useCallback } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { MainComponent } from '../components/common/styled';
import authService from '../services/authService';
import { Dossier } from '../redux/initialState';
import {
  setLogin,
  changeMyPerson,
  changeMyPartner,
  changeMyConnection,
  changeMyPartnerState,
  changeLoadedState,
  changeAccount,
  changeSpecialist,
  updateSyncTimestamp,
  setApplications} from '../redux/actions';
import { Account } from '../redux/types';
import dossierProvider from '../providers/dossierProvider';
import useEffectOnlyOnce from '../utils/useEffectOnlyOnce';
import PensionPlaning from '../app_core/pensionPlanning/pensionPlanning';


const Routes: React.FC<any> = ({children}) => {
  const store = useStore();
  const dispatch = useDispatch();
  const authInfo = useSelector((state: any)=>state.authInfo)
  const changeLoadedAndLoginState = useCallback(
    (loggedIn: boolean) => {
      dispatch(setLogin(loggedIn));
      dispatch(changeLoadedState(true));
    },
    [changeLoadedState, setLogin]
  );

  

  useEffectOnlyOnce(() => {
    const error = () => {
      
    };

    if (authService.isLoggedIn())
      authService.handleLogin((account: Account) => {
        dossierProvider.getDossierInfo((dossier: Dossier, own_dossier: boolean) => {
          dispatch(changeAccount({ ...account, own_dossier }));
          if (dossier) {
            if (dossier.myPerson) {
              dispatch(changeMyPerson(dossier.myPerson));
            }
            if (dossier.myPartner) {
              dispatch(changeMyPartner(dossier.myPartner));
              if (dossier.myPartner.active && dossier.myPerson.hasPartner.indexOf(1) > -1) dispatch(changeMyPartnerState());
            }
            if (dossier.myConnection) {
              dispatch(changeMyConnection(dossier.myConnection));
            }
            if (dossier.specialist) {
              dispatch(changeSpecialist(dossier.specialist));
            }
          }
          dispatch(setApplications(store.getState()));
          changeLoadedAndLoginState(true);
          dispatch(updateSyncTimestamp(dossier.sync.timestamp));
        }, error);
      }, error);
    else {
      changeLoadedAndLoginState(false);
    }
  });
  return (
    authInfo.isLoaded && (
      <MainComponent>
        {children}
      </MainComponent>
    )
  );
};


export default Routes;
