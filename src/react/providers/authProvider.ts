import { LoginResponse } from '../services/authService';

interface AuthProvider {
  login: (
    x: string,
    y: string,
    callback: (x: LoginResponse) => void,
    error: (err: any) => void,
    action?: string
  ) => void;
  resetPassword: (mail: string, callback: (x: string) => void, error: (x: string) => void) => void;
  setNewPassword: (
    unlocker: string,
    code: string,
    pass: string,
    callback: (x: string) => void,
    error: (x: string) => void
  ) => void;
  logout: () => void;
  loginSecondFactor: (
    session: string,
    code: string,
    callback: (x: LoginResponse) => void,
    error: (err: any) => void
  ) => void;
  finishRegistration: (
    password: string,
    mobile: string,
    code: string,
    unlocker: string,
    callback: (x: any) => void,
    error: (x: any) => void
  ) => void;
  sendEmailForRegistration: (
    email: string,
    refer: string | undefined,
    optout: boolean,
    promotion: string | undefined,
    callback: (res: any) => void,
    err: (err: any) => void
  ) => void;
}

const authProvider: AuthProvider = {
  login(
      ) {
    // httpService.get(
    //   '',
    //   {
    //     action,
    //     login_name: login,
    //     login_pass: password
    //   },
    //   callback,
    //   error
    // );
  },
  loginSecondFactor() {
    // httpService.get(
    //   '',
    //   {
    //     action: 'login_2fa',
    //     session: authService.isCookiePresented() ? undefined : session,
    //     login_code: code
    //   },
    //   callback,
    //   error
    // );
  },
  resetPassword() {
    // httpService.get(
    //   '',
    //   {
    //     action: httpActions.RESET_PASSWORD,
    //     mail: mail,
    //     domain: window.location.host
    //   },
    //   (res: any) => {
    //     if (res.status === 'ok') {
    //       callback(res.status);
    //     } else if (res.error) {
    //       error(res.error);
    //     }
    //   },
    //   () => error('ServerError')
    // );
  },
  setNewPassword(
      ) {
    // httpService.get(
    //   '',
    //   { action: httpActions.SET_NEW_PASSWORD, unlocker, code, pass },
    //   (res: any) => {
    //     if (res.error) error(res.error);
    //     else if (res.status === 'ok') {
    //       callback(res.username);
    //     } else error('ServerError');
    //   },
    //   () => error('ServerError')
    // );
  },
  sendEmailForRegistration(
      ) {
    // httpService.get(
    //   '',
    //   {
    //     action: httpActions.CREATE_ACCOUNT,
    //     mail: email,
    //     domain: window.location.origin,
    //     userName: email,
    //     refer: refer,
    //     promotion: promotion,
    //     optout: optout
    //   },
    //   (res: any) => {
    //     if (res && res.error) err(res.error);
    //     else callback(res);
    //   },
    //   err
    // );
  },
  logout() {
    // httpService.get(
    //   '',
    //   {
    //     action: httpActions.LOGOUT
    //   },
    //   () => {},
    //   () => {}
    // );
  },
  finishRegistration(
      ) {
    // httpService.get(
    //   '',
    //   {
    //     action: httpActions.ACTIVE_ACCOUNT,
    //     pass: password,
    //     mobile,
    //     code,
    //     unlocker
    //   },
    //   (res: any) => {
    //     if (res.error) error(res.error);
    //     else callback(res);
    //   },
    //   error
    // );
  }
};

export default authProvider;
