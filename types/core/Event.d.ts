import { JsonObject, TScalar } from '../interface';
export interface IEvent {
    on: (name: string, callback: (params?: any) => void) => string;
    off: (nameOrId: string, payload?: JsonObject | TScalar) => void;
    trigger: (nameOrId: string, payload?: JsonObject | TScalar) => void;
}
export declare const useEvent: () => {
    on: (name: string, callback: (payload: unknown) => void, once?: boolean) => string;
    off: (nameOrId: string) => void;
    trigger: (nameOrId: string, payload?: unknown) => void;
};
