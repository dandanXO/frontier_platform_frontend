import store from '@/store'
// https://stackoverflow.com/questions/57049471/problem-to-use-vuei18n-outside-a-component
import i18n from '@/utils/i18n.js'

const { t } = i18n.global

class ImageOperator {
  constructor (cropRectSize = 200) {
    this.cropRectSize = cropRectSize
    this.validType = ['image/jpeg', 'image/jpg', 'image/png']
    this.fileSizeMaxLimit = 5 // mb
  }

  uploadImg () {
    // Because inputNode won't be appended to DOM, so we don't need to release it
    // It will be remove by JS garbage collection system sooner or later
    const inputNode = document.createElement('input')
    inputNode.setAttribute('type', 'file')
    inputNode.setAttribute('accept', this.validType.join(','))

    inputNode.click()
    inputNode.addEventListener('change', this.handleFileSelect.bind(this), false)
  }

  handleFileSelect (evt) {
    const file = evt.target.files[0]
    store.commit('helper/uploadImage/SET_uploadStatus', 'uploading')
    this.checkImgFormat(file)

    evt.target.removeEventListener('change', this.handleFileSelect, false)
  }

  onDropImg (evt) {
    const file = evt.dataTransfer.files[0]
    store.commit('helper/uploadImage/SET_uploadStatus', 'uploading')
    this.checkImgFormat(file)
  }

  checkImgFormat (file) {
    const mb = file.size / (1024 ** 2)
    if (!this.validType.includes(file.type)) {
      store.dispatch('helper/pushModalConfirm', {
        title: t('b.uploadFailed'),
        content: t(t('err.errorImageFormat')),
        primaryText: t('b.confirm')
      })
      store.commit('helper/uploadImage/SET_uploadStatus', 'none')
    } else if (mb > this.fileSizeMaxLimit) {
      store.dispatch('helper/pushModalConfirm', {
        title: t('b.uploadFailed'),
        content: t('err.errorExceedImageSize'),
        primaryText: t('b.confirm')
      })
      store.commit('helper/uploadImage/SET_uploadStatus', 'none')
    } else {
      const reader = new FileReader()

      reader.onload = (evt) => {
        const target = evt.target.result
        const img = new Image()
        img.src = target
        img.onload = (evt) => {
          const { width, height, src } = img
          if (width < this.cropRectSize || height < this.cropRectSize) {
            store.dispatch('helper/pushModalConfirm', {
              title: t('b.uploadFailed'),
              content: t('err.errorImageTooSmall'),
              primaryText: t('b.confirm')
            })
            store.commit('helper/uploadImage/SET_uploadStatus', 'none')
            return
          }
          setTimeout(() => {
            store.commit('helper/uploadImage/SET_uploadStatus', 'done')
            const aspectRatio = width / height
            const resizeRatio = aspectRatio > 1 ? height / this.cropRectSize : width / this.cropRectSize
            const scaledWidth = aspectRatio > 1 ? width / resizeRatio : this.cropRectSize
            const scaledHeight = aspectRatio > 1 ? this.cropRectSize : height / (resizeRatio)
            store.commit('helper/uploadImage/SET_uploadImgConfig', {
              src,
              binaryData: '',
              size: mb,
              styles: {
                x: this.cropRectSize / 2 - scaledWidth / 2,
                y: this.cropRectSize / 2 - scaledHeight / 2,
                width: scaledWidth,
                height: scaledHeight,
                initWidth: scaledWidth,
                initHeight: scaledHeight,
                imgWidth: scaledWidth,
                imgHeight: scaledHeight
              }
            })
          }, 1000)
        }
      }
      reader.readAsDataURL(file)
    }
  }
}

export default ImageOperator
