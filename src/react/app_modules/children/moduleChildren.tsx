import { ModuleBase } from '../../inc/module-base.class';
import { Dossier } from '../../redux/initialState';
import { CardChildrenBase, CardChildrenEx } from './cards';
import { CardData_Props, FreeObject } from '../module.interfaces';
import { ExConnection, Child } from '../../redux/types';

export class ModuleChildren extends ModuleBase {
  constructor() {
    super();
    this.cards = moduleChildrenCards;
    this.views = undefined;
    this.process = (self: FreeObject, partner: FreeObject, connection: FreeObject, state: Dossier) =>
      this.preProcess(
        self as ModuleChildrenPersonCore_Props,
        state.myPartner.active ? (partner as ModuleChildrenPersonCore_Props) : undefined,
        state.myPartner.active ? (connection as ModuleChildrenConnectionCore_Props) : undefined,
        ModuleChildrenCore,
        state
      );
  }
  cards: CardData_Props[];
  views: undefined;
  process: (self: FreeObject, partner: FreeObject, connection: FreeObject, state: Dossier) => any;
}

export interface ModuleChildrenPersonCore_Props {
  hasEx: number[];
  exes: ExConnection[];
}
export interface ModuleChildrenConnectionCore_Props {
  haveChildren: number[];
  children: Child[];
}

export interface ModuleChildrenPersonResult_Props {}
export interface ModuleChildrenConnectionResult_Props {}

export const ModuleChildrenCore = (
  props: ModuleChildrenPersonCore_Props | ModuleChildrenConnectionCore_Props | undefined
) => {
  if (!props) return {};
};

export const moduleChildrenCards: CardData_Props[] = [
  {
    name: 'card_children_base_1',
    classed: new CardChildrenBase(),
    connection: true
  },
  {
    name: 'card_children_ex_1',
    classed: new CardChildrenEx()
  }
];
