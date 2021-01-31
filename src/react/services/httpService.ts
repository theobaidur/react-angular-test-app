import axios, { AxiosInstance, AxiosRequestConfig, CancelToken } from 'axios';
import queryString from 'query-string';
import { config } from '../config';
import authService from './authService';

export const client: AxiosInstance = axios.create({
  baseURL: config.monetoApiUrl
});

const request = (options: AxiosRequestConfig) => {
  const onSuccess = (response: any) => response.data;

  const onError = (error: any) => {
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else {
      console.error('Error Message:', error.message);
    }

    return Promise.reject(error);
  };
  if (authService.isLoggedIn())
    options = {
      ...options,
      url:
        options && ((options.url && options.url.indexOf(config.ocrProcessUrl) > -1) || authService.isCookiePresented())
          ? options.url
          : `${options.url}${
              options.url && options.url.indexOf('?') > -1 ? '&' : '?'
            }session=${authService.getSessionFromStorage()}`
    };

  return client(options)
    .then(onSuccess)
    .catch(onError);
};

const httpService = {
  get: (
    url: string,
    data: any,
    callback: (x: any) => void,
    error: (x: string) => void | undefined,
    cancelToken?: CancelToken | undefined
  ) => {
    const params = queryString.stringify(data);
    return request({
      url: `${url}${params ? `?${params}` : ''}`,
      method: 'GET',
      headers: GetAuthHeader(url),
      cancelToken: cancelToken
    })
      .then(callback)
      .catch(error);
  },
  post: (
    url: string,
    data: any,
    callback: (x: any) => void,
    error: (x: string) => void | undefined,
    cancelToken?: CancelToken
  ) => {
    return request({
      url: url,
      method: 'POST',
      data: data,
      headers: GetAuthHeader(url),
      cancelToken: cancelToken
    })
      .then(callback)
      .catch(error);
  },
  put: (
    url: string,
    data: any,
    callback: (x: any) => void,
    error: (x: string) => void | undefined,
    cancelToken?: CancelToken
  ) => {
    return request({
      url: url,
      method: 'PUT',
      data: data,
      headers: GetAuthHeader(url),
      cancelToken: cancelToken
    })
      .then(callback)
      .catch(error);
  },
  delete: (
    url: string,
    data: any,
    callback: (x: any) => void,
    error: (x: string) => void | undefined,
    cancelToken?: CancelToken
  ) => {
    const params = queryString.stringify(data);
    return request({
      url: `${url}${params ? `?${params}` : ''}`,
      method: 'DELETE',
      headers: GetAuthHeader(url),
      cancelToken: cancelToken
    })
      .then(callback)
      .catch(error);
  },
  patch: (
    url: string,
    data: any,
    callback: (x: any) => void,
    error: (x: string) => void | undefined,
    cancelToken?: CancelToken
  ) => {
    return request({
      url: url,
      method: 'PATCH',
      data: data,
      headers: GetAuthHeader(url),
      cancelToken: cancelToken
    })
      .then(callback)
      .catch(error);
  }
};

const GetAuthHeader = (url: string) => {
  if (url && url.startsWith(config.ocrProcessUrl)) {
    return { SessionId: authService.getSessionFromStorage() };
  } else return {};
};

export default httpService;
