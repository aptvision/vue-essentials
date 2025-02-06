function htmlSpecialCharsDecode (str: string) {
  const textArea = document.createElement('textarea')
  textArea.innerHTML = str
  return textArea.value
}

export const useTranslate = (localeCode: string, translations: Record<string, Record<string, string>>) => (msg: string, params: Record<string, string> = {}) => {
  const locale = localeCode
  let outputMsg = typeof translations[locale]?.[msg] !== 'undefined' ? translations[locale][msg] : msg
  for (const key in params) {
    outputMsg = outputMsg.replace(new RegExp('{ *' + key + ' *}', 'g'), params[key])
  }
  return htmlSpecialCharsDecode(outputMsg)
}
