export default (state, data) => {
  if (!data) {
    return
  }
  Object.keys(data).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(state, key)) {
      return
    }

    if (
      data[key] !== null &&
      typeof data[key] === 'object' &&
      !Array.isArray(data[key])
    ) {
      Object.assign(state[key], data[key])
      return
    }
    state[key] = data[key]
  })
}
