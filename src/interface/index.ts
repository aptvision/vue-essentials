import { IDateHelpersConfig } from "./DateHelpersInterface";
import { TRestApiOptionsOverride, ApiErrorInterface, RestApiResponseInterface, ResponseMeta } from '../core/ApiRest'
import { IAuthToken } from '../types/core/Auth'

//type JsonObject<T = unknown> = { [Key in string]: T }
// type JsonObject<T = unknown> = { [key: string]: T | JsonObject<T> | JsonObject<T>[] | TScalar | string };
type JsonObject<T = unknown> = { 
  [key: string]: T | JsonObject<T> | TScalar | TScalar[];
};

type TScalar = string|number|boolean|string[]|number[]
type NonEmptyString<T> = T extends '' ? never : T
export type {
  IDateHelpersConfig,
  TRestApiOptionsOverride,
  JsonObject,
  RestApiResponseInterface,
  ResponseMeta,
  ApiErrorInterface,
  TScalar,
  NonEmptyString,
  IAuthToken,
}