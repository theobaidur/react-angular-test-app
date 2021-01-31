import * as types from './actionTypes';
import { Person, Legal, MyConnection, Result, Account } from './types';
import { progressCheck } from '../utils/progressCheck';

export function changeProfile(target: number, moduleData: any) {
  const type: string = [
    types.CHANGE_MYPERSON_PROFILE,
    types.CHANGE_MYPARTNER_PROFILE,
    types.CHANGE_MYCONNECTION_PROFILE
  ][target];

  return function(dispatch: Function) {
    return dispatch({
      type: type,
      ...moduleData
    });
  };
}

export function changeLegal(target: number, person: Person | MyConnection, moduleName: string, moduleData: any) {
  const type: string = [types.CHANGE_MYPERSON_LEGAL, types.CHANGE_MYPARTNER_LEGAL, types.CHANGE_MYCONNECTION_LEGAL][
    target
  ];

  const legal: Legal = { ...person.legal, [moduleName]: { ...moduleData } };
  
  return function(dispatch: Function) {
    return dispatch({
      type: type,
      legal: legal
    });
  };
}

export function changeResult(target: number, person: Person, moduleName: string, moduleData: any) {
  const type: string = [types.CHANGE_MYPERSON_RESULT, types.CHANGE_MYPARTNER_RESULT, types.CHANGE_MYCONNECTION_RESULT][
    target
  ];

  const result: Result = { ...person.result, [moduleName]: { ...moduleData } };

  return function(dispatch: Function) {
    return dispatch({
      type: type,
      result: result
    });
  };
}

export function changeMyPartnerState(active: boolean = true) {
  return function(dispatch: Function) {
    return dispatch({
      type: types.CHANGE_MYPARTNER_ACTIVE,
      active: active
    });
  };
}

export function clearKey(target: number) {
  const type: string = [types.CLEAR_MYPERSON, types.CLEAR_MYPARTNER, types.CLEAR_MYCONNECTION][target];

  return function(dispatch: Function) {
    return dispatch({
      type: type
    });
  };
}

export function setLogin(loggedIn: boolean) {
  return function(dispatch: Function) {
    return dispatch({
      type: types.CHANGE_LOGIN,
      loggedIn: loggedIn
    });
  };
}

export function setApplications(state: any) {
  const applications = { ...progressCheck(state).authInfo.applications };
  return function(dispatch: Function) {
    return dispatch({
      type: types.CHANGE_APPLICATION,
      applications: applications
    });
  };
}

export function pushContactAttempt(contactForm: any) {
  return function(dispatch: Function) {
    return dispatch({
      type: types.PUSH_CONTACT_ATTEMPT,
      contactForm: contactForm
    });
  };
}

export function changeMyPerson(state: Person) {
  return function(dispatch: Function) {
    return dispatch({
      type: types.CHANGE_MYPERSON,
      ...state
    });
  };
}

export function changeMyPartner(state: Person) {
  return function(dispatch: Function) {
    return dispatch({
      type: types.CHANGE_MYPARTNER,
      ...state
    });
  };
}

export function changeMyConnection(state: MyConnection) {
  return function(dispatch: Function) {
    return dispatch({
      type: types.CHANGE_MYCONNECTION_PROFILE,
      ...state
    });
  };
}

export function changeLoadedState(state: boolean) {
  return function(dispatch: Function) {
    return dispatch({
      type: types.CHANGE_LOADED_STATE,
      isLoaded: state
    });
  };
}

export function changeAccount(account: Account) {
  return function(dispatch: Function) {
    return dispatch({
      type: types.CHANGE_ACCOUNT,
      ...account
    });
  };
}

export function changeSpecialist(specialist: Account) {
  return function(dispatch: Function) {
    return dispatch({
      type: types.CHANGE_SPECIALIST,
      ...specialist
    });
  };
}

export function clearAccount() {
  return function(dispatch: Function) {
    return dispatch({
      type: types.CLEAR_ACCOUNT
    });
  };
}

export function clearSpecialist() {
  return function(dispatch: Function) {
    return dispatch({
      type: types.CLEAR_SPECIALIST
    });
  };
}

export function updateSyncTimestamp(timestamp: number) {
  return function(dispatch: Function) {
    return dispatch({
      type: types.UPDATE_SYNC_TIMESTAMP,
      timestamp: timestamp
    });
  };
}

export function updateSyncTimestampManual(manualTimestamp: number) {
  return function(dispatch: Function) {
    return dispatch({
      type: types.UPDATE_SYNC_TIMESTAMP_MANUAL,
      manualTimestamp: manualTimestamp
    });
  };
}
