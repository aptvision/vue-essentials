import { IDateHelpersConfig } from '../types/DateHelpersInterface';
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
    subtractFromDate: (dateString: string | Date | boolean | null, options: Record<string, number>) => any;
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
    doesIncludeTime: (dateString: any) => boolean;
    useTimeAgo: (dateString: string | Date | boolean | null, options: Record<string, any>) => string;
    time: (dateString: string) => string;
    currentDateSql: () => string;
};
