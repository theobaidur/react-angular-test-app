import { CardPensionWork, CardPensionWorkUVG } from './cards';
import { CardData_Props, ModuleView_Props, FreeObject } from '../module.interfaces';
import { Person } from '../../redux/types';
import { constantNumbers, getAge, getMyScaleUVG } from '../../utils/calculators';
import { Dossier } from '../../redux/initialState';
import { ViewPensionWork, ViewPensionWorkDisability, ViewPensionWorkLeftBehind } from './views';
import { ModuleBase } from '../module.helpers';
import { PkScanResult } from '../../components/common/pkAuszug/pkAuszug.interfaces';

export class ModulePensionWork extends ModuleBase {
  constructor() {
    super();
    this.cards = modulePensionWorkCards;
    this.views = modulePensionWorkViews;
    this.process = (self: FreeObject, partner: FreeObject, connection: FreeObject, state: Dossier) =>
      this.preProcess(
        self as ModulePensionWorkCore_Props,
        state.myPartner.active ? (partner as ModulePensionWorkCore_Props) : undefined,
        undefined,
        ModulePensionWorkCore,
        state
      );
  }
  cards: CardData_Props[];
  views: ModuleView_Props[];
  process: (self: FreeObject, partner: FreeObject, connection: FreeObject, state: Dossier) => any;
}

export interface ModulePensionWorkCore_Props {
  detailed: number[];
  quick: number[];
  quickYear: string;
  firstAge: number;
  isScanReady: boolean;
  scanKey: string;
  pkAuszug: PkScanResult;
  uvgDetailed: number[];
  uvgCut: number[];
  uvgContract: number[];
  uvgBranch: number[];
  uvgStart: string;
  uvgAccident: FreeObject[];
  uvgIllness: FreeObject[];
  lifePartner: number[];
}

export interface ModulePensionWorkResult_Props {
  pension: FreeObject[];
  child: number;
  disability: number;
  disabilityChild: number;
  widow: number;
  orphan: number;
  uvgDisability: number;
  uvgDisabilityChild: number;
  uvgWidow: number;
  uvgOrphan: number;
  uvgAccident: FreeObject[];
  uvgIllness: FreeObject[];
}

export function ModulePensionWorkCore(
  moduleData: ModulePensionWorkCore_Props | undefined,
  mode: number | undefined,
  person: Person | undefined
) {
  if (!moduleData || !person) return {};
  const resultBase: ModulePensionWorkResult_Props = {
    pension: [],
    child: 0,
    disability: 0,
    disabilityChild: 0,
    widow: 0,
    orphan: 0,
    uvgDisability: 0,
    uvgDisabilityChild: 0,
    uvgWidow: 0,
    uvgOrphan: 0,
    uvgAccident: [],
    uvgIllness: []
  };
  const result: ModulePensionWorkResult_Props = person.result.pensionWork
    ? Object.assign({}, person.result.pensionWork, resultBase)
    : resultBase;

  const pk = moduleData.pkAuszug;

  if (moduleData.detailed && moduleData.detailed.indexOf(1) > -1 && pk) {
    if (pk.retirement) {
      result.pension = [...pk.retirement];
    }
    result.pension.length > 0 &&
      result.pension.forEach((e) => {
        e.month = Math.round(e.pensionyear / 12);
        e.child = Math.round(e.month * constantNumbers.BVG_child);
      });
    result.disability = (pk.disability && pk.disability[0] && Math.round(pk.disability[0].disvalue / 12)) || 0;
    result.disabilityChild =
      pk.dischild && pk.dischild > 0 ? Math.round(pk.dischild / 12) : Math.round(result.disability * constantNumbers.BVG_child);
    result.widow = Math.round(pk.widowvalue / 12);
    result.orphan = Math.round(pk.orphanvalue / 12);
  } else if (moduleData.quick && moduleData.quick.indexOf(1) > -1 && moduleData.firstAge) {
    const pensionAge = constantNumbers.defaultPension[person.gender[0] - 1];
    const income = (person.result.finances && person.result.finances.incomeYear) || 0;
    const coord = constantNumbers.BVG_coord();
    const newIncome = Math.min(income - coord, constantNumbers.BVG_max());
    //const birth = dateFromString(person.birthDate);
    const start = +moduleData.firstAge || 0;

    let lastP = 0,
      base = 0;
    const levels: any[] = [],
      years: any[] = [];
    constantNumbers.BVG_lvls.forEach((e: any) => {
      const level = newIncome * (e.p - lastP),
        time = pensionAge - Math.max(start, e.f);
      levels.push(level);
      years.push(time);
      base += level * time;
      lastP = e.p;
    });

    result.disability = Math.round((base * constantNumbers.BVG_dis) / 12);
    result.disabilityChild = Math.round(result.disability * constantNumbers.BVG_child);
    result.widow = Math.round((base * constantNumbers.BVG_widow) / 12);
    result.orphan = Math.round((base * constantNumbers.BVG_orphan) / 12);

    const ages = [0, 1, 2, 3, 4, 5];
    ages.forEach((e) => {
      let interestTotal = 0;
      levels.forEach((a, i) => {
        interestTotal +=
          (a * (Math.pow(1 + constantNumbers.BVG_interest, years[i] - e) - 1)) / constantNumbers.BVG_interest;
      });
      const month = Math.round((interestTotal * (constantNumbers.BVG_dis - e * constantNumbers.BVG_offset)) / 12);
      result.pension.push({
        pensionage: pensionAge - e,
        month: month,
        child: month * constantNumbers.BVG_child
      });
    });
  }

  if (isNaN(result.disability)) result.disability = 0;
  if (isNaN(result.disabilityChild)) result.disabilityChild = 0;
  if (isNaN(result.child)) result.child = 0;
  if (isNaN(result.widow)) result.widow = 0;
  if (isNaN(result.orphan)) result.orphan = 0;

  const uvgBase = (person.result.finances && person.result.finances.incomeYear) || 0;
  result.uvgDisability = Math.round((uvgBase * constantNumbers.UVG_dis) / 12);
  result.uvgDisabilityChild = Math.round((uvgBase * constantNumbers.UVG_child) / 12);
  result.uvgWidow = Math.round((uvgBase * constantNumbers.UVG_widow) / 12);
  result.uvgOrphan = Math.round((uvgBase * constantNumbers.UVG_orphan) / 12);

  if (moduleData.uvgDetailed && moduleData.uvgDetailed.length > 0) {
    if (moduleData.uvgDetailed.indexOf(1) > -1) {
      result.uvgAccident = moduleData.uvgAccident ? [...moduleData.uvgAccident] : [];
      result.uvgIllness = moduleData.uvgIllness ? [...moduleData.uvgIllness] : [];
    } else if(moduleData.uvgDetailed.indexOf(2) > -1){
      result.uvgAccident = [{ from: 1, till: 720, percent: 80 }];
      const { uvgCut, uvgContract, uvgBranch, uvgStart } = moduleData;
      if (uvgCut && uvgCut.length > 0) {
        if (uvgCut.indexOf(2) > -1) {
          if (uvgContract && uvgContract.length > 0) {
            if (uvgContract.indexOf(2) > -1) {
              const years = getAge(uvgStart);
              const scale = getMyScaleUVG('SG', years);
              result.uvgIllness = [scale];
            } else {
              if (uvgBranch && uvgBranch.length > 0) {
                const branched = constantNumbers.UVG_branches[uvgBranch[0]];
                result.uvgIllness = [branched.ill];
              }
            }
          }
        } else {
          result.uvgIllness = [{ from: 1, till: 720, percent: 80 }];
        }
      }
    }
  }

  return result;
}

export const modulePensionWorkCards: CardData_Props[] = [
  {
    name: 'card_pensionwork_base_1',
    classed: new CardPensionWork()
  },
  {
    name: 'card_pensionwork_uvg_1',
    classed: new CardPensionWorkUVG()
  }
];

export const modulePensionWorkViews: ModuleView_Props[] = [
  {
    mode: 1,
    component: ViewPensionWork
  },
  {
    mode: 2,
    component: ViewPensionWorkDisability
  },
  {
    mode: 3,
    component: ViewPensionWorkLeftBehind
  }
];
