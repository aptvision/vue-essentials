import type { QDialogOptions } from 'quasar';
import { JsonObject } from '../interface';
import './quasar-init.js';
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
    cancel?: boolean;
    dark?: boolean;
    onOk?: () => void | undefined;
    onCancel?: () => void | undefined;
    onDismiss?: () => void | undefined;
    update?: JsonObject;
    hide?: JsonObject;
    options?: AdditionalOptionOptions | undefined;
}
export declare const useConfirmation: () => (config: ConfirmationConfig) => void;
export {};
