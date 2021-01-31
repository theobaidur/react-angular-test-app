import httpService from '../services/httpService';
import { config } from '../config';
import { httpActions } from '../constants/enums';
import { CancelToken } from 'axios';

interface ScanProvider {
  initDocScan: (docType: string, callback: (x: any) => void, err: (x: any) => void) => void;
  getDocScanResult: (key: string, callback: (x: any) => void, err: (x: any) => void) => void;
  updateDocScan: (
    formData: FormData,
    callback: (x: any) => void,
    err: (x: any) => void,
    cancelToken?: CancelToken
  ) => void;
  scanPhotosOrPDFs: (
    templateName: string | undefined,
    formData: FormData,
    callback: (x: any) => void,
    err: (x: any) => void,
    cancelToken?: CancelToken
  ) => void;
  sendScanLinkByMail: (formData: FormData, callback: (x: any) => void, err: (x: any) => void) => void;
  checkDocScan: (key: string, callback: (x: any) => void, err: (x: any) => void) => void;
}

const scanProvider: ScanProvider = {
  initDocScan: (docType: string, callback: (x: any) => void, err: (x: any) => void) => {
    // httpService.get(
    //   config.monetoApiUrl,
    //   {
    //     action: httpActions.INIT_DOCSCAN,
    //     docType: docType
    //   },
    //   callback,
    //   err
    // );
    callback(false);
  },
  getDocScanResult: (key: string, callback: (x: any) => void, err: (x: any) => void) => {
    return httpService.get(
      config.monetoApiUrl,
      {
        action: httpActions.GET_DOCSCAN_RESULT,
        key: key
      },
      callback,
      err
    );
  },
  updateDocScan: (formData: FormData, callback: (x: any) => void, err: (x: any) => void, cancelToken?: CancelToken) => {
    httpService.post(config.monetoApiUrl, formData, callback, err, cancelToken);
  },
  scanPhotosOrPDFs: (
    templateName: string | undefined,
    formData: FormData,
    callback: (x: any) => void,
    err: (x: any) => void,
    cancelToken?: CancelToken
  ) => {
    let url: string = config.ocrProcessUrl;
    if (templateName) {
      url = `${url}?templateName=${templateName}`;
    }
    httpService.post(url, formData, callback, err, cancelToken);
  },
  sendScanLinkByMail: (formData: FormData, callback: (x: any) => void, err: (x: any) => void) => {
    httpService.post(config.monetoApiUrl, formData, callback, err);
  },
  checkDocScan: (key: string, callback: (x: any) => void, err: (x: any) => void) => {
    httpService.get(
      config.monetoApiUrl,
      {
        action: httpActions.CHECK_DOCSCAN,
        key
      },
      callback,
      err
    );
  }
};

export default scanProvider;
