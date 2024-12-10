import { uid } from 'quasar';
let events = [];
export const useEvent = () => {
    const on = (name, callback, once = false) => {
        const id = uid();
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
