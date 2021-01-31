export interface AppProvider_Props {
  appName: string;
  history: any;
}

export interface Wizard_Props {
  modules: string[];
  titles: string[];
  activeModule: string;
  setActiveModule: (activeModule: string) => void;
  validModules: { [key: string]: number };
  activeCol: 1 | 2;
  setActiveCol: (activeCol: 1 | 2) => void;
  isMobile: boolean;
  moduleType: string;
  children: any[];
  t?: any;
}

export interface Avatar_Props {
  moduleType: string;
  activeCol: 1 | 2;
  t?: any;
  isMobile: boolean;
  setActiveCol: (col: 1 | 2) => void;
}
