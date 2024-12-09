"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTranslate = void 0;
function htmlSpecialCharsDecode(str) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = str;
    return textArea.value;
}
const useTranslate = (localeCode, translations) => (msg, params = {}) => {
    const locale = localeCode;
    let outputMsg = typeof translations[locale]?.[msg] !== 'undefined' ? translations[locale][msg] : msg;
    for (const key in params) {
        outputMsg = outputMsg.replace(new RegExp('{ *' + key + ' *}', 'g'), params[key]);
    }
    return htmlSpecialCharsDecode(outputMsg);
};
exports.useTranslate = useTranslate;
