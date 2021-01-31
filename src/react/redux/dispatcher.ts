import * as actions from './actions';

export function dispatchModule(dispatch: Function, state: any, moduleName: string, moduleData: any, moduleResult: any) {
  if (moduleName !== 'profile' && moduleName !== 'children') {
    const states = [state.myPerson, state.myPartner, state.myConnection];
    const results = [moduleResult.self, moduleResult.partner, moduleResult.connection];
    for (var k = 0; k < 3; k++) {
      dispatch(actions.changeLegal(k, states[k], moduleName, { ...moduleData[k] }));
      dispatch(actions.changeResult(k, states[k], moduleName, { ...results[k] }));
    }
  } else {
    for (var i = 0; i < 3; i++) {
      dispatch(actions.changeProfile(i, { ...moduleData[i] }));
    }
  }
}

export function dispatchApplications(dispatch: Function, state: any) {
  dispatch(actions.setApplications(state));
}
