import { IDateHelpersConfig } from "./DateHelpersInterface";
import { TRestApiOptionsOverride } from '../core/AptvisionApiRest'

type JsonObject<T = unknown> = { [Key in string]?: T }
type ResponseMeta<T> = {[key: string]: T }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface RestApiResponseInterface<T = any> {
    data: T;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meta: ResponseMeta<any>;
}
export type{
    IDateHelpersConfig,
    TRestApiOptionsOverride,
    JsonObject,
    RestApiResponseInterface
}