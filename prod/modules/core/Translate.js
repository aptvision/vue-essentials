function htmlSpecialCharsDecode(str) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = str;
    return textArea.value;
}
export const useTranslate = (localeCode, translations) => (msg, params = {}) => {
    var _a;
    const locale = localeCode;
    let outputMsg = typeof ((_a = translations[locale]) === null || _a === void 0 ? void 0 : _a[msg]) !== 'undefined' ? translations[locale][msg] : msg;
    for (const key in params) {
        outputMsg = outputMsg.replace(new RegExp('{ *' + key + ' *}', 'g'), params[key]);
    }
    return htmlSpecialCharsDecode(outputMsg);
};
