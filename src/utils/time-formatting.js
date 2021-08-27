const unixToDate = (unixTimestamp) => {
  return new Date(Number(unixTimestamp) * 1000).toISOString().slice(0, 10).replace(/-/g, '/')
}

export { unixToDate }
