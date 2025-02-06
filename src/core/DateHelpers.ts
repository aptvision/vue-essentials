import { ref } from 'vue'
import { format, differenceInYears, fromUnixTime, sub, isValid, parseISO, isEqual, startOfDay, formatDistance } from 'date-fns'
import { date } from 'quasar'
import { pl, hu, enGB } from 'date-fns/locale' // INFO: hardoced-locale-codes from date fns, you can add another in future
import { IDateHelpersConfig } from '../interface/DateHelpersInterface'

export function useDateHelpers (config?:IDateHelpersConfig) {
  const formatDate = config?.userDateFormat?.date || 'YYYY/MM/DD'
  const formatDateTime = config?.userDateFormat?.dateTime || 'YYYY/MM/DD HH:mm'
  const formatDateTimeSec = config?.userDateFormat?.dateTimeSec || 'YYYY/MM/DD HH:mm:ss'
  const formatTime = config?.userDateFormat?.time || 'HH:mm'
  const formatDateISO = 'YYYY-MM-DD'
  const formatDateTimeISO = 'YYYY-MM-DDTHH:mm:ss'

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


  const correctLocale = () => {
    const localeCode = config?.localeCode || 'en_GB.utf8'
    switch (localeCode) {
      case 'pl_PL.utf8':
        return {localeCode:pl,lang:'pl'}
      case 'hu_HU.utf8':
        return {localeCode:hu,lang:'hu'}
      case 'en_GB.utf8':
        return {localeCode:enGB,lang:'enGB'}
      default:
        return {localeCode:enGB,lang:'enGB'}
    }
  }
  const convertDate = (date: string | Date) => {
    return new Date(date)
  }

  const currentDateSql = () => {
    return date.formatDate(new Date(), formatDateISO)
  }

  const currentYear = () => {
    return format(new Date(), 'yyyy')
  }

  const time = (dateString: string) => {
    return date.formatDate(new Date(dateString), formatTime)
  }

  const humanDate = (dateString: string) => {
    return date.formatDate(new Date(dateString), formatDate)
  }

  const humanDateTime = (dateString: string | Date) => {
    return date.formatDate(new Date(dateString), formatDateTime)
  }

  const humanDateTimeSec = (dateString: string) => {
    return date.formatDate(new Date(dateString), formatDateTimeSec)
  }

  const humanDateFromTimestamp = (dateString: number) => {
    const result = fromUnixTime(dateString / 1000)
    return date.formatDate(result, formatDate)
  }
  const humanDateTimeFromTimestamp = (dateString: number) => {
    const result = fromUnixTime(dateString / 1000)
    return date.formatDate(result, formatDateTime)
  }
  const humanDateTimeSecFromTimestamp = (dateString: number) => {
    const result = fromUnixTime(dateString / 1000)
    return format(result, formatDateTimeSec)
  }

  const isDifferenceInYears = (dateString1: string | Date, dateString2: string | Date) => {
    return differenceInYears(convertDate(dateString1), convertDate(dateString2))
  }

  const subtractFromDate = (dateString: string | Date | boolean | null = null, options: Record<string, number>) => {
    return sub(dateString || new Date() as any, options)
  }

  const getDayAndTime = (dateString: string | Date, shortCutDay:boolean = false) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  
    const localize = correctLocale()
    const result = {
      day:format(date, "EEEE", {locale: localize.localeCode}),
      time: format(date, "HH:mm")
    }
    if(shortCutDay) {
      result.day = dayShortcuts[localize.lang as keyof typeof dayShortcuts][result.day]
    }
    return result
  }

  const useTimeAgo = (dateString: string | Date | boolean | null = null, options: Record<string, any>) => {
    const currentDate = new Date()
    const baseDate = sub(dateString || new Date() as any, options)
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

  const doesIncludeTime = (dateString: any) => {
    const parsedDate: Date = parseISO(dateString)
    if (isValid(parsedDate)) {
      return !isEqual(parsedDate, startOfDay(parsedDate))
    }
    return false
  }

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
    getDayAndTime
  }
}
