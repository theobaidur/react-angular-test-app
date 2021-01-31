export interface WebcamIn {
  current: {};
  context: {};
  props: {};
  refs: {};
  stream: MediaStream;
  getScreenshot: Function;
}

export interface ScanProps {
  templateInfo: ITemplateInfo;
  listScans: Array<any>;
  setListScans: Function;
}
export interface IPreviewData {
  image: string | null;
  isProcessing: boolean;
  isPreviewing: boolean;
}

export interface IDocScan {
  progress?: boolean;
  action?: string;
  success?: boolean;
  error?: string;
  docType?: string;
}

export interface ITemplateInfo {
  RequiresLandscapeImage: boolean;
}
