import { JsonObject } from '../interface';
export declare class AuthorizationException extends Error {
}
export type TErrorHandler = (error: Error, response?: Response) => unknown;
export interface IxhrOption {
    contentType: string;
}
export interface IAptvisionApiRestConfig {
    userId: string;
    organizationId: string;
    apiUrl: string;
    token: string;
    apiVersion?: string;
    responseType: 'json' | 'blob';
    prefixRoutesWithApiVersion?: boolean;
    prefixRoutesWithOrganizationId?: boolean;
    prefixRoutesWithUserId?: boolean;
    includeOrganizationIdHeader?: boolean;
    handlerUnauthorized?: () => void;
    handlerForbidden?: () => void;
    unauthorizedHandler?: () => void;
    errorHandler?: TErrorHandler;
    xhrDefaults: IxhrOption;
    xhrOverride?: {
        get?: IxhrOption;
        post?: IxhrOption;
        put?: IxhrOption;
        patch?: IxhrOption;
        delete?: IxhrOption;
    };
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
export type ResponseMeta<T> = {
    [key: string]: T;
};
export interface RestApiResponseInterface<T = any> {
    data: T;
    meta: ResponseMeta<any>;
}
export type TRestApiOptionsOverride = Partial<Pick<IAptvisionApiRestConfig, 'apiUrl' | 'responseType' | 'prefixRoutesWithUserId' | 'prefixRoutesWithApiVersion' | 'prefixRoutesWithOrganizationId' | 'includeOrganizationIdHeader'>> & {
    abortController?: AbortController;
};
export declare const useApiRest: (config: IAptvisionApiRestConfig) => {
    get: (endpoint: string, params?: JsonObject, configOverride?: TRestApiOptionsOverride) => Promise<JsonObject>;
    post: (endpoint: string, data: JsonObject | undefined, configOverride: TRestApiOptionsOverride) => Promise<RestApiResponseInterface<any>>;
    put: (endpoint: string, data: JsonObject | undefined, id: string, configOverride: TRestApiOptionsOverride) => Promise<JsonObject>;
    patch: (endpoint: string, data: JsonObject | undefined, id: string, configOverride: TRestApiOptionsOverride) => Promise<JsonObject>;
    remove: (endpoint: string, configOverride: TRestApiOptionsOverride) => Promise<JsonObject>;
    poll: (endpoint: string, params: JsonObject, intervalSec: number, configOverride: TRestApiOptionsOverride) => void;
    pollCancel: (endpoint: string) => void;
    download: (endpoint: string, params?: JsonObject, configOverride?: TRestApiOptionsOverride) => Promise<Blob>;
};
