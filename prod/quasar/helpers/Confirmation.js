import { Dialog, Dark } from 'quasar';
import { useCommonHelpers } from '../../core/Common';
import '../quasar-init.js';
const { isEmpty, isObject } = useCommonHelpers();
export const useConfirmation = () => (config) => {
    if (!config.title) {
        throw new Error('Confirmation dialog title is required');
    }
    if (!config.message) {
        throw new Error('Confirmation dialog message is required');
    }
    let dialogOptions = {
        position: config.options?.position || 'standard',
        title: config.title,
        message: config.message,
        cancel: config.cancel || true,
        ok: config.ok || true,
        persistent: config.options?.persistent || true,
        dark: config.dark || Dark.isActive,
        progress: typeof config.options?.timeLimit === 'number',
        prompt: config.options?.prompt,
        html: config.html || false
    };
    const quasarOptions = { options: {} };
    if (config.options?.options && isObject(config.options.options) && !isEmpty(config.options.options)) {
        quasarOptions.options = config.options.options;
        dialogOptions = { ...dialogOptions, ...quasarOptions };
    }
    if (!Dialog.create) {
        throw new Error('Quasar Dialog plugin needs to be enabled in the quasar.conf.js file in your local project');
    }
    const dialog = Dialog.create(dialogOptions)
        .onOk(() => {
        config.onOk?.();
    }).onCancel(() => {
        config.onCancel?.();
    }).onDismiss(() => {
        config.onDismiss?.();
    });
    if (config.options?.timeLimit) {
        const timeLimit = config.options?.timeLimit;
        window.setTimeout(() => {
            dialog.update({
                progress: false
            });
        }, timeLimit * 1000);
    }
};
