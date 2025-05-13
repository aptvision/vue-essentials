import { ref } from 'vue';
import { format, differenceInYears, fromUnixTime, sub, isValid, parseISO, isEqual, startOfDay, formatDistance, parse, add } from 'date-fns';
import { pl, hu, enGB } from 'date-fns/locale'; // INFO: hardoced-locale-codes from date fns, you can add another in future
export function useDateHelpers(config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const dateOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };
    const dateTimeOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    const dateTimeSecOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    const convertLocalCode = () => {
        const localeCode = config === null || config === void 0 ? void 0 : config.localeCode;
        if (!localeCode) {
            throw new Error('Missing locale code');
        }
        const dotPos = localeCode.indexOf('.');
        const base = dotPos === -1
            ? localeCode
            : localeCode.substring(0, dotPos);
        return base.replaceAll('_', '-');
    };
    const getDatePattern = () => {
        const localeCode = convertLocalCode();
        const sampleDate = new Date(2025, 12, 31, 15, 30); // default date for pattern with time
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        const dtf = new Intl.DateTimeFormat(localeCode, options);
        const tokenMap = { year: 'yyyy', month: 'MM', day: 'dd' };
        return dtf.formatToParts(sampleDate)
            .map(part => part.type === 'literal'
            ? part.value
            : tokenMap[part.type])
            .join('');
    };
    const getDateTimePattern = () => {
        const localeCode = convertLocalCode();
        const sampleDate = new Date(2025, 12, 31, 15, 30); // default date for pattern with time
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        const dtf = new Intl.DateTimeFormat(localeCode, options);
        const tokenMap = { year: 'yyyy', month: 'MM', day: 'dd', hour: 'HH', minute: 'mm' };
        return dtf.formatToParts(sampleDate)
            .map(part => part.type === 'literal'
            ? part.value
            : tokenMap[part.type])
            .join('');
    };
    const getDateTimeSecPattern = () => {
        const localeCode = convertLocalCode();
        const sampleDate = new Date(2025, 12, 31, 15, 30, 45); // default date for pattern with time and seconds
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        const dtf = new Intl.DateTimeFormat(localeCode, options);
        const tokenMap = { year: 'yyyy', month: 'MM', day: 'dd', hour: 'HH', minute: 'mm', second: 'ss' };
        return dtf.formatToParts(sampleDate)
            .map(part => part.type === 'literal'
            ? part.value
            : tokenMap[part.type])
            .join('');
    };
    const getTimePattern = () => {
        const localeCode = convertLocalCode();
        const sampleDate = new Date(2025, 12, 31, 15, 30); // default date for pattern with time
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        const dtf = new Intl.DateTimeFormat(localeCode, options);
        const tokenMap = { hour: 'HH', minute: 'mm' };
        return dtf.formatToParts(sampleDate)
            .map(part => part.type === 'literal'
            ? part.value
            : tokenMap[part.type])
            .join('');
    };
    const formatDate = ((_a = config === null || config === void 0 ? void 0 : config.userDateFormat) === null || _a === void 0 ? void 0 : _a.date) || getDatePattern();
    const formatDateTime = ((_b = config === null || config === void 0 ? void 0 : config.userDateFormat) === null || _b === void 0 ? void 0 : _b.dateTime) || getDateTimePattern();
    const formatDateTimeSec = ((_c = config === null || config === void 0 ? void 0 : config.userDateFormat) === null || _c === void 0 ? void 0 : _c.dateTimeSec) || getDateTimeSecPattern();
    const formatTime = ((_d = config === null || config === void 0 ? void 0 : config.userDateFormat) === null || _d === void 0 ? void 0 : _d.time) || getTimePattern();
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
        en: {
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
    const convertDateFormatQuasarToDateFns = (quasarFormat) => {
        const FORMAT_MAP = {
            'YYYY': 'yyyy',
            'YY': 'yy',
            'MM': 'MM',
            'DD': 'dd',
            'HH': 'HH',
            'mm': 'mm',
            'ss': 'ss'
        };
        return quasarFormat.replace(/YYYY|YY|MM|DD|HH|mm|ss/g, match => FORMAT_MAP[match] || match);
    };
    const convertDateFormatDateFnsToQuasar = (dateFnsFormat) => {
        const REVERSE_FORMAT_MAP = {
            'yyyy': 'YYYY',
            'yy': 'YY',
            'MM': 'MM',
            'dd': 'DD',
            'HH': 'HH',
            'mm': 'mm',
            'ss': 'ss'
        };
        return dateFnsFormat.replace(/yyyy|yy|MM|dd|HH|mm|ss/g, match => REVERSE_FORMAT_MAP[match] || match);
    };
    const correctLocale = () => {
        const localeCode = config === null || config === void 0 ? void 0 : config.localeCode;
        if (!localeCode) {
            throw new Error('Missing locale code');
        }
        switch (localeCode) {
            case 'pl_PL.utf8':
                return { localeCode: pl, lang: 'pl' };
            case 'hu_HU.utf8':
                return { localeCode: hu, lang: 'hu' };
            case 'en_GB.utf8':
                return { localeCode: enGB, lang: 'en' };
            default:
                return { localeCode: enGB, lang: 'en' };
        }
    };
    const parseDateWithoutTimezone = (dateString) => {
        if (typeof dateString === 'string' && dateString.includes('T')) {
            const [datePart, timePart] = dateString.split('T');
            const timeOnly = timePart.split(':').slice(0, 2).join(':');
            const newDateString = `${datePart} ${timeOnly}`;
            return parse(newDateString, 'yyyy-MM-dd HH:mm', new Date());
        }
        return new Date(dateString);
    };
    const convertDate = (date) => {
        return parseDateWithoutTimezone(date);
    };
    const currentDateSql = () => {
        const now = new Date();
        return now.toISOString().split('T')[0];
    };
    const currentYear = () => {
        return format(new Date(), 'yyyy');
    };
    const time = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString(convertLocalCode(), timeOptions);
    };
    const parseTime = (timeString) => {
        const parsedTime = parse(timeString, 'HH:mm:ss', new Date());
        return parsedTime.toLocaleTimeString(convertLocalCode(), timeOptions);
    };
    const humanDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(convertLocalCode(), dateOptions);
    };
    const humanDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(convertLocalCode(), dateTimeOptions);
    };
    const sqlDateTime = (dateString) => {
        return new Date(dateString).toISOString();
    };
    const humanDateTimeSec = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(convertLocalCode(), dateTimeSecOptions);
    };
    const humanDateFromTimestamp = (dateString) => {
        const result = fromUnixTime(dateString / 1000);
        return result.toLocaleDateString(convertLocalCode(), dateOptions);
    };
    const humanDateTimeFromTimestamp = (dateString) => {
        const result = fromUnixTime(dateString / 1000);
        return result.toLocaleDateString(convertLocalCode(), dateTimeOptions);
    };
    const humanDateTimeSecFromTimestamp = (dateString) => {
        const result = fromUnixTime(dateString / 1000);
        return result.toLocaleDateString(convertLocalCode(), dateTimeSecOptions);
    };
    const isDifferenceInYears = (dateString1, dateString2) => {
        return differenceInYears(convertDate(dateString1), convertDate(dateString2));
    };
    const substractFromDate = (dateString, options) => {
        return sub(dateString, options);
    };
    const getDayAndTime = (dateString, shortCutDay = false) => {
        const date = parseDateWithoutTimezone(dateString);
        const localize = correctLocale();
        const result = {
            day: format(date, "EEEE", { locale: localize.localeCode }),
            time: format(date, "HH:mm", { locale: localize.localeCode })
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
    const addToDate = (dateString, options) => {
        return add(new Date(dateString), options);
    };
    return {
        format: {
            js: {
                date: formatDate,
                dateTime: formatDateTime,
                dateTimeSec: formatDateTimeSec,
                time: formatTime,
            },
            quasar: {
                date: convertDateFormatDateFnsToQuasar(formatDate),
                dateTime: convertDateFormatDateFnsToQuasar(formatDateTime),
                dateTimeSec: convertDateFormatDateFnsToQuasar(formatDateTimeSec),
                time: convertDateFormatDateFnsToQuasar(formatTime),
            },
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
        substractFromDate,
        operatorOptions,
        isValidDate,
        doesIncludeTime,
        useTimeAgo,
        time,
        currentDateSql,
        typeOptions,
        relativeDateOptions,
        getDayAndTime,
        correctLocale,
        addToDate,
        convertDateFormatQuasarToDateFns,
        convertDateFormatDateFnsToQuasar,
        sqlDateTime,
        parseTime
    };
}
