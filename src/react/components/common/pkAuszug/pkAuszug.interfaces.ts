import Validator from '../../../utils/validator';
import { FieldValuePair } from '../../../app_modules/module.interfaces';

export interface PkScanResult {
  date: string;
  company: string;
  incomeyear: number;
  incomeinsured: number;
  workload: number;
  credittotal: number;
  creditbvg: number;
  maxpayin: number;
  maxwef: number;
  gotwef: number;
  orphanvalue: number;
  annualIllnessWidowCheck: Array<number>;
  orphanaccident: Array<number>;
  isChildAvailable: boolean;
  dischild: number;
  dischildCheck: Array<number>;
  widowaccident: Array<number>;
  widowvalue: number;
  retirement: Array<RetirementBenefitItem>;
  disability: Array<DisibilityPensionArrayItem>;
  deathBenefit: Array<DeathBenefitArrayItem>;
  [key: string]: any;
}

interface IVertexIndex {
  vertexes?: any;
}

export interface DisibilityPensionArrayItem extends IVertexIndex {
  disvalue: number;
  diswait: number;
  disaccident: Array<number>;
}

export interface RetirementBenefitItem extends IVertexIndex {
  pensionage: number;
  pensioncapital: number;
  pensionyear: number;
}

export interface DeathBenefitArrayItem extends IVertexIndex {
  deathcapital: number;
  deathillness: Array<number>;
  deathaccident: Array<number>;
  deathmarried: Array<number>;
  deathnotmarried: Array<number>;
}

export interface GroupProps {
  setFieldValue: (name: string, value: any) => void;
  setFieldValues: (fieldValues: FieldValuePair[]) => void | undefined;
  value: PkScanResult;
  t: any;
  cardName: string | undefined;
  removeFromList?: (name: string, index: number) => void | undefined;
  addItemToList?: (name: string) => void | undefined;
  onClick?: (name: string, vertexIndex?: number, vertex?: any) => void;
  validator?: Validator;
}
export interface GroupItemProps {
  setFieldValue: (x: string, y: any) => void;
  item: RetirementBenefitItem | DisibilityPensionArrayItem | DeathBenefitArrayItem;
  index: number;
  t: any;
  cardName: string | undefined;
  onClick?: (x: string, vertexIndex?: number, vertex?: any) => void;
  removeFromList?: (x: string, y: number) => void;
  validator?: Validator;
}

export interface HighlightProps {
  leftest1: { x: number; y: number };
  topest1: { x: number; y: number };
  righest1: { x: number; y: number };
  bottomest1: { x: number; y: number };
  leftest: { x: number; y: number };
  topest: { x: number; y: number };
  righest: { x: number; y: number };
  bottomest: { x: number; y: number };
}
