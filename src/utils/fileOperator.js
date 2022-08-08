import { EventEmitter } from 'events'
import i18n from '@/utils/i18n'
import store from '@/store'
import { UPLOAD_ERROR_CODE } from '@/utils/constants.js'

const t = i18n.global.t

/**
 * Common MIME types: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 */
const extension2MimeType = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pdf: 'application/pdf',
  zip: 'application/zip,application/octet-stream,application/x-zip-compressed,multipart/x-zip',
  jpeg: 'image/jpeg',
  jpg: 'image/jpg',
  png: 'image/png',
  gif: 'image/gif',
  mov: 'video/quicktime',
  mp4: 'video/mp4'
}

const generalImageType = ['jpg', 'jpeg', 'png']

/**
 * @param {string} base64Data
 * @param {string} extension
 * @param {string} fileName
 */
const downloadBase64File = (base64Data, extension, fileName = 'file') => {
  const dataURL = `data:${extension2MimeType[extension]};base64,${base64Data}`
  downloadDataURLFile(dataURL, fileName)
}

const dataUrlToBlob = (dataUrl) => {
  const byteString = atob(dataUrl.split(',')[1])

  const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0]

  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeString })
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
  link.target = '_blank'

  document.body.appendChild(link)
  link.click()
  link.remove()
}

/**
 * 
 * @param {number} bytes 
 * @returns {string} size
 */
const bytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

/**
 * @param {object | string} file 
 */
const previewFile = (file) => {
  const a = document.createElement('A')
  a.hidden = true
  a.target = '_blank'
  // A File object is a Blob object with a name attribute, which is a string
  a.href = typeof file.name === 'string' ? URL.createObjectURL(file) : file
  a.click()
  a.remove()
}

class FileOperator {
  /**
   * @param {string[]} validType
   * @param {number} fileSizeMaxLimit // mb
   */

  constructor (validType = generalImageType, fileSizeMaxLimit = 5, useNewErrorHandler = false) {
    this.validType = validType
    this.acceptedExtension = validType.map(type => `.${type}`).join(',')
    this.acceptedFormat = validType.map(type => extension2MimeType[type]).join(',')
    this.fileSizeMaxLimit = fileSizeMaxLimit
    this.useNewErrorHandler = useNewErrorHandler

    this.event = new EventEmitter()
    this.eventHash = {}
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

  upload (multiple = false) {
    // Because inputNode won't be appended to DOM, so we don't need to release it
    // It will be remove by JS garbage collection system sooner or later
    const inputNode = document.createElement('input')
    inputNode.setAttribute('type', 'file')
    inputNode.setAttribute('accept', this.acceptedExtension)

    if (multiple) {
      inputNode.setAttribute('multiple', 'multiple')
    }

    inputNode.click()
    inputNode.addEventListener('change', (evt) => {
      this.event.emit('uploading')
      this.validateFiles(evt.target.files)
    }, false)
  }

  onDrop (evt) {
    this.event.emit('uploading')
    this.validateFiles(evt.dataTransfer.files)
  }

  validateFiles (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const mb = file.size / (1024 ** 2)
      const type = file.type

      if (!this.acceptedFormat.includes(type) || !type) {
        this.useNewErrorHandler
          ? this.event.emit('selfDefinedError', UPLOAD_ERROR_CODE.INVALID_TYPE)
          : this.errorHandler(UPLOAD_ERROR_CODE.INVALID_TYPE)
        return
      } else if (mb > this.fileSizeMaxLimit) {
        this.useNewErrorHandler
          ? this.event.emit('selfDefinedError', UPLOAD_ERROR_CODE.EXCEED_LIMIT)
          : this.errorHandler(UPLOAD_ERROR_CODE.EXCEED_LIMIT)
        return
      }
    }

    Array.from(files).forEach(file => this.uploadHandler(file))
  }

  uploadHandler (file) {
    this.event.emit('finish', file)
  }

  errorHandler (code) {
    const { INVALID_TYPE, EXCEED_LIMIT, TOO_SMALL } = UPLOAD_ERROR_CODE
    this.event.emit('selfDefinedError', code)
    switch (code) {
      case INVALID_TYPE:
        store.dispatch('helper/pushModalConfirm', {
          type: 3,
          header: t('RR0143'),
          contentText: t('RR0144'),
          primaryBtnText: t('UU0031')
        })
        break
      case EXCEED_LIMIT:
        store.dispatch('helper/pushModalConfirm', {
          type: 3,
          header: t('RR0143'),
          contentText: t('RR0145') + this.fileSizeMaxLimit + 'MB',
          primaryBtnText: t('UU0031')
        })
        break
      case TOO_SMALL:
        store.dispatch('helper/pushModalConfirm', {
          type: 3,
          header: t('RR0143'),
          contentText: t('WW0018'),
          primaryBtnText: t('UU0031')
        })
        break
    }
  }
}

class ImageOperator extends FileOperator {
  constructor (validType, fileSizeMaxLimit, cropRectSize = 200) {
    super(validType, fileSizeMaxLimit)
    this.cropRectSize = cropRectSize
  }

  uploadHandler (file) {
    const reader = new FileReader()

    reader.onload = (evt) => {
      const target = evt.target.result
      const img = new Image()
      img.src = target

      img.onload = () => {
        const { width, height, src } = img
        if (width < this.cropRectSize || height < this.cropRectSize) {
          return this.errorHandler(UPLOAD_ERROR_CODE.TOO_SMALL)
        }
        this.event.emit('finish', {
          width,
          height,
          src,
          file
        })
      }
    }
    reader.readAsDataURL(file)
  }
}

export { dataUrlToBlob, downloadDataURLFile, downloadBase64File, FileOperator, ImageOperator, bytesToSize, previewFile }
