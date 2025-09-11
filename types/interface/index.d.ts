import { IDateHelpersConfig } from "./DateHelpersInterface";
import { TRestApiOptionsOverride, ApiErrorInterface, RestApiResponseInterface, ResponseMeta, IRequestParamsCollection, IRequestParamsOne } from '../core/ApiRest';
import { IAuthToken } from '../core/Auth';
type JsonObject<T = unknown> = {
    [key: string]: T | JsonObject<T> | TScalar | TScalar[];
};
type TScalar = string | number | boolean | string[] | number[];
type NonEmptyString<T> = T extends '' ? never : T;
export type { IDateHelpersConfig, TRestApiOptionsOverride, JsonObject, RestApiResponseInterface, ResponseMeta, ApiErrorInterface, TScalar, NonEmptyString, IAuthToken, IRequestParamsOne, IRequestParamsCollection, };
