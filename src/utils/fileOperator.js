import { EventEmitter } from 'events'

/**
 * Common MIME types: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 */
const extension2MimeType = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pdf: 'application/pdf',
  zip: 'application/zip',
  jpg: 'image/jpg',
  png: 'image/png',
  gif: 'image/gif',
  mov: 'video/quicktime',
  mp4: 'video/mp4'
}

const generalImageType = ['jpg', 'png']

/**
 * @param {string} base64Data
 * @param {string} extension
 * @param {string} fileName
 */

const downloadBase64File = (base64Data, extension, fileName = 'file') => {
  const dataURL = `data:${extension2MimeType[extension]};base64,${base64Data}`
  downloadDataURLFile(dataURL, fileName)
}

/**
 * @param {string} dataURL
 * @param {string} fileName
 */

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
class FileOperator {
  /**
   * @param {string[]} validType
   * @param {number} fileSizeMaxLimit
   */

  constructor (validType = generalImageType, fileSizeMaxLimit = 5) {
    this.validType = validType.map(type => extension2MimeType[type]).join(',')
    this.fileSizeMaxLimit = fileSizeMaxLimit // mb

    this.event = new EventEmitter()
    this.eventHash = {}
    this.errorCode = {
      INVALID_TYPE: 0,
      EXCEED_LIMIT: 1,
      TOO_SMALL: 2
    }
  }

  on (type, callback) {
    // replace origin event
    if (this.eventHash[type]) {
      this.event.off(type, this.eventHash[type])
      delete this.eventHash[type]
    }
    this.event.on(type, callback)
    this.eventHash[type] = callback
  }

  upload () {
    // Because inputNode won't be appended to DOM, so we don't need to release it
    // It will be remove by JS garbage collection system sooner or later
    const inputNode = document.createElement('input')
    inputNode.setAttribute('type', 'file')
    inputNode.setAttribute('accept', this.validType)

    inputNode.click()
    inputNode.addEventListener('change', (evt) => {
      this.event.emit('uploading')
      this.checkFileFormat(evt.target.files[0])
    }, false)
  }

  onDrop (evt) {
    this.event.emit('uploading')
    this.checkFileFormat(evt.dataTransfer.files[0])
  }

  checkFileFormat (file) {
    const mb = file.size / (1024 ** 2)
    if (!this.validType.includes(file.type)) {
      return this.event.emit('error', this.errorCode.INVALID_TYPE)
    } else if (mb > this.fileSizeMaxLimit) {
      return this.event.emit('error', this.errorCode.EXCEED_LIMIT)
    } else {
      this.event.emit('finish', file)
    }
  }
}

export { downloadDataURLFile, downloadBase64File, FileOperator }
