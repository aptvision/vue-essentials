import { IDateHelpersConfig } from "./DateHelpersInterface";
import { TRestApiOptionsOverride } from '../core/AptvisionApiRest';
type JsonObject<T = unknown> = {
    [Key in string]?: T;
};
type ResponseMeta<T> = {
    [key: string]: T;
};
interface RestApiResponseInterface<T = any> {
    data: T;
    meta: ResponseMeta<any>;
}
export type { IDateHelpersConfig, TRestApiOptionsOverride, JsonObject, RestApiResponseInterface };
