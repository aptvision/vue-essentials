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
    function ucfirst(str) {
        return String(str).charAt(0).toUpperCase() + String(str).slice(1);
    }
    const cloneDeep = (obj) => {
        return extend(true, {}, obj);
    };
    return {
        isEmpty,
        isObject,
        cloneDeep,
        ucfirst,
    };
};
