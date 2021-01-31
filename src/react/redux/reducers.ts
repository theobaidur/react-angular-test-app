import * as types from './actionTypes';
import { Person, MyConnection, AuthInfo, Account, Sync } from './types';
import { myPerson, myPartner, myConnection, authInfo, account, sync, specialist } from './initialState';

function changePersonReducer(stateChange: Person, action: any, all?: boolean) {
  stateChange.firstName = action.firstName;
  stateChange.lastName = action.lastName;
  stateChange.birthDate = action.birthDate;
  stateChange.gender = action.gender;
  stateChange.image = action.image;
  stateChange.hasPartner = action.hasPartner;
  stateChange.hasEx = action.hasEx;
  stateChange.exes = action.exes;
  if (!all) return stateChange;

  stateChange.legal = action.legal;
  stateChange.result = action.result;
  return stateChange;
}

export function myPersonReducer(state: Person = myPerson, action: any) {
  let stateChange = { ...state };
  switch (action.type) {
    case types.CHANGE_MYPERSON:
      stateChange = changePersonReducer(stateChange, action, true);
      return Object.assign({}, state, stateChange);

    case types.CHANGE_MYPERSON_PROFILE:
      stateChange = changePersonReducer(stateChange, action, false);
      return Object.assign({}, state, stateChange);

    case types.CHANGE_MYPERSON_FAMILY:
      stateChange.exes = action.exes;
      return Object.assign({}, state, stateChange);

    case types.CHANGE_MYPERSON_LEGAL:
      stateChange.legal = action.legal;
      return Object.assign({}, state, stateChange);

    case types.CHANGE_MYPERSON_RESULT:
      stateChange.result = action.result;
      return Object.assign({}, state, stateChange);

    case types.CLEAR_MYPERSON:
      return Object.assign({}, myPerson);

    default:
      return state;
  }
}

export function myPartnerReducer(state: Person = myPartner, action: any) {
  let stateChange = { ...state };
  switch (action.type) {
    case types.CHANGE_MYPARTNER:
      stateChange = changePersonReducer(stateChange, action, true);
      return Object.assign({}, state, stateChange);

    case types.CHANGE_MYPARTNER_ACTIVE:
      if (action.active) {
        stateChange.active = action.active;
        return Object.assign({}, state, stateChange);
      }
      stateChange = new Person(action.active);
      return Object.assign({}, stateChange);

    case types.CHANGE_MYPARTNER_PROFILE:
      stateChange = changePersonReducer(stateChange, action, false);
      return Object.assign({}, state, stateChange);

    case types.CHANGE_MYPARTNER_FAMILY:
      stateChange.exes = action.exes;
      return Object.assign({}, state, stateChange);

    case types.CHANGE_MYPARTNER_LEGAL:
      stateChange.legal = action.legal;
      return Object.assign({}, state, stateChange);

    case types.CHANGE_MYPARTNER_RESULT:
      stateChange.result = action.result;
      return Object.assign({}, state, stateChange);

    case types.CLEAR_MYPARTNER:
      return Object.assign({}, myPartner);

    default:
      return state;
  }
}

export function myConnectionReducer(state: MyConnection = myConnection, action: any) {
  let stateChange = { ...state };
  switch (action.type) {
    case types.CHANGE_MYCONNECTION_PROFILE:
      stateChange.mode = action.mode;
      stateChange.modeStart = action.modeStart;
      stateChange.haveChildren = action.haveChildren;
      stateChange.children = action.children;
      stateChange.legal = action.legal;
      stateChange.result = action.result;
      return Object.assign({}, state, stateChange);

    case types.CHANGE_MYCONNECTION_LEGAL:
      stateChange.legal = action.legal;
      return Object.assign({}, state, stateChange);

    case types.CHANGE_MYCONNECTION_RESULT:
      stateChange.result = action.result;
      return Object.assign({}, state, stateChange);

    case types.CLEAR_MYCONNECTION:
      return Object.assign({}, myConnection);

    default:
      return state;
  }
}

export function loginReducer(state: AuthInfo = authInfo, action: any) {
  let stateChange = { ...state };
  switch (action.type) {
    case types.CHANGE_LOGIN:
      stateChange.loggedIn = action.loggedIn;
      return Object.assign({}, state, stateChange);
    case types.CHANGE_LOADED_STATE:
      stateChange.isLoaded = action.isLoaded;
      return Object.assign({}, state, stateChange);
    case types.CHANGE_APPLICATION:
      stateChange.applications = action.applications;
      return Object.assign({}, state, stateChange);
    case types.PUSH_CONTACT_ATTEMPT:
      stateChange.contactAttempts.push(action.contactForm);
      return Object.assign({}, state, stateChange);
    default:
      return state;
  }
}

export function accountReducer(state: Account = account, action: any) {
  let stateChange = { ...state };
  switch (action.type) {
    case types.CHANGE_ACCOUNT:
      stateChange.code = action.code;
      stateChange.full_name = action.full_name;
      stateChange.lang = action.lang;
      stateChange.mail = action.mail;
      stateChange.phone = action.phone;
      stateChange.is_specialist = action.is_specialist;
      stateChange.own_dossier = action.ownDossier;
      stateChange.username = action.username;
      return Object.assign({}, state, stateChange);
    case types.CLEAR_ACCOUNT:
      return Object.assign({}, account);
    default:
      return state;
  }
}

export function specialistReducer(state: Account = specialist, action: any) {
  let stateChange = { ...state };
  switch (action.type) {
    case types.CHANGE_SPECIALIST:
      stateChange.code = action.code;
      stateChange.full_name = action.full_name;
      stateChange.lang = action.lang;
      stateChange.mail = action.mail;
      stateChange.phone = action.phone;
      stateChange.is_specialist = action.is_specialist;
      stateChange.username = action.username;
      stateChange.platform = action.platform;
      stateChange.profile_pic = action.profile_pic;
      stateChange.state = action.state;
      return Object.assign({}, state, stateChange);
    case types.CLEAR_SPECIALIST:
      return Object.assign({}, specialist);
    default:
      return state;
  }
}

export function syncReducer(state: Sync = sync, action: any) {
  let stateChange = { ...state };
  switch (action.type) {
    case types.UPDATE_SYNC_TIMESTAMP:
      stateChange.timestamp = action.timestamp;
      return Object.assign({}, state, stateChange);
    case types.UPDATE_SYNC_TIMESTAMP_MANUAL:
      stateChange.manualTimestamp = action.manualTimestamp;
      return Object.assign({}, state, stateChange);
    default:
      return state;
  }
}
