import { FunctionComponent } from 'react';
import { ModuleProfile, ModuleFinances, ModulePensionState, ModuleWealth, ModuleChildren, ModulePensionWork, ModulePensionPrivate } from '../app_modules';
import i18next from 'i18next';

export interface FreeObject {
  [key: string]: any;
}

export interface ModuleProvider_Props extends ModuleProviderBase_Props, ModuleProviderApp_Props {}

export interface ModuleProviderBase_Props {
  moduleName: string;
  moduleType?: string;
  moduleCore?: ModulePensionWork | ModuleChildren | ModuleFinances | ModulePensionState | ModuleProfile | ModuleWealth | ModulePensionPrivate;
  mode?: number;
  alternate?: number;
  cardFilter?: CardFilter_Props[];
}

export interface ModuleProviderApp_Props {
  toggleHelp: (id: string) => void;
  validateModule: (name: string, valid: number) => void;
  validState: number;
  activeCol: 1 | 2;
}

export interface ModuleHelp_Props {
  isOpen: boolean;
  activeHelp: string;
  toggleHelp: (id: string) => void;
  activeModule: string;
  history: any;
}

export interface ModuleCol_Props {
  name: string;
  target: string;
  colNumber: number;
  activeCol: 1 | 2;
  partner: boolean;
  children?: (JSX.Element | undefined) | (JSX.Element | undefined)[];
  isExtended?: boolean;
}

export interface ModuleView_Props {
  mode: number;
  component: FunctionComponent<{ result: any }>;
}

export interface CardData_Props {
  name: string;
  component?: FunctionComponent<Card_Props>;
  classed?: any;
  refObj?: any;
  filter?: any[];
  connection?: boolean;
}

export interface CardFilter_Props {
  person: string;
  name: string;
  content: CardData_Props[];
  isHidden?: boolean;
  isExtended?: boolean;
}

export interface Card_Props {
  id: string | undefined;
  cardName: string | undefined;
  legalData: { [key: string]: any } | undefined;
  target?: string | undefined;
  disabled?: boolean | undefined;
  isCardValid?: boolean | undefined;
  validateCard: (name: string, valid: boolean) => void;
  cardNumber: number;
  position: 'left' | 'right';
  t: any;
  setFieldValue: (name: string, value: any) => void | undefined;
  setFieldValues: (fieldValues: FieldValuePair[]) => void | undefined;
  toggleHelp: (id: string) => void;
  handleApprove?: Function | undefined;
  validate?: (legalData: any, mode?: number, state?: any) => ProgressResult_Props;
  customParams?:any;
  mode?:number;
}

export interface ValidCard_Props {
  [key:string] : boolean;
}

export interface EmptyCard_Props {
  t: i18next.TFunction;
  data?: any;
  mode?: number;
}

export interface ProgressResult_Props {
  done: boolean;
  invalid: number;
  total: number;
}

export interface FieldValuePair {
  name: string;
  value: any;
}
