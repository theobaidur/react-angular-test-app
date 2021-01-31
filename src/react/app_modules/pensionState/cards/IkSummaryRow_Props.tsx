import Validator from '../../../utils/validator';
import { IkSummaryItem } from '../IkSummaryItem';

export interface IkSummaryRow_Props {
  item: IkSummaryItem;
  index: number;
  removeItemFromList: (name: string, index: number, pageIndex?: number) => void;
  updateListItem: (name: string, value: any) => void;
  t: any;
  cardName?: string;
  onClick?: (name: string) => void;
  isIncomeCodeVisible?: boolean | undefined;
  pageIndex?: number;
  validator?: Validator;
}
