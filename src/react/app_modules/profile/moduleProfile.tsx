import { CardProfilePersonal, CardProfilePartner, CardProfileConnection } from './cards';
import { CardData_Props, FreeObject } from '../module.interfaces';
import { Dossier } from '../../redux/initialState';
import { ModuleBase } from '../module.helpers';

export class ModuleProfile extends ModuleBase {
  constructor() {
    super();
    this.cards = moduleProfileCards;
    this.views = undefined;
    this.process = (self: FreeObject, partner: FreeObject, connection: FreeObject, state: Dossier) =>
      this.preProcess(
        self as ModuleProfilePerson_Props,
        state.myPartner.active ? (partner as ModuleProfilePartner_Props) : undefined,
        state.myPartner.active ? (connection as ModuleProfileConnection_Props) : undefined,
        ModuleProfileCore
      );
  }
  cards: CardData_Props[];
  views: undefined;
  process: (self: FreeObject, partner: FreeObject, connection: FreeObject, state: Dossier) => any;
}

export interface ModuleProfilePerson_Props {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: number[];
  hasPartner: number[];
}

export interface ModuleProfilePartner_Props {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: number[];
}

export interface ModuleProfileConnection_Props {
  mode: number[];
  modeStart: string;
}

export const ModuleProfileCore = (props: any | undefined) => {
  if (!props) return undefined;
};

export const moduleProfileCards: CardData_Props[] = [
  {
    name: 'card_profile_personal_1',
    classed: new CardProfilePersonal()
  },
  {
    name: 'card_profile_partner_1',
    classed: new CardProfilePartner()
  },
  {
    name: 'card_profile_connection_1',
    classed: new CardProfileConnection(),
    connection: true
  }
];
