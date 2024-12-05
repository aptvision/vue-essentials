"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDateHelpers = useDateHelpers;
const vue_1 = require("vue");
const date_fns_1 = require("date-fns");
const quasar_1 = require("quasar");
const locale_1 = require("date-fns/locale"); // INFO: hardoced-locale-codes from date fns, you can add another in future
function useDateHelpers(config) {
    const formatDate = config?.userDateFormat?.date || 'YYYY/MM/DD';
    const formatDateTime = config?.userDateFormat?.dateTime || 'YYYY/MM/DD HH:mm';
    const formatDateTimeSec = config?.userDateFormat?.dateTimeSec || 'YYYY/MM/DD HH:mm:ss';
    const formatTime = config?.userDateFormat?.time || 'HH:mm';
    const formatDateISO = 'YYYY-MM-DD';
    const formatDateTimeISO = 'YYYY-MM-DDTHH:mm:ss';
    const correctLocale = () => {
        const localeCode = config?.localeCode || 'en_GB.utf8';
        switch (localeCode) {
            case 'pl_PL.utf8':
                return locale_1.pl;
            case 'hu_HU.utf8':
                return locale_1.hu;
            case 'en_GB.utf8':
                return locale_1.enGB;
            default:
                return locale_1.enGB;
        }
    };
    const convertDate = (date) => {
        return new Date(date);
    };
    const currentDateSql = () => {
        return quasar_1.date.formatDate(new Date(), formatDateISO);
    };
    const currentYear = () => {
        return (0, date_fns_1.format)(new Date(), 'yyyy');
    };
    const time = (dateString) => {
        return quasar_1.date.formatDate(new Date(dateString), formatTime);
    };
    const humanDate = (dateString) => {
        return quasar_1.date.formatDate(new Date(dateString), formatDate);
    };
    const humanDateTime = (dateString) => {
        return quasar_1.date.formatDate(new Date(dateString), formatDateTime);
    };
    const humanDateTimeSec = (dateString) => {
        return quasar_1.date.formatDate(new Date(dateString), formatDateTimeSec);
    };
    const humanDateFromTimestamp = (dateString) => {
        const result = (0, date_fns_1.fromUnixTime)(dateString / 1000);
        return quasar_1.date.formatDate(result, formatDate);
    };
    const humanDateTimeFromTimestamp = (dateString) => {
        const result = (0, date_fns_1.fromUnixTime)(dateString / 1000);
        return quasar_1.date.formatDate(result, formatDateTime);
    };
    const humanDateTimeSecFromTimestamp = (dateString) => {
        const result = (0, date_fns_1.fromUnixTime)(dateString / 1000);
        return (0, date_fns_1.format)(result, formatDateTimeSec);
    };
    const isDifferenceInYears = (dateString1, dateString2) => {
        return (0, date_fns_1.differenceInYears)(convertDate(dateString1), convertDate(dateString2));
    };
    const subtractFromDate = (dateString = null, options) => {
        return (0, date_fns_1.sub)(dateString || new Date(), options);
    };
    const useTimeAgo = (dateString = null, options) => {
        const currentDate = new Date();
        const baseDate = (0, date_fns_1.sub)(dateString || new Date(), options);
        return (0, date_fns_1.formatDistance)(baseDate, currentDate, { addSuffix: true, locale: correctLocale(), ...options });
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
    const operatorOptions = (0, vue_1.ref)([
        { value: 'plus', label: '+' },
        { value: 'minus', label: '-' }
    ]);
    const isValidDate = (dateString) => {
        return (0, date_fns_1.isValid)(Date.parse(dateString));
    };
    const doesIncludeTime = (dateString) => {
        const parsedDate = (0, date_fns_1.parseISO)(dateString);
        if ((0, date_fns_1.isValid)(parsedDate)) {
            return !(0, date_fns_1.isEqual)(parsedDate, (0, date_fns_1.startOfDay)(parsedDate));
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
