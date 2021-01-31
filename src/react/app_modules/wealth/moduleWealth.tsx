import { CardWealthPerson, CardWealthConnection } from './cards';
import { CardData_Props, FreeObject } from '../module.interfaces';
import { Dossier } from '../../redux/initialState';
import { ModuleBase } from '../module.helpers';
import { MyConnection, Person } from '../../redux/types';

export class ModuleWealth extends ModuleBase {
  constructor(mode?: number) {
    super();
    this.cards = moduleWealthCards;
    this.views = undefined;
    this.mode = mode || 1;
    this.process = (
      self: FreeObject,
      partner: FreeObject,
      connection: FreeObject,
      state: Dossier
    ) =>
      this.preProcess(
        self as ModuleWealthPersonCore_Props,
        state.myPartner.active ? (partner as ModuleWealthPersonCore_Props) : undefined,
        state.myPartner.active ? (connection as ModuleWealthConnectionCore_Props) : undefined,
        ModuleWealthCore,
        state
      );
  }
  cards: CardData_Props[];
  views: undefined;
  process: (self: FreeObject, partner: FreeObject, connection: FreeObject, state: Dossier) => any;
}

export interface ModuleWealthPersonCore_Props {
  hasWealth: number[];
  wealthBase: number;
  use: {
    [key: string]: number;
  }; 
}
export interface ModuleWealthConnectionCore_Props {
  hasWealth: number[];
  wealthBase: number;
  use: {
    person: { [key: string]: number };
    partner: { [key: string]: number };
  };
}

export interface ModuleWealthPersonResult_Props {
  available: {
    [key: string]: number;
  };
}
export interface ModuleWealthConnectionResult_Props {
  available: {
    person: { [key: string]: number };
    partner: { [key: string]: number };
  };
}

export const ModuleWealthCore = (
  moduleData: ModuleWealthPersonCore_Props | ModuleWealthConnectionCore_Props | undefined,
  mode: number | undefined,
  person: Person | MyConnection | undefined,
  isCon: boolean = false
) => {
  if (!moduleData || !moduleData.hasWealth || moduleData.hasWealth[0] === 2) return {};

  const apps = ['pensionPlaning1','disabilityPlaning1','disabilityPlaning2','leftBehindPlaning1','leftBehindPlaning2'];

  const available: any = {};

  if (isCon) {
    let { wealthBase, use } = moduleData as ModuleWealthConnectionCore_Props;
    
    if( !use ){ 
      use = { person:{}, partner:{} };
      apps.forEach(k => { 
        if(!use.person[k]) use.person[k] = 0; 
        if(!use.partner[k]) use.partner[k] = 0; 
      }); 
    }

    available.person = {};
    available.partner = {};

    const usePerson = use.person; 
    const usePartner = use.partner;

    const pensionPool = usePerson.pensionPlaning1 + usePartner.pensionPlaning1 || 0;
    const disPerson = Math.max( use.person.disabilityPlaning1 || 0, use.person.disabilityPlaning2 || 0 );
    const disPartner = Math.max( use.partner.disabilityPlaning1 || 0, use.partner.disabilityPlaning2 || 0 );
    const disPool = disPerson + disPartner || 0;

    available.person.pensionPlaning1 = wealthBase - disPool - usePartner.pensionPlaning1;
    available.partner.pensionPlaning1 = wealthBase - disPool - usePerson.pensionPlaning1;
    available.person.disabilityPlaning1 = wealthBase - pensionPool - disPartner;
    available.partner.disabilityPlaning1 = wealthBase - pensionPool - disPerson;
    available.person.disabilityPlaning2 = wealthBase - pensionPool - disPartner;
    available.partner.disabilityPlaning2 = wealthBase - pensionPool - disPerson;
    available.person.leftBehindPlaning1 = wealthBase;
    available.partner.leftBehindPlaning1 = wealthBase;
    available.person.leftBehindPlaning2 = wealthBase;
    available.partner.leftBehindPlaning2 = wealthBase;
  } else {
    let { wealthBase, use } = moduleData as ModuleWealthPersonCore_Props;
    
    if(!use){
      use = {};
      apps.forEach(k => { 
        if(!use[k]) use[k] = 0; 
      });
    }

    const pension = use.pensionPlaning1 || 0;
    const dis = Math.max( use.disabilityPlaning1 || 0, use.disabilityPlaning2 || 0 );

    available.pensionPlaning1 = wealthBase - dis;
    available.disabilityPlaning1 = wealthBase - pension;
    available.disabilityPlaning2 = wealthBase - pension;
    available.leftBehindPlaning1 = wealthBase;
    available.leftBehindPlaning2 = wealthBase;
  }

  return { available: { ...available } };
};

export const moduleWealthCards: CardData_Props[] = [
  {
    name: 'card_wealth_person_1',
    classed: new CardWealthPerson()
  },
  {
    name: 'card_wealth_connection_1',
    classed: new CardWealthConnection()
  }
];
