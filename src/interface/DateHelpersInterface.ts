import type { Ref } from 'vue'
import type { Locale } from 'date-fns'

interface IUserDateFormat {
    date: string;
    dateTime:string;
    dateTimeSec:string;
    time:string
  } 

export interface IDateHelpersConfig {
  localeCode?: string;
  $_t?: (key: string) => string;
  userDateFormat?:IUserDateFormat;
}


export interface IExportedDateFormat  {
  js:IUserDateFormat;
  quasar:IUserDateFormat;
  dateISO: string;
  dateTimeISO: string;
}

export interface IUseDateHelpersReturn {
  format: IExportedDateFormat
  humanDate(dateString: string): string
  humanDateTime(dateString: string | Date): string
  humanDateTimeSec(dateString: string): string
  isDifferenceInYears(a: string | Date, b: string | Date): number
  humanDateFromTimestamp(ts: number): string
  humanDateTimeFromTimestamp(ts: number): string
  humanDateTimeSecFromTimestamp(ts: number): string
  currentYear(): string
  substractFromDate(date: string | Date, options: Record<string, number>): Date
  operatorOptions: Ref<Array<{ value: string; label: string }>>
  isValidDate(dateString: string): boolean
  doesIncludeTime(dateString: string): boolean
  useTimeAgo(
    dateString?: string | Date | boolean | null,
    options?: Record<string, unknown>
  ): string
  time(dateString: string): string
  currentDateSql(): string
  typeOptions: Ref<Array<{ value: string; label: string }>>
  relativeDateOptions: Ref<Array<{ value: string; label: string }>>
  getDayAndTime(
    dateString: string | Date,
    options?: { shortCutDay?: boolean; timeWithSeconds?: boolean }
  ): { day: string; time: string }
  dateFnsLocale(): { locale: Locale }
  addToDate(date: string | Date, options: Record<string, number>): Date
  convertDateFormatQuasarToDateFns(quasarFormat: string): string
  convertDateFormatDateFnsToQuasar(dateFnsFormat: string): string
  sqlDateTime(date: string | Date): string
  parseTime(timeString: string): string,
  formatLocaleDate(dateString: string, format:string): string
  dateDiff(interval: TDateDiffInterval, date1: string | Date, date2: string | Date): number
  isoDate(dateString: string): string
  getDateRangeFromMonth(year: number, month: number): { from: string, to: string }
}

export type TDateDiffInterval =
  | 'YEARS'
  | 'QUARTERS'
  | 'MONTHS'
  | 'WEEKS'
  | 'DAYS'
  | 'HOURS'
  | 'MINUTES'
  | 'SECONDS'
  | 'MILLISECONDS'
  | 'CALENDAR_DAYS'
  | 'CALENDAR_WEEKS'
  | 'CALENDAR_ISO_WEEKS'
  | 'CALENDAR_MONTHS'
  | 'CALENDAR_QUARTERS'
  | 'CALENDAR_YEARS'
  | 'BUSINESS_DAYS'
