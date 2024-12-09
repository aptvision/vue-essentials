declare module "types/DateHelpersInterface" {
    interface IUserDateFormat {
        date: string;
        dateTime: string;
        dateTimeSec: string;
        time: string;
    }
    export interface IDateHelpersConfig {
        localeCode?: string;
        $_t?: any;
        userDateFormat?: IUserDateFormat;
    }
}
declare module "core/DateHelpers" {
    import { IDateHelpersConfig } from "types/DateHelpersInterface";
    export function useDateHelpers(config?: IDateHelpersConfig): {
        format: {
            date: string;
            dateTime: string;
            dateTimeSec: string;
            time: string;
            dateISO: string;
            dateTimeISO: string;
        };
        humanDate: (dateString: string) => string;
        humanDateTime: (dateString: string | Date) => string;
        humanDateTimeSec: (dateString: string) => string;
        isDifferenceInYears: (dateString1: string | Date, dateString2: string | Date) => number;
        humanDateFromTimestamp: (dateString: number) => string;
        humanDateTimeFromTimestamp: (dateString: number) => string;
        humanDateTimeSecFromTimestamp: (dateString: number) => string;
        currentYear: () => string;
        subtractFromDate: (dateString: string | Date | boolean | null, options: Record<string, number>) => any;
        operatorOptions: import("vue").Ref<{
            value: string;
            label: string;
        }[], {
            value: string;
            label: string;
        }[] | {
            value: string;
            label: string;
        }[]>;
        isValidDate: (dateString: string) => boolean;
        doesIncludeTime: (dateString: any) => boolean;
        useTimeAgo: (dateString: string | Date | boolean | null, options: Record<string, any>) => string;
        time: (dateString: string) => string;
        currentDateSql: () => string;
    };
}
declare module "types/index" {
    import { IDateHelpersConfig } from "types/DateHelpersInterface";
    import { TRestApiOptionsOverride, ApiErrorInterface, RestApiResponseInterface, ResponseMeta } from "core/ApiRest";
    type JsonObject<T = unknown> = {
        [Key in string]?: T;
    };
    type TScalar = string | number | boolean | string[] | number[];
    type NonEmptyString<T> = T extends '' ? never : T;
    export type { IDateHelpersConfig, TRestApiOptionsOverride, JsonObject, RestApiResponseInterface, ResponseMeta, ApiErrorInterface, TScalar, NonEmptyString };
}
declare module "core/ApiRest" {
    import { JsonObject } from "types/index";
    export class AuthorizationException extends Error {
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
    export type TRestApiOptionsOverride = Partial<Pick<IAptvisionApiRestConfig, 'apiUrl' | 'responseType' | 'prefixRoutesWithUserId' | 'prefixRoutesWithApiVersion' | 'prefixRoutesWithOrganizationId'>> & {
        abortController?: AbortController;
    };
    export const useApiRest: (config: IAptvisionApiRestConfig) => {
        get: (endpoint: string, params?: JsonObject, configOverride?: TRestApiOptionsOverride) => Promise<JsonObject>;
        post: (endpoint: string, data: JsonObject | undefined, configOverride: TRestApiOptionsOverride) => Promise<RestApiResponseInterface<any>>;
        put: (endpoint: string, data: JsonObject | undefined, id: string, configOverride: TRestApiOptionsOverride) => Promise<JsonObject>;
        remove: (endpoint: string, configOverride: TRestApiOptionsOverride) => Promise<JsonObject>;
        poll: (endpoint: string, params: JsonObject, intervalSec: number, configOverride: TRestApiOptionsOverride) => void;
        pollCancel: (endpoint: string) => void;
    };
}
declare module "core/AptError" {
    import { ApiErrorInterface, ResponseMeta } from "core/ApiRest";
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
    class AptError implements AptErrorInterface {
        error: string | Array<ApiErrorInterface> | Error | undefined;
        meta: ResponseMeta<unknown> | undefined;
        response: Response | undefined;
        constructor(error: string | ApiDataErrorResponseInterface | Error, response?: Response);
        isApiError(): boolean;
        isAbort(): boolean;
        getMeta(): ResponseMeta<unknown>;
        getMessages(): IErrorMessage[];
        getRawError(): string | Error | ApiErrorInterface[];
        getApiErrors(): ApiErrorInterface[];
        getApiErrorMessages(): IErrorMessage[];
    }
    export default AptError;
}
declare module "core/Translate" {
    export const useTranslate: (localeCode: string, translations: Record<string, Record<string, string>>) => (msg: string, params?: Record<string, string>) => string;
}
declare module "index" {
    import { useDateHelpers } from "core/DateHelpers";
    import { useApiRest } from "core/ApiRest";
    import AptError from "core/AptError";
    import { useTranslate } from "core/Translate";
    export { useDateHelpers, useApiRest, AptError, useTranslate };
}
