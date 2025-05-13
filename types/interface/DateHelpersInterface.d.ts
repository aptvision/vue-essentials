import type { Ref } from 'vue';
import type { Locale } from 'date-fns';
interface IUserDateFormat {
    date: string;
    dateTime: string;
    dateTimeSec: string;
    time: string;
}
export interface IDateHelpersConfig {
    localeCode?: string;
    $_t?: (key: string) => string;
    userDateFormat?: IUserDateFormat;
}
export interface IExportedDateFormat {
    js: IUserDateFormat;
    quasar: IUserDateFormat;
    dateISO: string;
    dateTimeISO: string;
}
export interface IUseDateHelpersReturn {
    format: IExportedDateFormat;
    humanDate(dateString: string): string;
    humanDateTime(dateString: string | Date): string;
    humanDateTimeSec(dateString: string): string;
    isDifferenceInYears(a: string | Date, b: string | Date): number;
    humanDateFromTimestamp(ts: number): string;
    humanDateTimeFromTimestamp(ts: number): string;
    humanDateTimeSecFromTimestamp(ts: number): string;
    currentYear(): string;
    substractFromDate(date: string | Date, options: Record<string, number>): Date;
    operatorOptions: Ref<Array<{
        value: string;
        label: string;
    }>>;
    isValidDate(dateString: string): boolean;
    doesIncludeTime(dateString: string): boolean;
    useTimeAgo(dateString?: string | Date | boolean | null, options?: Record<string, unknown>): string;
    time(dateString: string): string;
    currentDateSql(): string;
    typeOptions: Ref<Array<{
        value: string;
        label: string;
    }>>;
    relativeDateOptions: Ref<Array<{
        value: string;
        label: string;
    }>>;
    getDayAndTime(dateString: string | Date, shortCutDay?: boolean): {
        day: string;
        time: string;
    };
    correctLocale(): {
        localeCode: Locale;
        lang: string;
    };
    addToDate(date: string | Date, options: Record<string, number>): Date;
    convertDateFormatQuasarToDateFns(quasarFormat: string): string;
    convertDateFormatDateFnsToQuasar(dateFnsFormat: string): string;
    sqlDateTime(date: string | Date): string;
    parseTime(timeString: string): string;
}
export {};
