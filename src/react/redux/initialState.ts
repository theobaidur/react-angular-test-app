import { Person, MyConnection, AuthInfo, Account, Sync } from './types';

export const myConnection: MyConnection = new MyConnection();
export const myPerson: Person = new Person(true);
export const myPartner: Person = new Person(false);
export const authInfo: AuthInfo = new AuthInfo();
export const account: Account = new Account();
export const specialist: Account = new Account();
export const sync: Sync = new Sync();

export class Dossier {
  constructor(
    myPerson: Person,
    myPartner: Person,
    myConnection: MyConnection,
    authInfo: AuthInfo,
    account: Account,
    specialist: Account,
    sync: Sync
  ) {
    this.account = account;
    this.authInfo = authInfo;
    this.router = undefined;
    this.myPerson = myPerson;
    this.myPartner = myPartner;
    this.myConnection = myConnection;
    this.sync = sync;
    this.specialist = specialist;
  }

  account: Account;
  specialist: Account;
  authInfo: AuthInfo;
  router: any;
  myPerson: Person;
  myPartner: Person;
  myConnection: MyConnection;
  sync: Sync;
}

export default new Dossier(myPerson, myPartner, myConnection, authInfo, account, specialist, sync);
