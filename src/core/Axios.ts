import { AxiosPromise, AxiosRequestConfig, AxiosResponse, ResolvedFn, RejectedFn } from "../types";
import dispatchRequest from "./dispatchRequest";
import InterceptorManager from "./InterceptorManager";
import mergeConfig from "./mergeConfig";


interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

export default class Axios {
  interceptors: Interceptors
  defaults: AxiosRequestConfig
  constructor(initConfig: AxiosRequestConfig) {
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
    this.defaults = initConfig
  }
  request(url: any, config?: AxiosRequestConfig): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) config = {}
      config.url = url
    } else {
      config = url
    }
    config = mergeConfig(this.defaults, config)
    const chain: Array<PromiseChain<any>> = [{
      resolved: dispatchRequest,
      rejected: undefined
    }]
    this.interceptors.request.forEach(inteceptor => {
      chain.unshift(inteceptor)
    })
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })
    let promise = Promise.resolve(config!)
    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }
    return promise as AxiosPromise
  }
  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }
  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }
  header(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('header', url, config)
  }
  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('options', url, data, config)
  }
  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('options', url, data, config)
  }
  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('options', url, data, config)
  }

  private _requestMethodWithoutData(method: string, url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(Object.assign({ method, url }, config || {}));
  }

  private _requestMethodWithData(method: string, url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request(Object.assign({ method, url, data }, config || {}));
  }
}