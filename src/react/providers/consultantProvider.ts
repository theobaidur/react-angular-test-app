import httpService from '../services/httpService';
import { config } from '../config';
import { httpActions } from '../constants/enums';

interface ConsultantProvider {
  getLocations: (findText: string, callback: (x: any) => void, err: (x: any) => void) => void;
  requestSpecialist: (formData: FormData, callback: (x: any) => void, err: (x: any) => void) => void;
  dropSpecialist: (callback: (x: any) => void, err: (x: any) => void) => void;
  getOptInState: (callback: (x: any) => void, err: (x: any) => void) => void;
  optInSpecialist: (callback: (x: any) => void, err: (x: any) => void) => void;
}

const consultantProvider: ConsultantProvider = {
  getLocations: (findText: string, callback: (x: any) => void, err: (x: any) => void) => {
    httpService.get(
      config.postcodesUrl,
      {
        match: findText.length < 3 ? 3 : 7,
        find: findText,
        country: 'CH',
        limit: 10
      },
      callback,
      err
    );
  },
  requestSpecialist: (formData: FormData, callback: (x: any) => void, err: (x: any) => void) => {
    httpService.post(`${config.monetoApiUrl}?action=${httpActions.REQUEST_SPECIALIST}`, formData, callback, err);
  },
  dropSpecialist: (callback: (x: any) => void, err: (x: any) => void) => {
    let fd: FormData = new FormData();
    fd.append('action', httpActions.DROP_SPECIALIST);
    httpService.post(config.monetoApiUrl, fd, callback, err);
  },
  getOptInState: (callback: (x: any) => void, err: (x: any) => void) => {
    httpService.get(
      config.monetoApiUrl,
      {
        action: httpActions.GET_OPTIN_STATE
      },
      callback,
      err
    );
  },
  optInSpecialist: (callback: (x: any) => void, err: (x: any) => void) => {
    httpService.get(
      config.monetoApiUrl,
      {
        action: httpActions.OPT_IN_SPECIALIST
      },
      callback,
      err
    );
  }
};

export default consultantProvider;
