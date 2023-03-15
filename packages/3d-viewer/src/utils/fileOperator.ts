/**
 * @param {string} dataURL
 * @param {string} fileName
 */

export const downloadDataURLFile = (dataURL: string, fileName = 'file') => {
  const link = document.createElement('a')
  link.hidden = true
  link.download = fileName
  link.href = dataURL
  link.text = 'downloading...'
  link.target = '_blank'

  document.body.appendChild(link)
  link.click()
  link.remove()
}
