import { getEncrypted } from '../pages/login/page/loginEncrypt';
import { Account } from '../redux/types';
import authProvider from '../providers/authProvider';
import { config } from '../config';
import accountProvider from '../providers/accountProvider';
import { AngularBridge } from './angularBridge';

export interface LoginResponse {
  errors: Array<any>;
  error: any;
  mode: 'pro' | 'easy';
  sid: string;
  accept: number;
  factors: number;
  unlocker: string | undefined;
  user_id: number;
}

interface AuthService {
  tryToLogin: (
    x: string,
    y: string,
    callback: (x: Account | LoginResponse) => void,
    error: (err: any) => void,
    action?: string
  ) => void;
  setSessionToStorage: (x: string) => void;
  removeSessionFromStorage: () => void;
  secondFactor: (session: string, code: string, callback: (x: Account) => void, error: (err: any) => void) => void;
  handleLogin: (callback: (x: Account) => void, error: (x: any) => void) => void;
  isCookiePresented: () => boolean;
  redirectToProMode: () => void;
  logout: (x: () => void) => void;
  getUserInfo: (session: string | null, callback: (x: Account) => void, error: (x: any) => void) => void;
  isLoggedIn: () => boolean;
  getSessionFromStorage: () => string | null;
  syncDossier: (reason: string) => void;
  syncInProgress: boolean;
  forceSyncConfirmed: boolean;
}

const authService: AuthService = {
  tryToLogin(
    login: string,
    password: string,
    callback: (x: Account | LoginResponse) => void,
    error: (err: any) => void,
    action: string = 'login'
  ) {
    const encrypted: any = getEncrypted(password);
    authProvider.login(
      login,
      encrypted.code,
      (res: LoginResponse) => {
        if (res.errors && res.errors.length > 0) {
          error(res.errors[0]);
        } else if (res.factors > 1) {
          callback(res);
        } else if (res.user_id > 0) {
          this.getUserInfo(res.sid, (x: Account) => callback({ ...x, mode: res.mode }), error);
        } else {
          error(res.error);
        }
      },
      error,
      action
    );
  },
  secondFactor(session: string, code: string, callback: (x: Account) => void, error: (err: any) => void) {
    authProvider.loginSecondFactor(
      session,
      code,
      (res: LoginResponse) => {
        if (res.accept !== 1) {
          error('InvalidCode');
        } else if (res.user_id > 0 && res.accept === 1) {
          this.getUserInfo(session, callback, error);
        } else {
          error(res.error);
        }
      },
      (err: any) => error(err)
    );
  },
  getUserInfo(_session: string | null, callback: (x: any) => void, error: (x: any) => void) {
    AngularBridge.getUser()
                .then(callback)
                .catch(error);
  },
  handleLogin(callback: (x: any) => void, error: (x: any) => void) {
    this.getUserInfo(null, callback, error);
  },
  isLoggedIn() {
    return !!AngularBridge.hasUserData();
  },
  logout(callback: () => void) {
    document.cookie =
      window.location.hostname.replace(/\./g, '_') + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.removeSessionFromStorage();
    accountProvider.logout(callback);
  },
  isCookiePresented() {
    const cookieName: string = window.location.hostname.replace(/\./g, '_');
    let session: string | null = getCookie(cookieName);

    if (session) return true;
    return false;
  },
  setSessionToStorage(value: string) {
    localStorage.setItem('session', value);
  },
  getSessionFromStorage(): string | null {
    let session: string | null = getCookie(window.location.hostname.replace(/\./g, '_'));
    if (!session) session = localStorage.getItem('session');
    return session;
  },
  removeSessionFromStorage() {
    localStorage.removeItem('session');
  },
  redirectToProMode() {
    window.location.href = config.monetoApiUrl;
  },
  syncInProgress: false,
  forceSyncConfirmed: false,
  syncDossier() {}
};

const getCookie = (name: string) => {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
};

export default authService;
