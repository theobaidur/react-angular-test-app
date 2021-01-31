import { IkSummaryItem } from "../../../app_modules/pensionState/IkSummaryItem";

export interface IKAuszugComponent_Props {
  response: any;
  getData?: any;
  onCancel?: (x: any) => void | undefined;
  onBackToScan?: (x: any) => void | undefined;
  cardName?: string | undefined;
  acceptData: (x: Array<IkSummaryItem>) => void;
  onSave?: (res: any) => void;
}
