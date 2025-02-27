import { ref } from 'vue';
import { format, differenceInYears, fromUnixTime, sub, isValid, parseISO, isEqual, startOfDay, formatDistance } from 'date-fns';
import { date } from 'quasar';
import { pl, hu, enGB } from 'date-fns/locale'; // INFO: hardoced-locale-codes from date fns, you can add another in future
export function useDateHelpers(config) {
    const formatDate = config?.userDateFormat?.date || 'YYYY/MM/DD';
    const formatDateTime = config?.userDateFormat?.dateTime || 'YYYY/MM/DD HH:mm';
    const formatDateTimeSec = config?.userDateFormat?.dateTimeSec || 'YYYY/MM/DD HH:mm:ss';
    const formatTime = config?.userDateFormat?.time || 'HH:mm';
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
    const convertFormatToDateFns = (quasarFormat) => {
        return quasarFormat.replace(/YYYY|YY|MM|DD|HH|mm|ss/g, match => FORMAT_MAP[match] || match);
    };
    const correctLocale = () => {
        const localeCode = config?.localeCode || 'en_GB.utf8';
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
        return formatDistance(baseDate, currentDate, { addSuffix: true, locale: correctLocale().localeCode, ...options });
    };
    const typeOptions = ref([
        { value: 'relative', label: config?.$_t?.('Relative Date') ?? 'Relative Date', },
        { value: 'fixed', label: config?.$_t?.('Actual Date') ?? 'Actual Date' }
    ]);
    const relativeDateOptions = ref([
        { value: 'today', label: config?.$_t?.('Today') ?? 'Today' },
        { value: 'thisWeek', label: config?.$_t?.('Start of current week') ?? 'Start of current week' },
        { value: 'thisMonth', label: config?.$_t?.('Start of current month') ?? 'Start of current month' },
        { value: 'thisYear', label: config?.$_t?.('Start of current year') ?? 'Start of current year' }
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
    const addToDate = (dateString = null, options) => {
        return date.addToDate(dateString ? dateString : new Date(), options);
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
        getDayAndTime,
        correctLocale,
        addToDate,
        convertFormatToDateFns
    };
}
