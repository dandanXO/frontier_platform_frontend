import { EventEmitter } from 'events'
import { UPLOAD_ERROR_CODE, NATIVE_EXTENSION, EXTENSION } from '../constants'
import JSZip from 'jszip'

export interface UnzippedFile {
  file: JSZip.JSZipObject
  isDir: boolean
  path: string
  content: string
  extension: EXTENSION
}

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
  mp4: 'video/mp4',
  json: 'application/json',
}

const generalImageType = ['jpg', 'jpeg', 'png'] as NATIVE_EXTENSION[]

const downloadBase64File = (
  base64Data: string,
  extension: NATIVE_EXTENSION,
  fileName = 'file'
) => {
  const dataURL = `data:${extension2MimeType[extension]};base64,${base64Data}`
  downloadDataURLFile(dataURL, fileName)
}

const dataUrlToBlob = (dataUrl: string) => {
  const byteString = atob(dataUrl.split(',')[1])

  const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0]

  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeString })
}

const downloadFile = async (url: string, fileName = 'file') => {
  const link = document.createElement('a')
  link.hidden = true
  link.download = decodeURIComponent(fileName)
  link.href = url
  link.text = 'downloading...'
  link.target = '_blank'

  document.body.appendChild(link)
  link.click()
  link.remove()
}

const downloadDataURLFile = async (dataUrl: string, fileName = 'file') => {
  const response = await fetch(dataUrl)
  const blobImage = await response.blob()
  const href = URL.createObjectURL(blobImage)
  downloadFile(href, fileName)
  window.URL.revokeObjectURL(href)
}

const bytesToSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) {
    return '0 Byte'
  }
  const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))))
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

const previewFile = (file: Blob | string) => {
  const a = document.createElement('A') as HTMLLinkElement
  a.hidden = true
  a.target = '_blank'
  // A File object is a Blob object with a name attribute, which is a string
  a.href = typeof file.name === 'string' ? URL.createObjectURL(file) : file
  a.click()
  a.remove()
}

const unzip = async (zipFile: File, parseExtensionTypeList: EXTENSION[]) => {
  const zip = new JSZip()
  const zipData = await zip.loadAsync(zipFile)

  return (await Promise.all(
    Object.values(zipData.files).map(async (file) => {
      let extension: EXTENSION = EXTENSION.FOLDER
      const isDir = file.dir
      if (!isDir) {
        const pathSplitList = file.name.split('.')
        const pathSplitLength = pathSplitList.length
        extension = pathSplitList[pathSplitLength - 1] as EXTENSION
      }

      let content = null
      if (parseExtensionTypeList.includes(extension)) {
        content = await file.async('string')
      }

      return {
        file,
        content,
        extension,
      }
    })
  )) as UnzippedFile[]
}

const getFileExtension = (filename: string) => {
  const parts = filename.split('.')
  return parts[parts.length - 1]
}

const getFileNameExcludeExtension = (filename: string) => {
  const parts = filename.split('.')
  return parts.slice(0, parts.length - 1).join('.')
}

class FileOperator {
  validType: EXTENSION[]
  acceptedExtension: string
  fileSizeMaxLimit: number
  event: EventEmitter
  eventHash: { [key: string]: any } = {}

  constructor(
    validType: EXTENSION[] = generalImageType,
    fileSizeMaxLimit = 20971520
  ) {
    this.validType = validType
    this.acceptedExtension = validType.map((type) => `.${type}`).join(',')
    this.fileSizeMaxLimit = fileSizeMaxLimit

    this.event = new EventEmitter()
    this.eventHash = {}
  }

  on(type: string, callback: any) {
    // replace origin event
    if (this.eventHash[type]) {
      this.event.off(type, this.eventHash[type])
      delete this.eventHash[type]
    }
    this.event.on(type, callback)
    this.eventHash[type] = callback
  }

  upload(multiple = false) {
    // Because inputNode won't be appended to DOM, so we don't need to release it
    // It will be remove by JS garbage collection system sooner or later
    const inputNode = document.createElement('input')
    inputNode.setAttribute('data-cy', 'upload-btn')
    inputNode.setAttribute('type', 'file')
    inputNode.setAttribute('accept', this.acceptedExtension)
    if (multiple) {
      inputNode.setAttribute('multiple', 'multiple')
    }

    // For E2E test
    inputNode.style.display = 'none'
    document.body.appendChild(inputNode)

    inputNode.click()
    inputNode.addEventListener(
      'change',
      (evt: Event) => {
        this.event.emit('uploading')
        const target = evt.target as HTMLInputElement
        const files = target.files
        files && this.validateFiles(files)
        document.body.removeChild(inputNode)
      },
      false
    )
  }

  onDrop(evt: DragEvent) {
    this.event.emit('uploading')
    this.validateFiles(evt!.dataTransfer!.files)
  }

  validateFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (file.size > this.fileSizeMaxLimit) {
        this.event.emit('error', UPLOAD_ERROR_CODE.EXCEED_LIMIT)
        return
      }
    }

    Array.from(files).forEach((file) => this.uploadHandler(file))
  }

  uploadHandler(file: File) {
    this.event.emit('finish', file)
  }
}

class ImageOperator extends FileOperator {
  cropRectSize: number

  constructor(
    validType: NATIVE_EXTENSION[],
    fileSizeMaxLimit: number,
    cropRectSize = 200
  ) {
    super(validType, fileSizeMaxLimit)
    this.cropRectSize = cropRectSize
  }

  uploadHandler(file: File) {
    const reader = new FileReader()

    reader.onload = (evt) => {
      const target = evt!.target!.result
      const img = new Image()
      img.src = target

      img.onload = () => {
        const { width, height, src } = img
        if (width < this.cropRectSize || height < this.cropRectSize) {
          this.event.emit('error', UPLOAD_ERROR_CODE.TOO_SMALL)
          return
        }
        this.event.emit('finish', {
          width,
          height,
          src,
          file,
        })
      }
    }
    reader.readAsDataURL(file)
  }
}

export {
  dataUrlToBlob,
  downloadFile,
  downloadDataURLFile,
  downloadBase64File,
  FileOperator,
  ImageOperator,
  bytesToSize,
  previewFile,
  getFileExtension,
  getFileNameExcludeExtension,
  unzip,
}
