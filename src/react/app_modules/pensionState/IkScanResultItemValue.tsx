import { BoundingPoly } from './BoundingPoly';


export interface IkScanResultItemValue {
  SystemName: string;
  Value: string;
  boundingPoly: BoundingPoly;
}
