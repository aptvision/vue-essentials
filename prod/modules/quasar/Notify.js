"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNotify = void 0;
const quasar_1 = require("quasar");
const useNotify = () => {
    const payloadToNotifyObj = (payload) => {
        if (!quasar_1.Notify.create) {
            throw new Error('Quasar Notify plugin needs to be enabled in the quasar.conf.js file in your local project');
        }
        const notifyObj = {};
        if (typeof payload === 'string') {
            notifyObj.message = payload;
        }
        else if (typeof payload === 'object' && payload instanceof Error) {
            if (payload.message === 'Forbidden') {
                notifyObj.message = 'You don\'t have access to this resource';
            }
            else {
                notifyObj.message = payload.message;
            }
        }
        else if (typeof payload === 'object' && payload && !Array.isArray(payload)) {
            return payload;
        }
        else {
            notifyObj.message = 'Default message';
            console.warn('Unhandled notification payload type: ', typeof payload, payload);
        }
        return notifyObj;
    };
    return {
        success(payload) {
            const notify = payloadToNotifyObj(payload);
            notify.type = 'positive';
            quasar_1.Notify.create(notify);
        },
        info(payload) {
            const notify = payloadToNotifyObj(payload);
            notify.type = 'info';
            quasar_1.Notify.create(notify);
        },
        error(payload) {
            const notify = payloadToNotifyObj(payload);
            notify.type = 'negative';
            quasar_1.Notify.create(notify);
        },
        critical(payload) {
            console.error(payload);
            const notify = payloadToNotifyObj(payload);
            notify.type = 'negative';
            quasar_1.Notify.create(notify);
        },
        log(payload) {
            if (process.env.NODE_ENV === 'development') {
                console.trace(payload);
            }
        }
    };
};
exports.useNotify = useNotify;
