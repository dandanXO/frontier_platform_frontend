export function removeCommas(str: string): string {
  return str.replace(/,/g, '')
}

export function limitTo10Chars(str: string): string {
  return str.slice(0, 10)
}

export function limitTo15Chars(str: string): string {
  return str.slice(0, 15)
}

export function limitTo50Chars(str: string): string {
  return str.slice(0, 50)
}

export function limitTo500Chars(str: string): string {
  return str.slice(0, 500)
}
