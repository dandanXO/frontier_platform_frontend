export const emailFormat = (v: string | null | undefined) => {
  if (v == null) {
    return false
  }
  return /.+@.+/gi.test(v)
}

export const required = (v: unknown) => {
  if (v == null || v == undefined) {
    return false
  }
  if (Array.isArray(v)) {
    return v.length !== 0
  }
  if (typeof v === 'object') {
    return Object.keys(v).length !== 0
  }
  if (typeof v === 'string') {
    return v.length !== 0
  }

  return true
}

export const maxLength = (v: string | null | undefined, max: number) => {
  if (v == null || v == undefined) {
    return true
  }

  return v.length <= max
}

export const maxIntegerDecimal = (
  maxInteger: number,
  maxDecimal: number,
  v: number | null | undefined
) => {
  if (v == null || v == undefined) {
    return true
  }

  if (typeof v !== 'number') {
    return false
  }

  const [integer, decimal] = String(v).split('.')

  if (integer !== undefined && integer.length > maxInteger) {
    return false
  }
  if (decimal !== undefined && decimal.length > maxDecimal) {
    return false
  }

  return true
}

const inputValidator = { emailFormat, required, maxLength, maxIntegerDecimal }

export { inputValidator }
