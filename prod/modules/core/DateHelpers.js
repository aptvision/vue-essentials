import { ref } from 'vue';
import { format, differenceInYears, fromUnixTime, sub, isValid, parseISO, isEqual, startOfDay, formatDistance, parse, add } from 'date-fns';
import { pl, hu, enGB } from 'date-fns/locale'; // INFO: hardoced-locale-codes from date fns, you can add another in future
export function useDateHelpers(config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    // Opcje dla natywnego Date.toLocaleDateString/toLocaleTimeString
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
    // Generujemy formaty na podstawie natywnych opcji formatowania
    const generateFormatFromOptions = (options) => {
        let format = '';
        // Rok
        if (options.year === 'numeric')
            format += 'YYYY';
        else if (options.year === '2-digit')
            format += 'YY';
        // Miesiąc
        if (options.month === '2-digit')
            format += '/MM';
        else if (options.month === 'numeric')
            format += '/M';
        // Dzień
        if (options.day === '2-digit')
            format += '/DD';
        else if (options.day === 'numeric')
            format += '/D';
        // Godzina
        if (options.hour === '2-digit')
            format += ' HH';
        else if (options.hour === 'numeric')
            format += ' H';
        // Minuta
        if (options.minute === '2-digit')
            format += ':mm';
        else if (options.minute === 'numeric')
            format += ':m';
        // Sekunda
        if (options.second === '2-digit')
            format += ':ss';
        else if (options.second === 'numeric')
            format += ':s';
        return format.trim();
    };
    const formatDate = ((_a = config === null || config === void 0 ? void 0 : config.userDateFormat) === null || _a === void 0 ? void 0 : _a.date) || generateFormatFromOptions(dateOptions);
    const formatDateTime = ((_b = config === null || config === void 0 ? void 0 : config.userDateFormat) === null || _b === void 0 ? void 0 : _b.dateTime) || generateFormatFromOptions(dateTimeOptions);
    const formatDateTimeSec = ((_c = config === null || config === void 0 ? void 0 : config.userDateFormat) === null || _c === void 0 ? void 0 : _c.dateTimeSec) || generateFormatFromOptions(dateTimeSecOptions);
    const formatTime = ((_d = config === null || config === void 0 ? void 0 : config.userDateFormat) === null || _d === void 0 ? void 0 : _d.time) || generateFormatFromOptions(timeOptions);
    const formatDateISO = 'YYYY-MM-DD';
    const formatDateTimeISO = 'YYYY-MM-DDTHH:mm:ss';
    const FORMAT_MAP = {
        'YYYY': 'yyyy',
        'YY': 'yy',
        'MM': 'MM',
        'DD': 'dd',
        'HH': 'HH',
        'mm': 'mm',
        'ss': 'ss'
    };
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
        return quasarFormat.replace(/YYYY|YY|MM|DD|HH|mm|ss/g, match => FORMAT_MAP[match] || match);
    };
    const correctLocale = () => {
        const localeCode = (config === null || config === void 0 ? void 0 : config.localeCode) || 'en_GB.utf8';
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
        return date.toLocaleTimeString(correctLocale().lang, timeOptions);
    };
    const parseTime = (timeString) => {
        const parsedTime = parse(timeString, 'HH:mm:ss', new Date());
        return parsedTime.toLocaleTimeString(correctLocale().lang, timeOptions);
    };
    const humanDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(correctLocale().lang, dateOptions);
    };
    const humanDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(correctLocale().lang, dateTimeOptions);
    };
    const sqlDateTime = (dateString) => {
        return new Date(dateString).toISOString();
    };
    const humanDateTimeSec = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(correctLocale().lang, dateTimeSecOptions);
    };
    const humanDateFromTimestamp = (dateString) => {
        const result = fromUnixTime(dateString / 1000);
        return result.toLocaleDateString(correctLocale().lang, dateOptions);
    };
    const humanDateTimeFromTimestamp = (dateString) => {
        const result = fromUnixTime(dateString / 1000);
        return result.toLocaleDateString(correctLocale().lang, dateTimeOptions);
    };
    const humanDateTimeSecFromTimestamp = (dateString) => {
        const result = fromUnixTime(dateString / 1000);
        return result.toLocaleDateString(correctLocale().lang, dateTimeSecOptions);
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
        sqlDateTime,
        parseTime
    };
}
