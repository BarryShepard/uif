import { isValid, parse } from 'date-fns'

export const UX_DATE_FORMAT = 'DD/MM/YYYY'
export const UX_DATE_FNS_FORMAT = 'dd/MM/yyyy'
export const UX_DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm:ss'
export const UX_DATE_TIME_FNS_FORMAT = 'dd/MM/yyyy HH:mm:ss'
export const UX_TIME_FORMAT = 'HH:mm:ss'

export const parseUXDateValue = (
  value: string | undefined,
  format: string
): Date | null => {
  if (!value) {
    return null
  }

  const parsedDate = parse(value.trim(), format, new Date())

  return isValid(parsedDate) ? parsedDate : null
}

export const parseUXDateRangeValue = (
  value: string | undefined,
  format: string
): [Date | null, Date | null] | null => {
  if (!value) {
    return null
  }

  const [start, end] = value.split(/\s+[–-]\s+/)

  return [
    parseUXDateValue(start, format),
    parseUXDateValue(end, format)
  ]
}

export const parseUXTimeRangeValue = (
  value: string | undefined
): [string | undefined, string | undefined] => {
  if (!value) {
    return [undefined, undefined]
  }

  const [start, end] = value.split(/\s+[–-]\s+/)

  return [start?.trim(), end?.trim()]
}
