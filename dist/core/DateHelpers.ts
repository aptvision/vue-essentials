import { ref } from 'vue'
import { format, differenceInYears, fromUnixTime, sub, isValid, parseISO, isEqual, startOfDay, formatDistance } from 'date-fns'
import { date } from 'quasar'
import { pl, hu, enGB } from 'date-fns/locale' // INFO: hardoced-locale-codes from date fns, you can add another in future
import { IDateHelpersConfig } from '../types/DateHelpersInterface'

export function useDateHelpers (config?:IDateHelpersConfig) {
  const formatDate = config?.userDateFormat?.date || 'YYYY/MM/DD'
  const formatDateTime = config?.userDateFormat?.dateTime || 'YYYY/MM/DD HH:mm'
  const formatDateTimeSec = config?.userDateFormat?.dateTimeSec || 'YYYY/MM/DD HH:mm:ss'
  const formatTime = config?.userDateFormat?.time || 'HH:mm'
  const formatDateISO = 'YYYY-MM-DD'
  const formatDateTimeISO = 'YYYY-MM-DDTHH:mm:ss'

  const correctLocale = () => {
    const localeCode = config?.localeCode || 'en_GB.utf8'
    switch (localeCode) {
      case 'pl_PL.utf8':
        return pl
      case 'hu_HU.utf8':
        return hu
      case 'en_GB.utf8':
        return enGB
      default:
        return enGB
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

  const useTimeAgo = (dateString: string | Date | boolean | null = null, options: Record<string, any>) => {
    const currentDate = new Date()
    const baseDate = sub(dateString || new Date() as any, options)
    return formatDistance(
      baseDate,
      currentDate,
      { addSuffix: true, locale: correctLocale(), ...options }
    )
  }

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
    currentDateSql
    // typeOptions,
    // relativeDateOptions,
  }
}
