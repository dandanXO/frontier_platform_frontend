export const getNameValueMap: <T extends Record<string, any>>(
  nameMap: { [Key in keyof T]: string },
  valueMap: { [Key in keyof T]: T[Key] }
) => {
  [Key in keyof T]: {
    name: string
    value: T[Key]
  }
} = (nameMap, valueMap) => {
  return Object.keys(valueMap).reduce((acc, key) => {
    const value = valueMap[key]
    return {
      ...acc,
      [key]: {
        name: nameMap[key],
        value,
      },
    }
  }, {}) as {
    [key in keyof typeof valueMap]: {
      name: string
      value: typeof valueMap[key]
    }
  }
}

export const getEnumTextValueMap: <T extends Record<string, any>>(
  enumText: { [key: number]: string },
  enumValue: { [Key in keyof T]: T[Key] }
) => {
  [Key in keyof T]: {
    text: string
    value: T[Key]
  }
} = (enumText, enumValue) => {
  return Object.entries(enumValue).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: {
        text: enumText[value],
        value,
      },
    }
  }, {}) as {
    [key in keyof typeof enumValue]: {
      text: string
      value: typeof enumValue[key]
    }
  }
}
