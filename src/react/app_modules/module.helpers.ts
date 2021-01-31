import { FreeObject } from './module.interfaces';
import { Dossier } from '../redux/initialState';

export class ModuleBase {
  constructor() {
    this.data = { self: undefined, partner: undefined, connection: undefined };
    this.result = { self: undefined, partner: undefined, connection: undefined };
    this.progress = {};
    this.cards = [];
    this.test = {};
    this.mode = undefined;
    this.layout = 'static';
    this.preProcess = (self: any, partner: any, connection: any, coreFunction: Function, state?: Dossier) => {
      this.data.self = self;
      this.data.partner = partner;
      this.data.connection = connection;
      this.result.self = coreFunction(this.data.self, this.mode, state && state.myPerson);
      this.result.partner = coreFunction(this.data.partner, this.mode, state && state.myPartner);
      this.result.connection = coreFunction(this.data.connection, this.mode, state && state.myConnection, true);
      return this.result;
    };
  }
  data: {
    self: FreeObject | undefined;
    partner: FreeObject | undefined;
    connection: FreeObject | undefined;
  };
  result: {
    self: FreeObject | undefined;
    partner: FreeObject | undefined;
    connection: FreeObject | undefined;
    [x: string]: any;
  };
  cards: any[];
  progress: FreeObject;
  test: FreeObject;
  mode: number | undefined;
  layout: 'static' | 'array';
  preProcess: (self: any, partner: any, connection: any, coreFunction: Function, state?: Dossier) => any;
}
