import { ref } from 'vue';
import { format, fromUnixTime, sub, isValid, parseISO, isEqual, startOfDay, formatDistance, parse, add, differenceInYears, differenceInQuarters, differenceInMonths, differenceInWeeks, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, differenceInMilliseconds, differenceInCalendarDays, differenceInCalendarWeeks, differenceInCalendarISOWeeks, differenceInCalendarMonths, differenceInCalendarQuarters, differenceInCalendarYears, differenceInBusinessDays, startOfMonth, endOfMonth, } from 'date-fns';
import { pl, hu, enGB } from 'date-fns/locale'; // INFO: hardoced-locale-codes from date fns, you can add another in future
const intervalFunctionMap = {
    YEARS: differenceInYears,
    QUARTERS: differenceInQuarters,
    MONTHS: differenceInMonths,
    WEEKS: differenceInWeeks,
    DAYS: differenceInDays,
    HOURS: differenceInHours,
    MINUTES: differenceInMinutes,
    SECONDS: differenceInSeconds,
    MILLISECONDS: differenceInMilliseconds,
    CALENDAR_DAYS: differenceInCalendarDays,
    CALENDAR_WEEKS: differenceInCalendarWeeks,
    CALENDAR_ISO_WEEKS: differenceInCalendarISOWeeks,
    CALENDAR_MONTHS: differenceInCalendarMonths,
    CALENDAR_QUARTERS: differenceInCalendarQuarters,
    CALENDAR_YEARS: differenceInCalendarYears,
    BUSINESS_DAYS: differenceInBusinessDays,
};
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
    const convertLocaleCode = () => {
        const localeCode = config && config.localeCode;
        if (!localeCode) {
            throw new Error('Missing locale code');
        }
        if (!localeCode.match(/^[a-z][a-z].?[A-Z][A-Z]/)) {
            throw new Error('Invalid locale code');
        }
        return localeCode[0] + localeCode[1] + '-' + localeCode[3] + localeCode[4];
    };
    const localeCode = convertLocaleCode();
    const getDatePattern = () => {
        const sampleDate = new Date(); // default date for pattern with time
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        const dtf = new Intl.DateTimeFormat(localeCode, options);
        const tokenMap = { year: 'yyyy', month: 'mm', day: 'dd' };
        return dtf.formatToParts(sampleDate)
            .map(part => part.type === 'literal'
            ? part.value
            : tokenMap[part.type])
            .join('');
    };
    const getDateTimePattern = () => {
        const sampleDate = new Date(); // default date for pattern with time
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        const dtf = new Intl.DateTimeFormat(localeCode, options);
        const tokenMap = { year: 'yyyy', month: 'mm', day: 'dd', hour: 'HH', minute: 'mm' };
        return dtf.formatToParts(sampleDate)
            .map(part => part.type === 'literal'
            ? part.value
            : tokenMap[part.type])
            .join('');
    };
    const getDateTimeSecPattern = () => {
        const sampleDate = new Date(); // default date for pattern with time and seconds
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
        const tokenMap = { year: 'yyyy', month: 'mm', day: 'dd', hour: 'HH', minute: 'mm', second: 'ss' };
        return dtf.formatToParts(sampleDate)
            .map(part => part.type === 'literal'
            ? part.value
            : tokenMap[part.type])
            .join('');
    };
    const getTimePattern = () => {
        const sampleDate = new Date(); // default date for pattern with time
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
    // dateStr only iso format date , formatStr - custom native format 'd MMMM' for example
    const formatLocaleDate = (dateStr, formatStr = getDateTimeSecPattern()) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            throw new Error(`Invalid ISO Date: "${dateStr}"`);
        }
        const yearNum = date.getFullYear();
        const monthNum = date.getMonth() + 1;
        const dayNum = date.getDate();
        const hourNum = date.getHours();
        const minNum = date.getMinutes();
        const secNum = date.getSeconds();
        const tokens = {
            yyyy: String(yearNum),
            yy: String(yearNum).slice(-2),
            MMMM: new Intl.DateTimeFormat(localeCode, { month: "long" }).format(date),
            MMM: new Intl.DateTimeFormat(localeCode, { month: "short" }).format(date),
            mm: String(monthNum).padStart(2, "0"),
            m: String(monthNum),
            dd: String(dayNum).padStart(2, "0"),
            d: String(dayNum),
            HH: String(hourNum).padStart(2, "0"),
            H: String(hourNum),
            ii: String(minNum).padStart(2, "0"), // użyłem "ii" żeby nie kolidować z "mm" miesiąca
            i: String(minNum),
            ss: String(secNum).padStart(2, "0"),
            s: String(secNum),
        };
        return formatStr.replace(/(yyyy|MMMM|MMM|dd|yy|mm|m|d|HH|H|ii|i|ss|s)/g, (tok) => tokens[tok]);
    };
    const isoDate = (dateStr) => {
        return formatLocaleDate(dateStr, 'yyyy-mm-dd HH:ii:ss');
    };
    const formatDate = ((_a = config === null || config === void 0 ? void 0 : config.userDateFormat) === null || _a === void 0 ? void 0 : _a.date) || getDatePattern();
    const formatDateTime = ((_b = config === null || config === void 0 ? void 0 : config.userDateFormat) === null || _b === void 0 ? void 0 : _b.dateTime) || getDateTimePattern();
    const formatDateTimeSec = ((_c = config === null || config === void 0 ? void 0 : config.userDateFormat) === null || _c === void 0 ? void 0 : _c.dateTimeSec) || getDateTimeSecPattern();
    const formatTime = ((_d = config === null || config === void 0 ? void 0 : config.userDateFormat) === null || _d === void 0 ? void 0 : _d.time) || getTimePattern();
    const formatDateISO = 'YYYY-MM-DD';
    const formatDateTimeISO = 'YYYY-MM-DDTHH:mm:ss';
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
    const dateFnsLocale = () => {
        if (!localeCode) {
            throw new Error('Missing locale code');
        }
        switch (localeCode) {
            case 'pl-PL':
                return { locale: pl };
            case 'hu-HU':
                return { locale: hu };
            case 'en-GB':
                return { locale: enGB };
            default:
                return { locale: enGB };
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
        return date.toLocaleTimeString(localeCode, timeOptions);
    };
    const parseTime = (timeString) => {
        const parsedTime = parse(timeString, 'HH:mm:ss', new Date());
        return parsedTime.toLocaleTimeString(localeCode, timeOptions);
    };
    const humanDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(localeCode, dateOptions);
    };
    const humanDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(localeCode, dateTimeOptions);
    };
    const sqlDateTime = (dateString) => {
        return new Date(dateString).toISOString();
    };
    const humanDateTimeSec = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(localeCode, dateTimeSecOptions);
    };
    const humanDateFromTimestamp = (dateString) => {
        const result = fromUnixTime(dateString / 1000);
        return result.toLocaleDateString(localeCode, dateOptions);
    };
    const humanDateTimeFromTimestamp = (dateString) => {
        const result = fromUnixTime(dateString / 1000);
        return result.toLocaleDateString(localeCode, dateTimeOptions);
    };
    const humanDateTimeSecFromTimestamp = (dateString) => {
        const result = fromUnixTime(dateString / 1000);
        return result.toLocaleDateString(localeCode, dateTimeSecOptions);
    };
    const dateDiff = (interval, date1, date2) => {
        const diffFunction = intervalFunctionMap[interval.toUpperCase()];
        if (!diffFunction || typeof diffFunction !== 'function') {
            throw new Error('No method matches diff interval: ' + interval);
        }
        return diffFunction(convertDate(date1), convertDate(date2));
    };
    const isDifferenceInYears = (dateString1, dateString2) => {
        return differenceInYears(convertDate(dateString1), convertDate(dateString2));
    };
    const substractFromDate = (dateString, options) => {
        return sub(dateString, options);
    };
    const getDayAndTime = (dateString, options = {}) => {
        const date = parseDateWithoutTimezone(dateString);
        const localize = dateFnsLocale();
        const result = {
            day: format(date, "EEEE", { locale: localize.locale }),
            time: format(date, options.timeWithSeconds ? "HH:mm:ss" : "HH:mm", { locale: localize.locale })
        };
        if (options.shortCutDay) {
            result.day = date.toLocaleDateString(localeCode, { weekday: 'short' });
        }
        return result;
    };
    const useTimeAgo = (dateString = null, options) => {
        const currentDate = new Date();
        const baseDate = sub(dateString ? dateString : new Date(), options);
        return formatDistance(baseDate, currentDate, Object.assign({ addSuffix: true, locale: dateFnsLocale().locale }, options));
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
    const getMonthDateRangeFromDate = (date, options = {}) => {
        const inputDate = new Date(date);
        const startDate = startOfMonth(inputDate);
        const endDate = endOfMonth(inputDate);
        const result = {
            from: format(startDate, 'yyyy-MM-dd'),
            to: format(endDate, 'yyyy-MM-dd')
        };
        if (options.monthName) {
            let monthName = new Intl.DateTimeFormat(localeCode, { month: "long" }).format(inputDate);
            if (options.year) {
                const year = inputDate.getFullYear();
                monthName = `${monthName} ${year}`;
            }
            result.title = monthName;
        }
        return result;
    };
    const getDaysOfWeek = (startDay = 0) => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const dayNumber = (startDay + i) % 7;
            const baseDate = new Date(2024, 0, 7); // January 7, 2024 (Sunday)
            const dayDate = new Date(baseDate);
            dayDate.setDate(baseDate.getDate() + dayNumber);
            const shortName = new Intl.DateTimeFormat(localeCode, { weekday: 'short' }).format(dayDate);
            const longName = new Intl.DateTimeFormat(localeCode, { weekday: 'long' }).format(dayDate);
            days.push({
                dayNumber,
                shortName,
                longName
            });
        }
        return days;
    };
    const exportedFormat = () => {
        return {
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
        };
    };
    return {
        format: exportedFormat(),
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
        dateDiff,
        currentDateSql,
        typeOptions,
        relativeDateOptions,
        getDayAndTime,
        dateFnsLocale,
        addToDate,
        convertDateFormatQuasarToDateFns,
        convertDateFormatDateFnsToQuasar,
        sqlDateTime,
        parseTime,
        formatLocaleDate,
        isoDate,
        getMonthDateRangeFromDate,
        getDaysOfWeek
    };
}
