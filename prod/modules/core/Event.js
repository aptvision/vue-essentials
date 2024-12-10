"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEvent = void 0;
const quasar_1 = require("quasar");
let events = [];
const useEvent = () => {
    const on = (name, callback, once = false) => {
        const id = (0, quasar_1.uid)();
        events.push({
            id,
            name,
            callback,
            once
        });
        return id;
    };
    const off = (nameOrId) => {
        events = events.filter(event => ![event.id, event.name].includes(nameOrId));
    };
    const trigger = (nameOrId, payload) => {
        events.forEach(event => {
            if (![event.id, event.name].includes(nameOrId)) {
                return;
            }
            if (event.callback && typeof event.callback === 'function') {
                event.callback(payload);
            }
            if (event.once) {
                off(nameOrId);
            }
        });
    };
    return { on, off, trigger };
};
exports.useEvent = useEvent;
