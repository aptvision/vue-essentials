import { IDateHelpersConfig } from "./DateHelpersInterface";
import { TRestApiOptionsOverride, ApiErrorInterface, RestApiResponseInterface, ResponseMeta } from '../core/ApiRest'

type JsonObject<T = unknown> = { [Key in string]?: T }
type TScalar = string|number|boolean|string[]|number[]
type NonEmptyString<T> = T extends '' ? never : T
export type{
    IDateHelpersConfig,
    TRestApiOptionsOverride,
    JsonObject,
    RestApiResponseInterface,
    ResponseMeta,
    ApiErrorInterface,
    TScalar,
    NonEmptyString
}