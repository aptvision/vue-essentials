import { extend } from 'quasar'

export const useCommonHelpers = () => {
  const isEmpty = (object: object) => {
    for (const i in object) {
      return false
    }
    return true
  }

  const isObject = (value: unknown) => {
    return typeof value === 'object' && value && !Array.isArray(value)
  }

  function ucfirst(str: string): string {
    return String(str).charAt(0).toUpperCase() + String(str).slice(1);
  }

  const cloneDeep = (obj: object) => {
    return extend(true,{}, obj)
  }

  return {
    isEmpty,
    isObject,
    cloneDeep,
    ucfirst,
  }
}