"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConfirmation = void 0;
const quasar_1 = require("quasar");
const Common_1 = require("../core/Common");
const { isEmpty, isObject } = (0, Common_1.useCommonHelpers)();
const useConfirmation = () => (config) => {
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
        persistent: config.options?.persistent || true,
        dark: config.dark || quasar_1.Dark.isActive,
        progress: typeof config.options?.timeLimit === 'number',
        prompt: config.options?.prompt
    };
    const quasarOptions = { options: {} };
    if (config.options?.options && isObject(config.options.options) && !isEmpty(config.options.options)) {
        quasarOptions.options = config.options.options;
        dialogOptions = { ...dialogOptions, ...quasarOptions };
    }
    if (!quasar_1.Dialog.create) {
        throw new Error('Quasar Dialog plugin needs to be enabled in the quasar.conf.js file in your local project');
    }
    const dialog = quasar_1.Dialog.create(dialogOptions)
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
exports.useConfirmation = useConfirmation;
