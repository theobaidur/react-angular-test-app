declare global {
  interface Window {
    API_URL: string;
  }
}

class ConfigSingleton {
  public get monetoApiUrl(): string {
    let url = window.API_URL;
    if (!url) {
      url = `${window.location.host}/de/`;
    } else if (url === '<prod>') {
      if (/(.|\/\/)(moneto|viho).ch$/.test(window.location.host)) {
        url = 'debug.moneto.ch/de/';
      } else {
        url = 'moneto.azurewebsites.net/de/';
      }
    }
    if (url.startsWith('/')) {
      url = `${window.location.host}${url}`;
    }
    return `${window.location.protocol}//${url}`;
  }

  public get scanUrl(): string {
    return `${window.location.protocol}//${window.location.host}/scan`;
  }

  public get ocrProcessUrl(): string {
    if (
      window.location.host.indexOf('test.moneto.ch') >= 0 ||
      window.location.host.indexOf('debug.moneto.ch') >= 0 ||
      window.location.host.indexOf('azurewebsites') >= 0 ||
      window.location.host.indexOf('localhost') >= 0
    ) {
      return 'https://certisnap-test.azurewebsites.net/OCRMVP/PROCESSING';
    } else {
      return 'https://certisnap.azurewebsites.net/OCRMVP/PROCESSING';
    }
  }

  public get ocrHubUrl(): string {
    if (
      window.location.host.indexOf('test.moneto.ch') >= 0 ||
      window.location.host.indexOf('debug.moneto.ch') >= 0 ||
      window.location.host.indexOf('azurewebsites') >= 0 ||
      window.location.host.indexOf('localhost') >= 0
    ) {
      return 'https://certisnap-test.azurewebsites.net/OCRMVPIR/ProcessingHub';
    } else {
      return 'https://certisnap.azurewebsites.net/OCRMVPIR/ProcessingHub';
    }
  }

  public get postcodesUrl(): string {
    return `${window.location.protocol}//api.las.ag/de/postcode/`;
  }
}

export const config = new ConfigSingleton();
