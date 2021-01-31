import * as signalR from '@microsoft/signalr';

export interface SignalRService {
  connect: (
    url: string,
    successCallback: () => void,
    errorCallback: (x: any) => void,
    updateProgressCallback: (progress: string) => void,
    ocrProcessingCancelCallback?: (scanKey: string) => void,
    ocrScanPageOpen?: (scanKey: string) => void
  ) => signalR.HubConnection;
  disconnect: (connection: signalR.HubConnection | undefined) => void;
}

const signalRService: SignalRService = {
  connect: (
    url,
    successCallback,
    errorCallback,
    updateProgressCallback,
    ocrProcessingCancelCallback,
    ocrScanPageOpen
  ) => {
    let connection: signalR.HubConnection = new signalR.HubConnectionBuilder().withUrl(url).build();
    console.log('connection:', connection);

    connection.on('updateProgress', (progress: string) => {
      if (updateProgressCallback) {
        updateProgressCallback(progress);
      }
    });

    connection.on('ocrProcessingCancel', (scanKey: string) => {
      if (ocrProcessingCancelCallback) {
        ocrProcessingCancelCallback(scanKey);
      }
    });

    connection.on('ocrScanPageOpen', (scanKey: string) => {
      if (ocrScanPageOpen) {
        ocrScanPageOpen(scanKey);
      }
    });

    connection
      .start()
      .then(() => {
        if (successCallback) {
          successCallback();
        }
      })
      .catch((err) => {
        if (errorCallback) {
          errorCallback(err);
        }
      });

    return connection;
  },
  disconnect: (connection) => {
    if (connection && connection.state === 'Connected') {
      connection.send('ocrProcessingCancel').finally(() => {
        connection && connection.stop();
      });
    } else if ((connection && connection.state === 'Connecting') || (connection && connection.state === 'Reconnecting')) {
      connection.stop();
    }
  }
};

export default signalRService;
