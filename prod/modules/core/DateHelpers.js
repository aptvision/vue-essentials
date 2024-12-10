import { ref } from 'vue';
import { format, differenceInYears, fromUnixTime, sub, isValid, parseISO, isEqual, startOfDay, formatDistance } from 'date-fns';
import { date } from 'quasar';
import { pl, hu, enGB } from 'date-fns/locale'; // INFO: hardoced-locale-codes from date fns, you can add another in future
export function useDateHelpers(config) {
    var _a, _b, _c, _d;
    const formatDate = ((_a = config === null || config === void 0 ? void 0 : config.userDateFormat) === null || _a === void 0 ? void 0 : _a.date) || 'YYYY/MM/DD';
    const formatDateTime = ((_b = config === null || config === void 0 ? void 0 : config.userDateFormat) === null || _b === void 0 ? void 0 : _b.dateTime) || 'YYYY/MM/DD HH:mm';
    const formatDateTimeSec = ((_c = config === null || config === void 0 ? void 0 : config.userDateFormat) === null || _c === void 0 ? void 0 : _c.dateTimeSec) || 'YYYY/MM/DD HH:mm:ss';
    const formatTime = ((_d = config === null || config === void 0 ? void 0 : config.userDateFormat) === null || _d === void 0 ? void 0 : _d.time) || 'HH:mm';
    const formatDateISO = 'YYYY-MM-DD';
    const formatDateTimeISO = 'YYYY-MM-DDTHH:mm:ss';
    const correctLocale = () => {
        const localeCode = (config === null || config === void 0 ? void 0 : config.localeCode) || 'en_GB.utf8';
        switch (localeCode) {
            case 'pl_PL.utf8':
                return pl;
            case 'hu_HU.utf8':
                return hu;
            case 'en_GB.utf8':
                return enGB;
            default:
                return enGB;
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
        return sub(dateString || new Date(), options);
    };
    const useTimeAgo = (dateString = null, options) => {
        const currentDate = new Date();
        const baseDate = sub(dateString || new Date(), options);
        return formatDistance(baseDate, currentDate, Object.assign({ addSuffix: true, locale: correctLocale() }, options));
    };
    // const typeOptions = ref([
    //   { value: 'relative', label: $_t('Relative Date') },
    //   { value: 'fixed', label: $_t('Actual Date') }
    // ])
    // const relativeDateOptions = ref([
    //   { value: 'today', label: $_t('Today') },
    //   { value: 'thisWeek', label: $_t('Start of current week') },
    //   { value: 'thisMonth', label: $_t('Start of current month') },
    //   { value: 'thisYear', label: $_t('Start of current year') }
    // ])
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
        currentDateSql
        // typeOptions,
        // relativeDateOptions,
    };
}
