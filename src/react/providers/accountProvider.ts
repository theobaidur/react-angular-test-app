import { getEncrypted } from '../pages/login/page/loginEncrypt';
import httpService from '../services/httpService';
import { config } from '../config';
import { httpActions } from '../constants/enums';
import { AngularBridge } from '../services/angularBridge';

interface AccountProvider {
  logout: (x: () => void) => void;
  getUserInfo: (session: string | null, callback: (x: any) => void, error: (x: any) => void) => void;
  changePassword: (
    oldPassword: string,
    newPassword: string,
    callback: (res: any) => void,
    err: (err: any) => void
  ) => void;
  changeEmail: (
    password: string,
    email: string,
    code: string,
    callback: (res: any) => void,
    err: (err: any) => void
  ) => void;
  change2faAndPhone: (
    twofa: number,
    currentPassword: string,
    phone: string,
    callback: (res: any) => void,
    err: (err: any) => void
  ) => void;
}

const accountProvider: AccountProvider = {
  getUserInfo(session: string | null, callback: (x: any) => void, error: (x: any) => void) {
    AngularBridge.getUser()
                  .then(callback)
                  .catch(error);
  },
  logout(callback: () => void) {
    // httpService.get(
    //   config.monetoApiUrl,
    //   {
    //     action: httpActions.LOGOUT
    //   },
    //   () => {},
    //   () => {}
    // );
    callback();
  },
  changePassword(oldPassword: string, newPassword: string, callback: (res: any) => void, err: (err: any) => void) {
    let fd: FormData = new FormData();
    fd.append('old', (getEncrypted(oldPassword) as any).code);
    fd.append('pass', newPassword);
    fd.append('action', httpActions.CHANGE_PASSWORD);
    httpService.post(config.monetoApiUrl, fd, callback, err);
  },
  changeEmail(password: string, email: string, code: string, callback: (res: any) => void, err: (err: any) => void) {
    let fd: FormData = new FormData();
    fd.append('mail', email);
    fd.append('code', code);
    fd.append('pass', (getEncrypted(password) as any).code);
    fd.append('action', httpActions.CHANGE_EMAIL);
    httpService.post(config.monetoApiUrl, fd, callback, err);
  },
  change2faAndPhone(
    twofa: number,
    password: string,
    phone: string,
    callback: (res: any) => void,
    err: (err: any) => void
  ) {
    let fd: FormData = new FormData();
    fd.append('twofa', String(twofa));
    fd.append('phone', phone);
    fd.append('pass', (getEncrypted(password) as any).code);
    fd.append('action', httpActions.CHANGE_AUTH_TYPE);
    httpService.post(config.monetoApiUrl, fd, callback, err);
  }
};

export default accountProvider;
