import { ModuleProviderBase_Props } from '../app_modules/module.interfaces';
import { pensionPlaningFilter } from '../app_core/pensionPlanning/pensionPlaningFilter';
import { leftBehindPlaningFilter } from '../app_core/leftBehindPlanning/leftBehindPlaningFilter';
import { disabilityPlaningFilter } from '../app_core/disabiltyPlanning/disabilityPlaningFilter';
import { profileFilter } from '../app_core/profile/profileFilter';
import { ModuleFinancesCore_Props, ModuleFinancesResult_Props } from '../app_modules/finances/moduleFinances';
import { ModulePensionStateResult_Props } from "../app_modules/pensionState/ModulePensionStateResult_Props";
import { ModulePensionStateCore_Props } from "../app_modules/pensionState/ModulePensionStateCore_Props";
import { ModuleNeedCore_Props, ModuleNeedResult_Props } from '../app_modules/need/moduleNeed';
import createGUID from '../utils/guidGenerator';
import { getAge } from '../utils/calculators';
import { ModulePensionWorkCore_Props, ModulePensionWorkResult_Props } from '../app_modules/pensionWork/modulePensionWork';
import { ModuleWealthPersonCore_Props, ModuleWealthConnectionCore_Props, ModuleWealthPersonResult_Props, ModuleWealthConnectionResult_Props } from '../app_modules/wealth/moduleWealth';
import { ModulePensionPrivateData, ModulePensionPrivateResult } from '../app_modules/pensionPrivate/modulePensionPrivate';

export class PersonBase {
  constructor() {
    this.id = createGUID();
    this.fullName = function() {
      return this.firstName + (this.firstName !== '' && this.lastName !== '' ? ' ' : '') + this.lastName;
    };
    this.age = function() {
      return getAge(this.birthDate);
    };
  }
  id: string = '';
  firstName: string = '';
  lastName: string = '';
  birthDate: string = '';
  gender: number[] = [];
  image: string = '';
  fullName: () => string;
  age: () => number;
}

export class Person extends PersonBase {
  constructor(active: boolean = true) {
    super();
    this.active = active;
    this.legal = new Legal();
    this.result = new Result();
    this.getChildren = function(
      connection: MyConnection,
      parentMode: false | 1 | 2,
      ageCategory: false | 1 | 2 | 3,
      location: boolean,
      study: boolean
    ) {
      const children: Child[] = [];
      if (parentMode === false || parentMode === 1) {
        children.push(...connection.children);
      }
      if (parentMode === false || parentMode === 2) {
        this.exes.forEach((exConnection: ExConnection) => {
          children.push(...exConnection.children);
        });
      }
      const filteredChildren: Child[] = [];
      children.forEach((child: Child) => {
        const childAge = getAge(child.birthDate);
        if (
          (ageCategory === false ||
            (ageCategory === 1 && childAge < 17) ||
            (ageCategory === 2 && 16 < childAge && childAge < 25) ||
            (ageCategory === 3 && childAge < 25)) &&
          (study === false || (study && child.study && child.study[0] === 1))
        ) {
          filteredChildren.push(child);
        }
      });
      return filteredChildren;
    };
  }
  active: boolean;
  hasPartner: number[] = [];
  email: string = '';
  phone: string = '';
  hasEx: number[] = [];
  exes: ExConnection[] = [];
  legal: Legal;
  result: Result;
  [key: string]: any;
  getChildren: (
    connection: MyConnection,
    parentMode: false | 1 | 2,
    ageCategory: false | 1 | 2 | 3,
    location: boolean,
    study: boolean
  ) => Child[];

  static isPersonValid(target: Person, targetPartner: Person, targetConnection: MyConnection): boolean {
    let targetIsValid = false;
    if (target && target.firstName && target.lastName && target.birthDate && target.gender) {
      if (target.hasPartner && target.hasPartner[0] === 1) {
        if (
          targetPartner &&
          targetPartner.firstName &&
          targetPartner.lastName &&
          targetPartner.birthDate &&
          targetPartner.gender &&
          targetConnection &&
          targetConnection.mode &&
          targetConnection.modeStart
        ) {
          targetIsValid = true;
        }
      } else {
        targetIsValid = true;
      }
    }
    return targetIsValid;
  }
}

export class Account {
  code: string = '';
  full_name: string = '';
  lang: string = '';
  mail: string = '';
  is_specialist: number = 0;
  phone: string = '';
  username: string = '';
  platform: string = '';
  profile_pic: string = '';
  own_dossier: boolean = true;
  state?: number;
}

export class Sync {
  timestamp: number = 0;
  manualTimestamp: number = 0;
}

export class Child {
  id: string = '';
  firstName: string = '';
  lastName: string[] = [];
  gender: number[] = [];
  birthDate: string = '';
  study: number[] = [];
  studyDate: string = '';
  addr: number[] = [];
}

export class ConnectionBase {
  constructor() {
    this.id = createGUID();
    this.addChild = function(props) {
      const oldChild = this.children.find((child) => child.id === props.id);
      const child = oldChild ? oldChild : new Child();
      child.firstName = props.firstName;
      child.gender = props.gender;
      child.birthDate = props.birthDate;
      if (!oldChild) this.children.push(child);
    };
    this.removeChild = function(id: string) {
      this.children = this.children.filter((x) => x.id !== id);
    };
  }
  id: string;
  children: Child[] = [];
  mode: number[] = [];
  modeStart: string = '';
  addChild: (child: Child) => void;
  removeChild: (id: string) => void;
}

export class MyConnection extends ConnectionBase {
  constructor() {
    super();
    this.legal = new Legal();
    this.result = new Result();
  }
  legal: Legal;
  result: Result;
  [key: string]: any;
}

export class ExConnection extends ConnectionBase {
  birthDate: string = '';
  gender: number[] = [];
  modeEnd: string = '';
  alimony: number[] = [];
}

export class Legal {
  constructor() {
    this.children = {};
    this.finances = {};
    this.pensionState = {};
    this.pensionWork = {};
    this.pensionPrivate = {};
    this.need = {};
    this.wealth = {};
  }
  children: { [key: string]: any } | {};
  finances: ModuleFinancesCore_Props | { [key: string]: any };
  pensionState: ModulePensionStateCore_Props | { [key: string]: any };
  pensionWork: ModulePensionWorkCore_Props | { [key: string]: any };
  pensionPrivate: ModulePensionPrivateData | { [key: string]: any };
  need: ModuleNeedCore_Props | { [key: string]: any };
  wealth: ModuleWealthPersonCore_Props | ModuleWealthConnectionCore_Props | { [key: string]: any };
  [key: string]: { [key: string]: any } | {};
}

export class Result {
  constructor() {
    this.children = {};
    this.finances = {};
    this.pensionState = {};
    this.pensionWork = {};
    this.pensionPrivate = {};
    this.need = {};
    this.wealth = {};
  }
  children: { [key: string]: any } | {};
  finances: ModuleFinancesResult_Props | { [key: string]: any };
  pensionState: ModulePensionStateResult_Props | { [key: string]: any };
  pensionWork: ModulePensionWorkResult_Props | { [key: string]: any };
  pensionPrivate: ModulePensionPrivateResult | { [key: string]: any };
  need: ModuleNeedResult_Props | { [key: string]: any };
  wealth: ModuleWealthPersonResult_Props | ModuleWealthConnectionResult_Props | { [key: string]: any };
  [key: string]: { [key: string]: any };
}

export class AuthInfo {
  constructor() {
    this.loggedIn = false;
    this.isLoaded = false;
    this.applications = {
      profile: {
        progress: 0,
        filter: profileFilter
      },
      pensionPlaning: {
        progress: 0,
        filter: pensionPlaningFilter
      },
      disabilityPlaning: {
        progress: 0,
        filter: disabilityPlaningFilter
      },
      leftBehindPlaning: {
        progress: 0,
        filter: leftBehindPlaningFilter
      }
    };
    this.contactAttempts = [];
  }
  loggedIn: boolean;
  isLoaded: boolean;
  applications: {
    profile: {
      progress: number;
      filter: ModuleProviderBase_Props[];
    };
    pensionPlaning: {
      progress: number;
      filter: ModuleProviderBase_Props[];
    };
    disabilityPlaning: {
      progress: number;
      filter: ModuleProviderBase_Props[];
    };
    leftBehindPlaning: {
      progress: number;
      filter: ModuleProviderBase_Props[];
    };
  };
  contactAttempts: any[];
}
