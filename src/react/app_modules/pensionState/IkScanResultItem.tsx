import { BoundingPoly } from './BoundingPoly';
import { IkScanResultItemValue } from './IkScanResultItemValue';


export interface IkScanResultItem {
  PageIndex: number;
  KeyValue: string;
  KeyType: string | undefined;
  SystemName: string;
  boundingPoly: BoundingPoly;
  combinedBoundingPoly: BoundingPoly;
  Values: Array<IkScanResultItemValue>;
}
