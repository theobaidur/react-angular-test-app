import { CardPensionPrivateLife } from './cards';
import { CardData_Props, FreeObject } from '../module.interfaces';
import { Dossier } from '../../redux/initialState';
import { ModuleBase } from '../module.helpers';

export class ModulePensionPrivate extends ModuleBase {
  constructor() {
    super();
    this.cards = modulePensionPrivateCards;
    this.views = undefined;
    this.process = (self: FreeObject, partner: FreeObject, connection: FreeObject, state: Dossier) =>
      this.preProcess(
        self as ModulePensionPrivateData,
        state.myPartner.active ? (partner as ModulePensionPrivateData) : undefined,
        undefined,
        ModulePensionPrivateCore
      );
    this.layout = 'array';
  }
  cards: CardData_Props[];
  views: undefined;
  process: (self: FreeObject, partner: FreeObject, connection: FreeObject, state: Dossier) => any;
}

export interface ModulePensionPrivateData {
  hasNoElements: number[];
  array: PensionPrivateLife_Data[]
}

export interface ModulePensionPrivateResult {
  hasNoElements: number[];
  array: PensionPrivateLife_Result[]
}

interface PensionPrivateLife{
  id:string;
  initIndex:number;
  name:string;
  type: number[];
  mainStart: Date;
  mainEnd: Date;
  hasCapital: number[];
  capitalType: number[];
  capitalOption: number[];
  capitalValue: number;
  capitalCustomDate: boolean;
  capitalStart: Date;
  capitalEnd: Date;
  hasDisability: number[];
  hasLeftBehind: number[];
};

interface PensionPrivateLife_Data extends PensionPrivateLife{
  capitalUse: number
  disability: PensionPrivateLife_Disability_Data[];
  leftBehind: PensionPrivateLife_LeftBehind_Data[];
}

interface PensionPrivateLife_Result extends PensionPrivateLife{
  capitalAvailable: number;
  disability: PensionPrivateLife_Disability_Result[];
  leftBehind: PensionPrivateLife_LeftBehind_Result[];
}

interface PensionPrivateLife_Disability{
  id: string;
  value: number;
  type: number[];
  wait: number;
  illness: number[];
  accident: number[];
  short: number[];
  shortTime: number;
  customDate: boolean;
  start: Date;
  end: Date;
}

interface PensionPrivateLife_LeftBehind{
  id: string;
  value: number;
  illness: number[];
  accident: number[];
  type: number[];
  customDate: boolean;
  start: Date;
  end: Date;
}

interface PensionPrivateLife_Disability_Data extends PensionPrivateLife_Disability{
  use: number;
}

interface PensionPrivateLife_Disability_Result extends PensionPrivateLife_Disability{
  available: number;
}

interface PensionPrivateLife_LeftBehind_Data extends PensionPrivateLife_LeftBehind{
  use: number;
}

interface PensionPrivateLife_LeftBehind_Result extends PensionPrivateLife_LeftBehind{
  available: number;
}


export const ModulePensionPrivateCore = (props: ModulePensionPrivateData | undefined) => {
  if (!props) return undefined;
  const {array, hasNoElements} = props;
  const untypedResult : any = array ? [...array] : [];
  array && array.forEach((card:any,i:number)=>{
    if(card.hasCapital && card.hasCapital[0] === 1 ){
      const val = card.capitalValue || 0;
      if(card.capitalUse === undefined) card.capitalUse = val;
      untypedResult[i].capitalAvailable = val - card.capitalUse; 
      }
    if( card.hasDisability && card.hasDisability[0] === 1 ){
      card.disability && card.disability.forEach((elem:any,j:number)=>{
        const elemVal = elem.value || 0;
        if(elem.use === undefined) elem.use = elemVal;
        untypedResult[i].disability[j].available = elemVal - elem.use;
      });
    }
    if( card.hasLeftBehind && card.hasLeftBehind[0] === 1 ){
      card.leftBehind && card.leftBehind.forEach((elem:any,j:number)=>{
        const elemVal = elem.value || 0;
        if(elem.use === undefined) elem.use = elemVal;
        untypedResult[i].leftBehind[j].available = elemVal - elem.use;
      });
    }
  });
  return { hasNoElements: hasNoElements, array: untypedResult } as ModulePensionPrivateResult;
};

export const modulePensionPrivateCards: CardData_Props[] = [
  {
    name: 'card_pensionprivate_life_1',
    classed: new CardPensionPrivateLife(),
    refObj: {} as PensionPrivateLife_Data
  }
];
