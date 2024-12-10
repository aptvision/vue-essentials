"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCommonHelpers = void 0;
const quasar_1 = require("quasar");
const useCommonHelpers = () => {
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
        return (0, quasar_1.extend)(true, {}, obj);
    };
    return {
        isEmpty,
        isObject,
        cloneDeep
    };
};
exports.useCommonHelpers = useCommonHelpers;
