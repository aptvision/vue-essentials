import type { QBtnProps, QDialogOptions } from 'quasar';
import { JsonObject } from '../../interface';
import '../quasar-init.js';
interface AdditionalOptionOptions {
    timeLimit?: number | undefined;
    position?: 'top' | 'right' | 'bottom' | 'left' | 'standard';
    persistent?: boolean;
    seamless?: boolean;
    prompt?: QDialogOptions['prompt'] | undefined;
    options?: QDialogOptions['options'] | undefined;
}
export interface ConfirmationConfig {
    title: string;
    message: string;
    cancel?: QBtnProps;
    ok?: QBtnProps;
    dark?: boolean;
    onOk?: (data?: unknown) => void | undefined;
    onCancel?: () => void | undefined;
    onDismiss?: () => void | undefined;
    update?: JsonObject;
    hide?: JsonObject;
    options?: AdditionalOptionOptions | undefined;
    html?: boolean;
}
export declare const useConfirmation: () => (config: ConfirmationConfig) => import("quasar").DialogChainObject;
export {};
