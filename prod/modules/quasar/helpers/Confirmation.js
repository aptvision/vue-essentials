import { Dialog, Dark } from 'quasar';
import { useCommonHelpers } from '../../core/Common';
import '../quasar-init.js';
const { isEmpty, isObject } = useCommonHelpers();
export const useConfirmation = () => (config) => {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!config.title) {
        throw new Error('Confirmation dialog title is required');
    }
    if (!config.message) {
        throw new Error('Confirmation dialog message is required');
    }
    let dialogOptions = {
        position: ((_a = config.options) === null || _a === void 0 ? void 0 : _a.position) || 'standard',
        title: config.title,
        message: config.message,
        cancel: config.cancel || true,
        ok: config.ok || true,
        persistent: ((_b = config.options) === null || _b === void 0 ? void 0 : _b.persistent) || true,
        dark: config.dark || Dark.isActive,
        progress: typeof ((_c = config.options) === null || _c === void 0 ? void 0 : _c.timeLimit) === 'number',
        prompt: (_d = config.options) === null || _d === void 0 ? void 0 : _d.prompt,
        html: config.html || false
    };
    const quasarOptions = { options: {} };
    if (((_e = config.options) === null || _e === void 0 ? void 0 : _e.options) && isObject(config.options.options) && !isEmpty(config.options.options)) {
        quasarOptions.options = config.options.options;
        dialogOptions = Object.assign(Object.assign({}, dialogOptions), quasarOptions);
    }
    if (!Dialog.create) {
        throw new Error('Quasar Dialog plugin needs to be enabled in the quasar.conf.js file in your local project');
    }
    const dialog = Dialog.create(dialogOptions)
        .onOk(() => {
        var _a;
        (_a = config.onOk) === null || _a === void 0 ? void 0 : _a.call(config);
    }).onCancel(() => {
        var _a;
        (_a = config.onCancel) === null || _a === void 0 ? void 0 : _a.call(config);
    }).onDismiss(() => {
        var _a;
        (_a = config.onDismiss) === null || _a === void 0 ? void 0 : _a.call(config);
    });
    if ((_f = config.options) === null || _f === void 0 ? void 0 : _f.timeLimit) {
        const timeLimit = (_g = config.options) === null || _g === void 0 ? void 0 : _g.timeLimit;
        window.setTimeout(() => {
            dialog.update({
                progress: false
            });
        }, timeLimit * 1000);
    }
};
