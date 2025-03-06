import { IDateHelpersConfig } from '../interface/DateHelpersInterface';
import { DateOptions } from 'quasar/dist/types/utils/date';
export declare function useDateHelpers(config?: IDateHelpersConfig): {
    format: {
        date: string;
        dateTime: string;
        dateTimeSec: string;
        time: string;
        dateISO: string;
        dateTimeISO: string;
    };
    humanDate: (dateString: string) => string;
    humanDateTime: (dateString: string | Date) => string;
    humanDateTimeSec: (dateString: string) => string;
    isDifferenceInYears: (dateString1: string | Date, dateString2: string | Date) => number;
    humanDateFromTimestamp: (dateString: number) => string;
    humanDateTimeFromTimestamp: (dateString: number) => string;
    humanDateTimeSecFromTimestamp: (dateString: number) => string;
    currentYear: () => string;
    substractFromDate: (dateString: string | Date, options: DateOptions) => Date;
    operatorOptions: import("vue").Ref<{
        value: string;
        label: string;
    }[], {
        value: string;
        label: string;
    }[] | {
        value: string;
        label: string;
    }[]>;
    isValidDate: (dateString: string) => boolean;
    doesIncludeTime: (dateString: string) => boolean;
    useTimeAgo: (dateString: (string | Date | boolean | null) | undefined, options: Record<string, unknown>) => string;
    time: (dateString: string) => string;
    currentDateSql: () => string;
    typeOptions: import("vue").Ref<{
        value: string;
        label: string;
    }[], {
        value: string;
        label: string;
    }[] | {
        value: string;
        label: string;
    }[]>;
    relativeDateOptions: import("vue").Ref<{
        value: string;
        label: string;
    }[], {
        value: string;
        label: string;
    }[] | {
        value: string;
        label: string;
    }[]>;
    getDayAndTime: (dateString: string | Date, shortCutDay?: boolean) => {
        day: string;
        time: string;
    };
    correctLocale: () => {
        localeCode: import("date-fns").Locale;
        lang: string;
    };
    addToDate: (dateString: string | Date, options: DateOptions) => Date;
    convertDateFormatQuasarToDateFns: (quasarFormat: string) => string;
    sqlDateTime: (dateString: string | Date) => string;
};
