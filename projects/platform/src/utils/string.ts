export const isCaseInsensitiveMatch = (target: string, searchText: string) => {
  return target.toLowerCase().includes(searchText.toLowerCase())
}
