import React from "react";
import { Card_Props, ValidCard_Props } from "../../../inc/module.interfaces";

export interface KFormCardArray_Props extends Card_Props {
  CardSample: React.FunctionComponent<Card_Props>;
  validCards: ValidCard_Props;
  legalData: any;
  cardName: string;
  refObj?: any;
}
