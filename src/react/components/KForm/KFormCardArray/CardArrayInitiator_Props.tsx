import { Card_Props } from "src/react/inc/module.interfaces";

export interface CardArrayInitiator_Props extends Card_Props {
  id: string;
  addCard: () => void;
  legalData: any;
}
