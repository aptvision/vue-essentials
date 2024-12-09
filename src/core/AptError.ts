import { ApiErrorInterface, ResponseMeta } from './ApiRest'

export interface ApiDataErrorResponseInterface {
  errors: Array<ApiErrorInterface>;
  meta: ResponseMeta<unknown>;
}

export interface IErrorMessage {
  message: string;
  params: Record<string, string>
}

interface AptErrorInterface {
  error: string|Array<ApiErrorInterface>|Error|undefined;
  meta: ResponseMeta<unknown> | undefined;
  response: Response|undefined;
  isApiError: () => boolean;
  isAbort: () => boolean;
  getMeta: () => ResponseMeta<unknown> | undefined;
  getMessages: () => Array<IErrorMessage>;
  getApiErrorMessages: () => Array<IErrorMessage>;
}

class AptError implements AptErrorInterface {
  error: string|Array<ApiErrorInterface>|Error|undefined
  meta: ResponseMeta<unknown> | undefined
  response: Response|undefined
  constructor (error: string|ApiDataErrorResponseInterface|Error, response?: Response) {
    this.response = response
    if (error instanceof Error) {
      this.error = error
    } else if (error && typeof error === 'object' && !Array.isArray(error) && error.errors && error.meta) {
      this.error = error.errors
      this.meta = error.meta
    } else if (typeof error === 'string') {
      this.error = error
    }
  }

  public isApiError () {
    return !!(this.meta)
  }

  public isAbort () {
    return !!(this.error && typeof this.error === 'object' && !Array.isArray(this.error) && this.error.name === 'AbortError')
  }

  public getMeta () {
    return this.meta
  }

  public getMessages () {
    const messages = [] as Array<IErrorMessage>
    if (typeof this.error === 'string') {
      messages.push({ message: this.error } as IErrorMessage)
    } else if (this.error instanceof Error) {
      switch (this.error.name) {
        case 'SyntaxError':
        case 'TypeError':
          messages.push({ message: 'Unexpected error, please contact the admin' } as IErrorMessage)
          break
        default:
          messages.push({ message: this.error.message } as IErrorMessage)
      }
    } else if (this.error && this.isApiError() && Array.isArray(this.error)) {
      messages.push(...this.getApiErrorMessages())
    }
    return messages
  }

  public getRawError () {
    return this.error
  }

  public getApiErrors (): ApiErrorInterface[] {
    if (Array.isArray(this.error)) {
      return this.error
    }
    return []
  }

  public getApiErrorMessages () {
    const messages = [] as IErrorMessage[]
    if (this.isApiError() && this.error && Array.isArray(this.error)) {
      this.error.forEach(error => {
        const message = {
          message: error.template,
          params: error.params
        } as IErrorMessage
        if (error.type === 'NOTICE' && !messages.includes(message)) {
          messages.push(message)
        }
      })
    }
    return messages
  }
}

export default AptError
