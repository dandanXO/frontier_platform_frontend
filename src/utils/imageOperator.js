import { EventEmitter } from 'events'
class ImageOperator {
  constructor (cropRectSize = 200) {
    this.cropRectSize = cropRectSize
    this.validType = ['image/jpeg', 'image/jpg', 'image/png']
    this.fileSizeMaxLimit = 5 // mb

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

  uploadImg () {
    // Because inputNode won't be appended to DOM, so we don't need to release it
    // It will be remove by JS garbage collection system sooner or later
    const inputNode = document.createElement('input')
    inputNode.setAttribute('type', 'file')
    inputNode.setAttribute('accept', this.validType.join(','))

    inputNode.click()
    inputNode.addEventListener('change', (evt) => {
      this.event.emit('uploading')
      this.checkImgFormat(evt.target.files[0])
    }, false)
  }

  onDropImg (evt) {
    this.event.emit('uploading')
    this.checkImgFormat(evt.dataTransfer.files[0])
  }

  checkImgFormat (file) {
    const mb = file.size / (1024 ** 2)
    if (!this.validType.includes(file.type)) {
      return this.event.emit('error', this.errorCode.INVALID_TYPE)
    } else if (mb > this.fileSizeMaxLimit) {
      return this.event.emit('error', this.errorCode.EXCEED_LIMIT)
    } else {
      const reader = new FileReader()

      reader.onload = (evt) => {
        const target = evt.target.result
        const img = new Image()
        img.src = target

        img.onload = () => {
          const { width, height, src } = img
          if (width < this.cropRectSize || height < this.cropRectSize) {
            return this.event.emit('error', this.errorCode.TOO_SMALL)
          }
          this.event.emit('finish', {
            width,
            height,
            src,
            size: mb
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }
}

export default ImageOperator
