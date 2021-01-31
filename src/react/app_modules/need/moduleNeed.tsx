import { CardNeedPension, CardNeedDisability, CardNeedLeftBehind } from './cards';
import { CardData_Props, FreeObject } from '../module.interfaces';
import { Dossier } from '../../redux/initialState';
import { ModuleBase } from '../module.helpers';
import { constantNumbers } from '../../utils/calculators';

export class ModuleNeed extends ModuleBase {
  constructor(mode?: number) {
    super();
    this.cards = moduleNeedCards;
    this.views = undefined;
    this.mode = mode || 1;
    this.process = (self: FreeObject, partner: FreeObject, connection: FreeObject, state: Dossier) =>
      this.preProcess(
        self as ModuleNeedCore_Props,
        state.myPartner.active ? (partner as ModuleNeedCore_Props) : undefined,
        undefined,
        ModuleNeedCore,
        state
      );
  }
  cards: CardData_Props[];
  views: undefined;
  mode: number;
  process: (self: FreeObject, partner: FreeObject, connection: FreeObject, state: Dossier) => any;
}

export interface ModuleNeedCore_Props {
  retirementNeed: number;
  retirementStart: number;
  disabilityNeed: number;
  leftBehindNeed: number;
}

export interface ModuleNeedResult_Props {
  retirementNeed: number;
  retirementStart: number;
  disabilityNeed: number;
  disabilityEnd: number;
  leftBehindNeed: number;
  leftBehindEnd: number;
}

export const ModuleNeedCore = (data: ModuleNeedCore_Props | undefined, mode: number, person: any) => {
  if (!data) return {};
  const pre = person && person.result.need ? { ...person.result.need } : {};
  let result = {};

  if (mode === 1) {
    const { retirementNeed, retirementStart } = data;

    result = {
      retirementNeed: retirementNeed > 0 ? retirementNeed : 0,
      retirementStart: retirementStart
    };
  } else if (mode === 2) {
    const { disabilityNeed } = data;

    result = {
      disabilityNeed: disabilityNeed > 0 ? disabilityNeed : 0,
      disabilityEnd: constantNumbers.defaultPension[person.gender[0] - 1] || 0
    };
  } else if (mode === 3) {
    const { leftBehindNeed } = data;

    result = {
      leftBehindNeed: leftBehindNeed > 0 ? leftBehindNeed : 0,
      leftBehindEnd: constantNumbers.defaultPension[person.gender[0] - 1] || 0
    };
  }
  return { ...pre, ...result };
};

export const moduleNeedCards: CardData_Props[] = [
  {
    name: 'card_need_pension_1',
    classed: new CardNeedPension()
  },
  {
    name: 'card_need_disability_1',
    classed: new CardNeedDisability()
  },
  {
    name: 'card_need_leftbehind_1',
    classed: new CardNeedLeftBehind()
  }
];
