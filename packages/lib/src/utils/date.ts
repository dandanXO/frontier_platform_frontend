import dayjs from 'dayjs'

export const toStandardFormat = (date: number) => {
  return dayjs.unix(date).format('MMM DD, YYYY [at] hh:mm A')
}

export const toYYYYMMDDFormat = (date: number) => {
  return dayjs.unix(date).format('YYYY/MM/DD')
}

export const toHHMMAFormat = (date: number) => {
  return dayjs.unix(date).format('hh:mm A');
}
