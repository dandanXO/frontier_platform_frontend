// ref - https://www.syncfusion.com/blogs/post/5-different-ways-to-deep-compare-javascript-objects.aspx

const isObject = (object: { [key: string]: any }) => {
  return object != null && typeof object === 'object'
}

const isObjectEqual = (
  object1: { [key: string]: any },
  object2: { [key: string]: any }
) => {
  const objKeyList1 = Object.keys(object1)
  const objKeyList2 = Object.keys(object2)

  if (objKeyList1.length !== objKeyList2.length) {
    return false
  }

  for (const key of objKeyList1) {
    const value1 = object1[key]
    const value2 = object2[key]

    const isObjects = isObject(value1) && isObject(value2)

    if (
      (isObjects && !isObjectEqual(value1, value2)) ||
      (!isObjects && value1 !== value2)
    ) {
      return false
    }
  }
  return true
}

const isEqual = (value1: any, value2: any) => {
  if (isObject(value1) && isObject(value2)) {
    return isObjectEqual(value1, value2)
  }

  return value1 === value2
}

export { isEqual }
