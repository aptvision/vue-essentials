import type { QNotifyCreateOptions } from 'quasar';
import AptError from '../core/AptError';
type NotifyPayload = unknown | string | QNotifyCreateOptions | Error | AptError;
export declare const useNotify: () => {
    success(payload: NotifyPayload): void;
    info(payload: NotifyPayload): void;
    error(payload: NotifyPayload): void;
    critical(payload: NotifyPayload): void;
    log(payload: NotifyPayload): void;
};
export {};
