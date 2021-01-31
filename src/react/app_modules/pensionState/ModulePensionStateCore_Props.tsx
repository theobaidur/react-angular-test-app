import { IkSummaryItem } from "./IkSummaryItem";


export interface ModulePensionStateCore_Props {
  detailed: number[];
  quick: number[];
  minMedMax: number[];

  firstAge: number;
  missing: number[];
  missingYears: number;

  scanKey: string;
  ikSummaryItems: Array<IkSummaryItem>;
}
