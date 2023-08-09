// ref - https://www.syncfusion.com/blogs/post/5-different-ways-to-deep-compare-javascript-objects.aspx

const isObject = (object) => {
  return object != null && typeof object === 'object'
}

const isObjectEqual = (object1, object2) => {
  const objKeys1 = Object.keys(object1)
  const objKeys2 = Object.keys(object2)

  if (objKeys1.length !== objKeys2.length) {
    return false
  }

  for (var key of objKeys1) {
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

const isEqual = (value1, value2) => {
  if (isObject(value1) && isObject(value2)) {
    return isObjectEqual(value1, value2)
  }

  return value1 === value2
}

export default isEqual
