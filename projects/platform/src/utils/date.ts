import dayjs from 'dayjs'

export const toDigitalThreadDateFormat = (date: number) => {
  return dayjs.unix(date).format('MMM DD, YYYY [at] hh:mm A')
}
