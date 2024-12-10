import { ApiErrorInterface, ResponseMeta } from './ApiRest';
export interface ApiDataErrorResponseInterface {
    errors: Array<ApiErrorInterface>;
    meta: ResponseMeta<unknown>;
}
export interface IErrorMessage {
    message: string;
    params: Record<string, string>;
}
interface AptErrorInterface {
    error: string | Array<ApiErrorInterface> | Error | undefined;
    meta: ResponseMeta<unknown> | undefined;
    response: Response | undefined;
    isApiError: () => boolean;
    isAbort: () => boolean;
    getMeta: () => ResponseMeta<unknown> | undefined;
    getMessages: () => Array<IErrorMessage>;
    getApiErrorMessages: () => Array<IErrorMessage>;
}
declare class AptError implements AptErrorInterface {
    error: string | Array<ApiErrorInterface> | Error | undefined;
    meta: ResponseMeta<unknown> | undefined;
    response: Response | undefined;
    constructor(error: string | ApiDataErrorResponseInterface | Error, response?: Response);
    isApiError(): boolean;
    isAbort(): boolean;
    getMeta(): ResponseMeta<unknown> | undefined;
    getMessages(): IErrorMessage[];
    getRawError(): string | Error | ApiErrorInterface[] | undefined;
    getApiErrors(): ApiErrorInterface[];
    getApiErrorMessages(): IErrorMessage[];
}
export default AptError;
