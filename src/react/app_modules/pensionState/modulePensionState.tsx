import { CardPensionState } from './cards';
import { CardData_Props, ModuleView_Props, FreeObject } from '../module.interfaces';
import { Dossier } from '../../redux/initialState';
import { ViewPensionState, ViewPensionStateDisability, ViewPensionStateLeftBehind } from './views';
import { ModuleBase } from '../module.helpers';
import { ModulePensionStateCore_Props } from './ModulePensionStateCore_Props';
import { ModulePensionStateCore } from './ModulePensionStateCore';

export class ModulePensionState extends ModuleBase {
  constructor() {
    super();
    this.cards = modulePensionStateCards;
    this.views = modulePensionStateViews;
    this.process = (self: FreeObject, partner: FreeObject, connection: FreeObject, state: Dossier) =>
      this.preProcess(
        self as ModulePensionStateCore_Props,
        state.myPartner.active ? (partner as ModulePensionStateCore_Props) : undefined,
        undefined,
        ModulePensionStateCore,
        state
      );
  }
  cards: CardData_Props[];
  views: ModuleView_Props[];
  process: (self: FreeObject, partner: FreeObject, connection: FreeObject, state: Dossier) => any;
}

export const modulePensionStateCards: CardData_Props[] = [
  {
    name: 'card_pensionstate_base_1',
    classed: new CardPensionState()
  }
];

export const modulePensionStateViews: ModuleView_Props[] = [
  {
    mode: 1,
    component: ViewPensionState
  },
  {
    mode: 2,
    component: ViewPensionStateDisability
  },
  {
    mode: 3,
    component: ViewPensionStateLeftBehind
  }
];
