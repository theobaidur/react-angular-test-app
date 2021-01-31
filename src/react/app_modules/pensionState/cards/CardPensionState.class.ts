import React from 'react';
import { Card_Props, ProgressResult_Props } from '../../../inc/module.interfaces';
import { CardComponent } from './cardPensionState';


export default class CardPensionState {
  constructor() {
    this.name = '';
    this.card = CardComponent;
    this.validate = (legalData: any) => {
      let result: ProgressResult_Props = { done: false, invalid: 0, total: 0 };
      if (!legalData)
        return result;
      result.total = 1;
      if (legalData.detailed) {
        if (legalData.detailed.length < 1)
          result.invalid++;
        if (legalData.detailed.indexOf(2) > -1) {
          legalData.isScanReady = false;
          legalData.mainType = '';
          legalData.ikSummaryItems = [];
          result.total += 1;
          if (legalData.quick) {
            if (legalData.quick.length < 1)
              result.invalid++;
            if (legalData.quick.indexOf(1) > -1) {
              result.total += 2;
              if (!legalData.firstAge)
                result.invalid++;
              if (legalData.missing) {
                if (legalData.missing.length < 1)
                  result.invalid++;
                if (legalData.missing.indexOf(1) > -1) {
                  result.total += 1;
                  if (!legalData.missingYears)
                    result.invalid++;
                } else {
                  legalData.missingYears = '';
                }
              } else {
                result.invalid++;
              }
            }
            if (legalData.quick.indexOf(2) > -1) {
              legalData.missing = [];
              legalData.firstAge = '';
              legalData.missingYears = '';
              result.total += 1;
              if (!legalData.minMedMax || legalData.minMedMax.length < 1)
                result.invalid++;
            }
          } else {
            result.invalid++;
          }
        }
        if (legalData.detailed.indexOf(1) > -1) {
          legalData.quick = [];
          legalData.missing = [];
          legalData.missingYears = '';
          legalData.minMedMax = [];
          result.total += 1;
          if (legalData.ikSummaryItems && legalData.ikSummaryItems.length) {
            legalData.ikSummaryItems.forEach((e: any) => {
              result.total += 2;
              if (!e.year)
                result.invalid++;
              if (!e.income && e.income !== 0)
                result.invalid++;
            });
          } else {
            result.invalid++;
          }
        }
      } else {
        result.invalid++;
      }
      result.done = result.invalid === 0;
      return result;
    };
  }
  name: string;
  card: React.FC<Card_Props>;
  validate: (legalData: any) => ProgressResult_Props;
}
