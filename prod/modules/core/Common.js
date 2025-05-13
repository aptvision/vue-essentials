import { extend } from 'quasar';
export const useCommonHelpers = () => {
    const isEmpty = (object) => {
        for (const i in object) {
            return false;
        }
        return true;
    };
    const isObject = (value) => {
        return typeof value === 'object' && value && !Array.isArray(value);
    };
    const cloneDeep = (obj) => {
        return extend(true, {}, obj);
    };
    return {
        isEmpty,
        isObject,
        cloneDeep
    };
};
