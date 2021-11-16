/**
 * Common MIME types: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 */
const extension2MimeType = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}

const downloadBase64File = (base64Data, extension, fileName = 'file') => {
  const dataURL = `data:${extension2MimeType[extension]};base64,${base64Data}`
  downloadDataURLFile(dataURL, fileName)
}

const downloadDataURLFile = (dataURL, fileName = 'file') => {
  const link = document.createElement('a')
  link.hidden = true
  link.download = fileName
  link.href = dataURL
  link.text = 'downloading...'

  document.body.appendChild(link)
  link.click()
  link.remove()
}

export { downloadDataURLFile, downloadBase64File }
