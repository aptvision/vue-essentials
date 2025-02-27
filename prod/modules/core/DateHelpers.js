import { ref } from 'vue';
import { format, differenceInYears, fromUnixTime, sub, isValid, parseISO, isEqual, startOfDay, formatDistance } from 'date-fns';
import { date } from 'quasar';
import { pl, hu, enGB } from 'date-fns/locale'; // INFO: hardoced-locale-codes from date fns, you can add another in future
export function useDateHelpers(config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const formatDate = ((_a = config === null || config === void 0 ? void 0 : config.userDateFormat) === null || _a === void 0 ? void 0 : _a.date) || 'YYYY/MM/DD';
    const formatDateTime = ((_b = config === null || config === void 0 ? void 0 : config.userDateFormat) === null || _b === void 0 ? void 0 : _b.dateTime) || 'YYYY/MM/DD HH:mm';
    const formatDateTimeSec = ((_c = config === null || config === void 0 ? void 0 : config.userDateFormat) === null || _c === void 0 ? void 0 : _c.dateTimeSec) || 'YYYY/MM/DD HH:mm:ss';
    const formatTime = ((_d = config === null || config === void 0 ? void 0 : config.userDateFormat) === null || _d === void 0 ? void 0 : _d.time) || 'HH:mm';
    const formatDateISO = 'YYYY-MM-DD';
    const formatDateTimeISO = 'YYYY-MM-DDTHH:mm:ss';
    const dayShortcuts = {
        pl: {
            poniedziałek: 'pon',
            wtorek: 'wt',
            środa: 'śr',
            czwartek: 'czw',
            piątek: 'pt',
            sobota: 'sob',
            niedziela: 'nd'
        },
        enGB: {
            Monday: 'Mon',
            Tuesday: 'Tue',
            Wednesday: 'Wed',
            Thursday: 'Thu',
            Friday: 'Fri',
            Saturday: 'Sat',
            Sunday: 'Sun'
        },
        hu: {
            hétfő: 'hét',
            kedd: 'kedd',
            szerda: 'sze',
            csütörtök: 'csüt',
            péntek: 'pén',
            szombat: 'szo',
            vasárnap: 'vas'
        }
    };
    const correctLocale = () => {
        const localeCode = (config === null || config === void 0 ? void 0 : config.localeCode) || 'en_GB.utf8';
        switch (localeCode) {
            case 'pl_PL.utf8':
                return { localeCode: pl, lang: 'pl' };
            case 'hu_HU.utf8':
                return { localeCode: hu, lang: 'hu' };
            case 'en_GB.utf8':
                return { localeCode: enGB, lang: 'enGB' };
            default:
                return { localeCode: enGB, lang: 'enGB' };
        }
    };
    const convertDate = (date) => {
        return new Date(date);
    };
    const currentDateSql = () => {
        return date.formatDate(new Date(), formatDateISO);
    };
    const currentYear = () => {
        return format(new Date(), 'yyyy');
    };
    const time = (dateString) => {
        return date.formatDate(new Date(dateString), formatTime);
    };
    const humanDate = (dateString) => {
        return date.formatDate(new Date(dateString), formatDate);
    };
    const humanDateTime = (dateString) => {
        return date.formatDate(new Date(dateString), formatDateTime);
    };
    const humanDateTimeSec = (dateString) => {
        return date.formatDate(new Date(dateString), formatDateTimeSec);
    };
    const humanDateFromTimestamp = (dateString) => {
        const result = fromUnixTime(dateString / 1000);
        return date.formatDate(result, formatDate);
    };
    const humanDateTimeFromTimestamp = (dateString) => {
        const result = fromUnixTime(dateString / 1000);
        return date.formatDate(result, formatDateTime);
    };
    const humanDateTimeSecFromTimestamp = (dateString) => {
        const result = fromUnixTime(dateString / 1000);
        return format(result, formatDateTimeSec);
    };
    const isDifferenceInYears = (dateString1, dateString2) => {
        return differenceInYears(convertDate(dateString1), convertDate(dateString2));
    };
    const subtractFromDate = (dateString = null, options) => {
        return sub(dateString ? dateString : new Date(), options);
    };
    const getDayAndTime = (dateString, shortCutDay = false) => {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        const localize = correctLocale();
        const result = {
            day: format(date, "EEEE", { locale: localize.localeCode }),
            time: format(date, "HH:mm")
        };
        if (shortCutDay) {
            result.day = dayShortcuts[localize.lang][result.day];
        }
        return result;
    };
    const useTimeAgo = (dateString = null, options) => {
        const currentDate = new Date();
        const baseDate = sub(dateString ? dateString : new Date(), options);
        return formatDistance(baseDate, currentDate, Object.assign({ addSuffix: true, locale: correctLocale().localeCode }, options));
    };
    const typeOptions = ref([
        { value: 'relative', label: (_f = (_e = config === null || config === void 0 ? void 0 : config.$_t) === null || _e === void 0 ? void 0 : _e.call(config, 'Relative Date')) !== null && _f !== void 0 ? _f : 'Relative Date', },
        { value: 'fixed', label: (_h = (_g = config === null || config === void 0 ? void 0 : config.$_t) === null || _g === void 0 ? void 0 : _g.call(config, 'Actual Date')) !== null && _h !== void 0 ? _h : 'Actual Date' }
    ]);
    const relativeDateOptions = ref([
        { value: 'today', label: (_k = (_j = config === null || config === void 0 ? void 0 : config.$_t) === null || _j === void 0 ? void 0 : _j.call(config, 'Today')) !== null && _k !== void 0 ? _k : 'Today' },
        { value: 'thisWeek', label: (_m = (_l = config === null || config === void 0 ? void 0 : config.$_t) === null || _l === void 0 ? void 0 : _l.call(config, 'Start of current week')) !== null && _m !== void 0 ? _m : 'Start of current week' },
        { value: 'thisMonth', label: (_p = (_o = config === null || config === void 0 ? void 0 : config.$_t) === null || _o === void 0 ? void 0 : _o.call(config, 'Start of current month')) !== null && _p !== void 0 ? _p : 'Start of current month' },
        { value: 'thisYear', label: (_r = (_q = config === null || config === void 0 ? void 0 : config.$_t) === null || _q === void 0 ? void 0 : _q.call(config, 'Start of current year')) !== null && _r !== void 0 ? _r : 'Start of current year' }
    ]);
    const operatorOptions = ref([
        { value: 'plus', label: '+' },
        { value: 'minus', label: '-' }
    ]);
    const isValidDate = (dateString) => {
        return isValid(Date.parse(dateString));
    };
    const doesIncludeTime = (dateString) => {
        const parsedDate = parseISO(dateString);
        if (isValid(parsedDate)) {
            return !isEqual(parsedDate, startOfDay(parsedDate));
        }
        return false;
    };
    return {
        format: {
            date: formatDate,
            dateTime: formatDateTime,
            dateTimeSec: formatDateTimeSec,
            time: formatTime,
            dateISO: formatDateISO,
            dateTimeISO: formatDateTimeISO
        },
        humanDate,
        humanDateTime,
        humanDateTimeSec,
        isDifferenceInYears,
        humanDateFromTimestamp,
        humanDateTimeFromTimestamp,
        humanDateTimeSecFromTimestamp,
        currentYear,
        subtractFromDate,
        operatorOptions,
        isValidDate,
        doesIncludeTime,
        useTimeAgo,
        time,
        currentDateSql,
        typeOptions,
        relativeDateOptions,
        getDayAndTime
    };
}
