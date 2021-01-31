import { CardFinancesIncome } from './cards';
import { CardData_Props, FreeObject } from '../module.interfaces';
import { Dossier } from '../../redux/initialState';
import { ModuleBase } from '../module.helpers';

export class ModuleFinances extends ModuleBase {
  constructor() {
    super();
    this.cards = moduleFinancesCards;
    this.views = undefined;
    this.process = (self: FreeObject, partner: FreeObject, connection: FreeObject, state: Dossier) =>
      this.preProcess(
        self as ModuleFinancesCore_Props,
        state.myPartner.active ? (partner as ModuleFinancesCore_Props) : undefined,
        undefined,
        ModuleFinancesCore
      );
  }
  cards: CardData_Props[];
  views: undefined;
  process: (self: FreeObject, partner: FreeObject, connection: FreeObject, state: Dossier) => any;
}

export interface ModuleFinancesCore_Props {
  incomeType: number[];
  incomeValue: number;
  incomeCycle: number[];
  incomeCycleOther: number;
  incomeWorkload: number;
  incomeHours: number;
  incomeHoursCycle: number[];
}

export interface ModuleFinancesResult_Props {
  incomeMonth: number;
  incomeYear: number;
}

export const ModuleFinancesCore = (props: ModuleFinancesCore_Props | undefined) => {
  if (!props) return undefined;

  const { incomeType, incomeValue, incomeCycle, incomeCycleOther, incomeHours, incomeHoursCycle } = props;

  if (!incomeType) return undefined;

  let result: ModuleFinancesResult_Props = {
    incomeMonth: 0,
    incomeYear: 0
  };

  if (incomeType.indexOf(1) > -1 && incomeCycle && incomeCycle.length > 0) {
    const val = incomeValue * (incomeCycle[0] === 99 ? incomeCycleOther : incomeCycle[0]);
    result.incomeMonth = Math.round(val / 12);
    result.incomeYear = val;
  } else if (incomeType.indexOf(2) > -1 && incomeHours && incomeHoursCycle && incomeHoursCycle.length > 0) {
    const val = incomeValue * incomeHours * incomeHoursCycle[0];
    result.incomeMonth = Math.round(val / 12);
    result.incomeYear = val;
  } else if (incomeType.indexOf(3) > -1) {
    result.incomeMonth = 0;
    result.incomeYear = 0;
  }

  return result;
};

export const moduleFinancesCards: CardData_Props[] = [
  {
    name: 'card_finances_income_1',
    classed: new CardFinancesIncome()
  }
];
