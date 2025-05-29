import { ref } from 'vue'
import {
  format,
  fromUnixTime,
  sub,
  isValid,
  parseISO,
  isEqual,
  startOfDay,
  formatDistance,
  parse,
  add,
  differenceInYears,
  differenceInQuarters,
  differenceInMonths,
  differenceInWeeks,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  differenceInMilliseconds,
  differenceInCalendarDays,
  differenceInCalendarWeeks,
  differenceInCalendarISOWeeks,
  differenceInCalendarMonths,
  differenceInCalendarQuarters,
  differenceInCalendarYears,
  differenceInBusinessDays,
} from 'date-fns'
import { pl, hu, enGB } from 'date-fns/locale' // INFO: hardoced-locale-codes from date fns, you can add another in future
import { IDateHelpersConfig, IExportedDateFormat, IUseDateHelpersReturn, TDateDiffInterval } from '../interface/DateHelpersInterface'

const intervalFunctionMap: Record<TDateDiffInterval, (dateLeft: Date, dateRight: Date) => number> = {
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
}

export function useDateHelpers (config?:IDateHelpersConfig):IUseDateHelpersReturn {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }

  const dateTimeSecOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }

  const convertLocaleCode = () => {
    const localeCode = config && config.localeCode;

    if (!localeCode) {
      throw new Error('Missing locale code');
    }
    if (!localeCode.match(/^[a-z][a-z].?[A-Z][A-Z]/)) {
      throw new Error('Invalid locale code');
    }

    return localeCode[0] + localeCode[1] + '-' + localeCode[3] + localeCode[4]
  }
  const localeCode = convertLocaleCode()
  const getDatePattern = () =>{
    const sampleDate = new Date();  // default date for pattern with time
    const options: Intl.DateTimeFormatOptions = {
      year:  'numeric',
      month: '2-digit',
      day:   '2-digit'
    };



    const dtf = new Intl.DateTimeFormat(localeCode, options);

    const tokenMap = { year: 'yyyy', month: 'mm', day: 'dd' }

    return dtf.formatToParts(sampleDate)
      .map(part => part.type === 'literal'
        ? part.value
        : tokenMap[part.type as keyof typeof tokenMap]
      )
      .join('');
  }

  const getDateTimePattern = () => {
    const sampleDate = new Date();  // default date for pattern with time
    const options: Intl.DateTimeFormatOptions = {
      year:  'numeric',
      month: '2-digit',
      day:   '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };

    const dtf = new Intl.DateTimeFormat(localeCode, options);

    const tokenMap = { year: 'yyyy', month: 'mm', day: 'dd', hour: 'HH', minute: 'mm' }

    return dtf.formatToParts(sampleDate)
      .map(part => part.type === 'literal'
        ? part.value
        : tokenMap[part.type as keyof typeof tokenMap]
      )
      .join('');
  }

  const getDateTimeSecPattern = () => {
    const sampleDate = new Date();  // default date for pattern with time and seconds
    const options: Intl.DateTimeFormatOptions = {
      year:  'numeric',
      month: '2-digit',
      day:   '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    const dtf = new Intl.DateTimeFormat(localeCode, options);

    const tokenMap = { year: 'yyyy', month: 'mm', day: 'dd', hour: 'HH', minute: 'mm', second: 'ss' }

    return dtf.formatToParts(sampleDate)
      .map(part => part.type === 'literal'
        ? part.value
        : tokenMap[part.type as keyof typeof tokenMap]
      )
      .join('');
  }

  const getTimePattern = () => {
    const sampleDate = new Date();  // default date for pattern with time
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };

    const dtf = new Intl.DateTimeFormat(localeCode, options);

    const tokenMap = { hour: 'HH', minute: 'mm' }

    return dtf.formatToParts(sampleDate)
      .map(part => part.type === 'literal'
        ? part.value
        : tokenMap[part.type as keyof typeof tokenMap]
      )
      .join('');
  }

  // dateStr only iso format date , formatStr - custom native format 'd MMMM' for example
  const formatLocaleDate = (dateStr: string,formatStr = getDateTimeSecPattern()): string => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid ISO Date: "${dateStr}"`);
    }

    const yearNum  = date.getFullYear();
    const monthNum = date.getMonth() + 1;
    const dayNum   = date.getDate();
    const hourNum  = date.getHours();
    const minNum   = date.getMinutes();
    const secNum   = date.getSeconds();

    const tokens: Record<string,string> = {
      yyyy: String(yearNum),
      yy:   String(yearNum).slice(-2),

      MMMM: new Intl.DateTimeFormat(localeCode, { month: "long"  }).format(date),
      MMM:  new Intl.DateTimeFormat(localeCode, { month: "short" }).format(date),
      mm:   String(monthNum).padStart(2, "0"),
      m:    String(monthNum),

      dd:   String(dayNum).padStart(2, "0"),
      d:    String(dayNum),

      HH:   String(hourNum).padStart(2, "0"),
      H:    String(hourNum),
      ii:   String(minNum).padStart(2, "0"), // użyłem "ii" żeby nie kolidować z "mm" miesiąca
      i:    String(minNum),
      ss:   String(secNum).padStart(2, "0"),
      s:    String(secNum),
    };

    return formatStr.replace(
      /(yyyy|MMMM|MMM|dd|yy|mm|m|d|HH|H|ii|i|ss|s)/g,
      (tok) => tokens[tok]
    );
  }

  const formatDate = config?.userDateFormat?.date || getDatePattern()
  const formatDateTime = config?.userDateFormat?.dateTime || getDateTimePattern()
  const formatDateTimeSec = config?.userDateFormat?.dateTimeSec || getDateTimeSecPattern()
  const formatTime = config?.userDateFormat?.time || getTimePattern()
  const formatDateISO = 'YYYY-MM-DD';
  const formatDateTimeISO = 'YYYY-MM-DDTHH:mm:ss';

  const dayShortcuts: Record<string, Record<string, string>> = {
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

  const convertDateFormatQuasarToDateFns = (quasarFormat:string) => {
    const FORMAT_MAP = <Record<string, string>>{
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

  const convertDateFormatDateFnsToQuasar = (dateFnsFormat:string) => {
    const REVERSE_FORMAT_MAP = <Record<string, string>>{
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


  const correctLocale = () => { //TODO:this function cannot be removed , its using lokalize from date-fns for timeago and other
    const localeCode = config?.localeCode
    if (!localeCode) {
      throw new Error('Missing locale code')
    }
    switch (localeCode) {
      case 'pl_PL.utf8':
        return {localeCode:pl,lang:'pl'}
      case 'hu_HU.utf8':
        return {localeCode:hu,lang:'hu'}
      case 'en_GB.utf8':
        return {localeCode:enGB,lang:'en'}
      default:
        return {localeCode:enGB,lang:'en'}
    }
  }

  const parseDateWithoutTimezone = (dateString: string | Date): Date => {
    if (typeof dateString === 'string' && dateString.includes('T')) {
      const [datePart, timePart] = dateString.split('T');
      const timeOnly = timePart.split(':').slice(0, 2).join(':');
      const newDateString = `${datePart} ${timeOnly}`;

      return parse(newDateString, 'yyyy-MM-dd HH:mm', new Date());
    }
    return new Date(dateString);
  }

  const convertDate = (date: string | Date) => {
    return parseDateWithoutTimezone(date);
  }

  const currentDateSql = () => {
    const now = new Date()
    return now.toISOString().split('T')[0]
  }

  const currentYear = () => {
    return format(new Date(), 'yyyy')
  }

  const time = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString(localeCode, timeOptions)
  }

  const parseTime = (timeString: string) => {
    const parsedTime = parse(timeString, 'HH:mm:ss', new Date());
    return parsedTime.toLocaleTimeString(localeCode, timeOptions)
  }

  const humanDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(localeCode, dateOptions)
  }

  const humanDateTime = (dateString: string | Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(localeCode, dateTimeOptions)
  }

  const sqlDateTime = (dateString: string | Date) => {
    return new Date(dateString).toISOString()
  }

  const humanDateTimeSec = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(localeCode, dateTimeSecOptions)
  }

  const humanDateFromTimestamp = (dateString: number) => {
    const result = fromUnixTime(dateString / 1000)
    return result.toLocaleDateString(localeCode, dateOptions)
  }
  const humanDateTimeFromTimestamp = (dateString: number) => {
    const result = fromUnixTime(dateString / 1000)
    return result.toLocaleDateString(localeCode, dateTimeOptions)
  }
  const humanDateTimeSecFromTimestamp = (dateString: number) => {
    const result = fromUnixTime(dateString / 1000)
    return result.toLocaleDateString(localeCode, dateTimeSecOptions)
  }

  const dateDiff = (interval: TDateDiffInterval, date1: string | Date, date2: string | Date): number => {
    const diffFunction = intervalFunctionMap[interval.toUpperCase() as TDateDiffInterval];
    if (!diffFunction || typeof diffFunction !== 'function') {
      throw new Error('No method matches diff interval: ' + interval)
    }
    return diffFunction(convertDate(date1), convertDate(date2))
  }

  const isDifferenceInYears = (dateString1: string | Date, dateString2: string | Date) => {
    return differenceInYears(convertDate(dateString1), convertDate(dateString2))
  }

  const substractFromDate = (dateString: string | Date, options: Record<string, number>) => {
    return sub(dateString, options)
  }

  const getDayAndTime = (dateString: string | Date, shortCutDay:boolean = false) => {
    const date = parseDateWithoutTimezone(dateString);

    const localize = correctLocale();

    const result = {
      day: format(date, "EEEE", {locale: localize.localeCode}),
      time: format(date, "HH:mm", {locale: localize.localeCode})
    };

    if (shortCutDay) {
      result.day = dayShortcuts[localize.lang as keyof typeof dayShortcuts][result.day];
    }

    return result;
  }

  const useTimeAgo = (dateString: string | Date | boolean | null = null, options: Record<string, unknown>) => {
    const currentDate = new Date()
    const baseDate = sub(dateString ? (dateString as string | Date) : new Date(), options)
    return formatDistance(
      baseDate,
      currentDate,
      { addSuffix: true, locale: correctLocale().localeCode, ...options }
    )
  }

  const typeOptions = ref([
    { value: 'relative', label: config?.$_t?.('Relative Date') ?? 'Relative Date',},
    { value: 'fixed', label: config?.$_t?.('Actual Date') ?? 'Actual Date'}
  ])

  const relativeDateOptions = ref([
    { value: 'today', label: config?.$_t?.('Today') ?? 'Today'},
    { value: 'thisWeek', label: config?.$_t?.('Start of current week') ?? 'Start of current week'},
    { value: 'thisMonth', label: config?.$_t?.('Start of current month') ?? 'Start of current month'},
    { value: 'thisYear', label: config?.$_t?.('Start of current year') ?? 'Start of current year'}
  ])
  const operatorOptions = ref([
    { value: 'plus', label: '+' },
    { value: 'minus', label: '-' }
  ])

  const isValidDate = (dateString: string) => {
    return isValid(Date.parse(dateString))
  }

  const doesIncludeTime = (dateString: string) => {
    const parsedDate: Date = parseISO(dateString)
    if (isValid(parsedDate)) {
      return !isEqual(parsedDate, startOfDay(parsedDate))
    }
    return false
  }

  const addToDate = (dateString: string | Date, options: Record<string, number>) => {
    return add(new Date(dateString), options)
  }

  const exportedFormat = ():IExportedDateFormat => {
    return {
      js:{
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
    }
  }

  return {
    format:exportedFormat(),
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
    correctLocale,
    addToDate,
    convertDateFormatQuasarToDateFns,
    convertDateFormatDateFnsToQuasar,
    sqlDateTime,
    parseTime,
    formatLocaleDate
  }
}
