import { JsonObject } from '../interface'
export class AuthorizationException extends Error {}
export type TErrorHandler = (error: Error, response?: Response) => unknown
export interface IxhrOption {
  contentType: string
}
export interface IAptvisionApiRestConfig {
  userId: string;
  organizationId: string;
  apiUrl: string;
  token: string;
  apiVersion?: string;
  responseType: 'json'|'blob';
  prefixRoutesWithApiVersion?: boolean;
  prefixRoutesWithOrganizationId?: boolean;
  prefixRoutesWithUserId?: boolean;
  includeOrganizationIdHeader?: boolean
  handlerUnauthorized?: () => void;
  handlerForbidden?: () => void;
  errorHandler?: TErrorHandler;
  xhrDefaults: IxhrOption
  xhrOverride?: {
    get?: IxhrOption
    post?: IxhrOption
    put?: IxhrOption
    patch?: IxhrOption
    delete?: IxhrOption
  }
}
export interface ApiErrorInterface {
  status: number;
  code: string;
  title: string;
  template: string;
  type: 'ERROR' | 'NOTICE';
  params: JsonObject<string>;
  meta: ResponseMeta<unknown>;
}
export type ResponseMeta<T> = {[key: string]: T }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface RestApiResponseInterface<T = any> {
  data: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta: ResponseMeta<any>;
}
export type TRestApiOptionsOverride = Partial<Pick<IAptvisionApiRestConfig,
  'apiUrl'|
  'responseType'|
  'prefixRoutesWithUserId'|
  'prefixRoutesWithApiVersion'|
  'prefixRoutesWithOrganizationId'|
  'includeOrganizationIdHeader'
>>&{
  abortController?: AbortController
}
const pollTimeouts: { [index: string]: ReturnType<typeof setTimeout> } = {}
export const useApiRest = (config: IAptvisionApiRestConfig) => {
  const apiUrl = config.apiUrl.trim().replace(/\/+$/, '')
  //@ts-expect-error type
  function is(className, object) {
    return Object.prototype.toString.call(object) === '[object '+ className +']';
  }
  const DataEncoder = function() {
    //@ts-expect-error type
    this.levels = [];
    //@ts-expect-error type
    this.actualKey = null;
  }
  //@ts-expect-error type
  DataEncoder.prototype.__dataEncoding = function(data) {
    let uriPart = '';
    const levelsSize = this.levels.length;
    if (levelsSize) {
      uriPart = this.levels[0];
      for(let c = 1; c < levelsSize; c++) {
        uriPart += '[' + this.levels[c] + ']';
      }
    }
    let finalString = '';
    if (is('Object', data)) {
      const keys = Object.keys(data);
      const l = keys.length;
      for(let a = 0; a < l; a++) {
        const key = keys[a];
        const value = data[key];
        this.actualKey = key;
        this.levels.push(this.actualKey);
        finalString += this.__dataEncoding(value);
      }
    } else if (is('Array', data)) {
      if (!this.actualKey) throw new Error("Directly passed array does not work")
      const aSize = data.length;
      for (let b = 0; b < aSize; b++) {
        const aVal = data[b];
        this.levels.push(b);
        finalString += this.__dataEncoding(aVal);
      }
    } else {
      finalString += uriPart + '=' + encodeURIComponent(data) + '&';
    }
    this.levels.pop();
    return finalString;
  }
  //@ts-expect-error type
  DataEncoder.prototype.encode = function(data) {
    if (!is('Object', data) || !Object.keys(data).length) return null;
    return this.__dataEncoding(data).slice(0, -1);
  }
  const toUrlEncoded = (params: JsonObject): string => {
    //@ts-expect-error type
    const encoder = new DataEncoder();
    return encoder.encode(params);
  }
  const getHeaders = (configOverride: TRestApiOptionsOverride = {}) => {
    const conf = Object.assign({}, config, configOverride || {})
    if (!conf.token) {
      throw new AuthorizationException('Failed restoring local token')
    }
    const headers: {Authorization: string; [key: string]: string} = { 
      Authorization: 'Bearer ' + conf.token 
    }
    if(conf.includeOrganizationIdHeader){
      if(!conf.organizationId){
        throw Error('Missing organizationId')
      }
      headers['x-organization-id'] = conf.organizationId
    }
    return headers
  }
  const handleResponse = async (response: Response, configOverride?: TRestApiOptionsOverride): Promise<JsonObject> => {
    const conf = Object.assign({}, config, configOverride || {})
    if (response.status === 401) {
      if (conf.handlerUnauthorized) {
        conf.handlerUnauthorized()
      }
      throw new AuthorizationException('401 - unauthorized')
    }
    if (response.status === 403) {
      if (conf.handlerForbidden) {
        conf.handlerForbidden()
      }
      throw new AuthorizationException('403 - forbidden')
    }
    if (![200, 201].includes(response.status)) {
      throw new Error(response.statusText)
    }
    switch (conf.responseType) {
      // case 'blob':
      //   return response.blob()
      case 'json': {
        const json: unknown = response.json()
        if (typeof json !== 'object' || json === null) {
          throw new Error('Response is not json object')
        }
        return json as JsonObject
      }
      default:
        throw new Error('Invalid response type config')
    }
  }
  const getUrl = (endpoint: string, configOverride?: TRestApiOptionsOverride) => {
    const conf = Object.assign({}, config, configOverride || {})
    let apiUrlCopy = apiUrl
    if (conf.prefixRoutesWithApiVersion) {
      if (!conf.apiVersion) {
        throw Error('Missing apiVersion')
      }
      apiUrlCopy += '/' + conf.apiVersion
    }
    if (conf.prefixRoutesWithOrganizationId) {
      if (!conf.organizationId) {
        throw Error('Missing organizationId')
      }
      apiUrlCopy += '/organizations/' + conf.organizationId
    }
    if (conf.prefixRoutesWithUserId) {
      if (!conf.userId) {
        throw Error('Missing userId')
      }
      apiUrlCopy += '/users/' + conf.userId
    }
    return apiUrlCopy + '/' + endpoint.replace(/^\//, '')
  }
  const get = (
    endpoint: string,
    params?: JsonObject,
    configOverride?: TRestApiOptionsOverride
  ): Promise<JsonObject> => new Promise((resolve, reject) => {
    let url = getUrl(endpoint, configOverride)
    if (params && typeof params === 'object') {
      for (const key in params) {
        if (
          typeof params[key] === 'undefined' ||
          (['filterBy', 'orderBy'].includes(key) && !Object.keys(params[key] || {}).length) ||
          (key === 'groups' && Array.isArray(params[key]) && !params[key].length) ||
          (key === 'search' && params[key] === '')
        ) {
          delete params[key]
        }
      }
      const paramsEncoded = toUrlEncoded(params)
      if (paramsEncoded) {
        url += `?${paramsEncoded}`
      }
    }
    const abortController = configOverride?.abortController || new AbortController()
    let resp: Response|undefined
    fetch(url, {
      method: 'GET',
      signal: abortController.signal,
      headers: getHeaders(configOverride)
    })
      .then(response => {
        resp = response
        return handleResponse(response, configOverride)
      })
      .then(result => resolve(result))
      .catch((error: Error) => {
        reject(config.errorHandler ? config.errorHandler(error, resp) : error)
      })
  })
  const post = (endpoint: string, data: JsonObject|undefined, configOverride: TRestApiOptionsOverride) => {
    return new Promise<RestApiResponseInterface>((resolve, reject) => {
      const url = getUrl(endpoint, configOverride)
      const abortController = configOverride?.abortController || new AbortController()
      let resp: Response|undefined
      if (typeof data !== 'object') {
        data = {}
      }
      fetch(url, {
        method: 'POST',
        signal: abortController.signal,
        headers: Object.assign({ 'Content-Type': config.xhrOverride?.post?.contentType || config.xhrDefaults.contentType }, getHeaders(configOverride)),
        body: JSON.stringify(data)
      })
        .then(response => {
          resp = response
          return handleResponse(response, configOverride)
        })
        .then(result => resolve(result as unknown as RestApiResponseInterface))
        .catch((error: Error) => {
          reject(config.errorHandler ? config.errorHandler(error, resp) : error)
        })
    })
  }
  const put = (endpoint: string, data: JsonObject|undefined, id: string, configOverride: TRestApiOptionsOverride) => {
    return new Promise<JsonObject>((resolve, reject) => {
      let url = getUrl(endpoint, configOverride)
      const abortController = configOverride?.abortController || new AbortController()
      let resp: Response|undefined
      if (typeof data !== 'object') {
        data = {}
      }
      if (typeof id !== 'undefined') {
        url += '/' + id
      }
      fetch(url, {
        method: 'PUT',
        signal: abortController.signal,
        headers: Object.assign({ 'Content-Type': config.xhrOverride?.put?.contentType || config.xhrDefaults.contentType }, getHeaders(configOverride)),
        body: JSON.stringify(data)
      })
        .then(response => {
          resp = response
          return handleResponse(response, configOverride)
        })
        .then(result => resolve(result as unknown as JsonObject))
        .catch((error: Error) => {
          reject(config.errorHandler ? config.errorHandler(error, resp) : error)
        })
    })
  }
  const patch = (endpoint: string, data: JsonObject|undefined, id: string, configOverride: TRestApiOptionsOverride) => {
    return new Promise<JsonObject>((resolve, reject) => {
      let url = getUrl(endpoint, configOverride)

      const abortController = configOverride?.abortController || new AbortController()
      let resp: Response|undefined
      if (typeof data !== 'object') {
        data = {}
      }
      if (typeof id !== 'undefined') {
        url += '/' + id
      }
      fetch(url, {
        method: 'PATCH',
        signal: abortController.signal,
        headers: Object.assign({ 'Content-Type': config.xhrOverride?.patch?.contentType || config.xhrDefaults.contentType }, getHeaders(configOverride)),
        body: JSON.stringify(data)
      })
        .then(response => {
          resp = response
          return handleResponse(response, configOverride)
        })
        .then(result => resolve(result as unknown as JsonObject))
        .catch((error: Error) => {
          reject(config.errorHandler ? config.errorHandler(error, resp) : error)
        })
    })
  }
  const remove = (endpoint: string, configOverride: TRestApiOptionsOverride) => {
    return new Promise<JsonObject>((resolve, reject) => {
      const url = getUrl(endpoint, configOverride)
      const abortController = configOverride?.abortController || new AbortController()
      let resp: Response|undefined
      fetch(url, {
        method: 'DELETE',
        signal: abortController.signal,
        headers: getHeaders(configOverride)
      })
        .then(response => {
          resp = response
          return handleResponse(response, configOverride)
        })
        .then(result => resolve(result as unknown as JsonObject))
        .catch((error: Error) => {
          reject(config.errorHandler ? config.errorHandler(error, resp) : error)
        })
    })
  }
  const poll = (endpoint: string, params: JsonObject, intervalSec: number, configOverride: TRestApiOptionsOverride) => {
    // clear timeout if exists
    if (typeof pollTimeouts[endpoint] !== 'undefined') {
      clearTimeout(pollTimeouts[endpoint])
    }
    const fetchData = () => {
      return new Promise((resolve, reject) => {
        let url = getUrl(endpoint, configOverride)
        if (typeof params === 'object') {
          const paramsEncoded = toUrlEncoded(params)
          if (paramsEncoded) {
            url += `?${paramsEncoded}`
          }
        }
        const abortController = configOverride?.abortController || new AbortController()
        let resp: Response|undefined
        fetch(url, {
          method: 'GET',
          headers: getHeaders(configOverride),
          signal: abortController.signal
        })
          .then(response => {
            resp = response
            return handleResponse(response, configOverride)
          })
          .then(result => resolve(result))
          .catch((error: Error) => {
            reject(config.errorHandler ? config.errorHandler(error, resp) : error)
          })
      })
    }
    fetchData().finally(() => {
      pollTimeouts[endpoint] = setTimeout(() => {
        poll(endpoint, params, intervalSec, configOverride)
      }, (intervalSec || 120) * 1000)
    })
  }
  const pollCancel = (endpoint: string) => {
    if (typeof pollTimeouts[endpoint] !== 'undefined') {
      clearTimeout(pollTimeouts[endpoint])
    }
  }
  return {
    get,
    post,
    put,
    patch,
    remove,
    poll,
    pollCancel
  }
}