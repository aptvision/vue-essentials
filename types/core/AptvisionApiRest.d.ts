import { JsonObject } from '../types';
import { RestApiResponseInterface } from '../types';
export declare class AuthorizationException extends Error {
}
export type TErrorHandler = (error: Error, response?: Response) => unknown;
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
    unauthorizedHandler?: () => void;
    errorHandler?: TErrorHandler;
}
export type TRestApiOptionsOverride = Pick<IAptvisionApiRestConfig, 'apiUrl' | 'responseType' | 'prefixRoutesWithUserId' | 'prefixRoutesWithApiVersion' | 'prefixRoutesWithOrganizationId'> & {
    abortController?: AbortController;
};
export declare const useAptvisionApiRest: (config: IAptvisionApiRestConfig) => {
    get: (endpoint: string, params: JsonObject, configOverride: TRestApiOptionsOverride) => Promise<Blob | JsonObject>;
    post: (endpoint: string, data: JsonObject | undefined, configOverride: TRestApiOptionsOverride) => Promise<RestApiResponseInterface<any>>;
    put: (endpoint: string, data: JsonObject | undefined, id: string, configOverride: TRestApiOptionsOverride) => Promise<JsonObject>;
    remove: (endpoint: string, configOverride: TRestApiOptionsOverride) => Promise<JsonObject>;
    poll: (endpoint: string, params: JsonObject, intervalSec: number, configOverride: TRestApiOptionsOverride) => void;
    pollCancel: (endpoint: string) => void;
};
