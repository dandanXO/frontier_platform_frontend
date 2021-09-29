import store from '@/store'
// https://stackoverflow.com/questions/57049471/problem-to-use-vuei18n-outside-a-component
import i18n from '@/utils/i18n.js'

const { t } = i18n.global

// import EventEmitter from 'events'

const CROP_RECT_SIZE = 200

const validType = ['image/jpeg', 'image/jpg', 'image/png']

function checkImgFormat (file, em) {
  const mb = file.size / (1024 ** 2)
  if (!validType.includes(file.type)) {
    store.dispatch('helper/openModalConfirm', {
      title: t('b.uploadFailed'),
      content: t(t('err.errorImageFormat')),
      primaryText: t('b.confirm'),
      primaryHandler: async () => {
        store.dispatch('helper/closeModalConfirm')
      }
    })
    // store.commit('SET_uploadWarning', 'type')
    // store.commit('ADD_popupType', 'failed')
    // store.commit('SET_isUploading', false)
  } else if (mb > 5) {
    store.dispatch('helper/openModalConfirm', {
      title: t('b.uploadFailed'),
      content: t('err.errorExceedImageSize'),
      primaryText: t('b.confirm'),
      primaryHandler: async () => {
        store.dispatch('helper/closeModalConfirm')
      }
    })
  } else {
    const reader = new FileReader()

    reader.onload = (evt) => {
      const target = evt.target.result
      const img = new Image()
      img.src = target
      img.onload = (evt) => {
        const { width, height, src } = img
        if (width < CROP_RECT_SIZE || height < CROP_RECT_SIZE) {
          store.dispatch('helper/openModalConfirm', {
            title: t('b.uploadFailed'),
            content: t('err.errorImageTooSmall'),
            primaryText: t('b.confirm'),
            primaryHandler: async () => {
              store.dispatch('helper/closeModalConfirm')
            }
          })
          store.commit('organization/orgLogo/SET_uploadStatus', 'none')
          return
        }
        setTimeout(() => {
          store.commit('organization/orgLogo/SET_uploadStatus', 'done')
          const aspectRatio = width / height
          const resizeRatio = aspectRatio > 1 ? height / CROP_RECT_SIZE : width / CROP_RECT_SIZE
          const scaledWidth = aspectRatio > 1 ? width / resizeRatio : CROP_RECT_SIZE
          const scaledHeight = aspectRatio > 1 ? CROP_RECT_SIZE : height / (resizeRatio)
          store.commit('organization/orgLogo/SET_uploadImgConfig', {
            src,
            binaryData: '',
            size: mb,
            styles: {
              x: CROP_RECT_SIZE / 2 - scaledWidth / 2,
              y: CROP_RECT_SIZE / 2 - scaledHeight / 2,
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
class FileUtils {
  uploadImg () {
    // Because inputNode won't be appended to DOM, so we don't need to release it
    // It will be remove by JS garbage collection system sooner or later
    const inputNode = document.createElement('input')
    inputNode.setAttribute('type', 'file')
    inputNode.setAttribute('accept', '.jpg,.jpeg,.png')

    inputNode.click()
    inputNode.addEventListener('change', this.handleFileSelect, false)
    inputNode.em = this.event
  }

  onDropImg (files) {
    store.commit('SET_isUploading', true)
    checkImgFormat(files[0], this.event)
  }

  handleFileSelect (evt) {
    // store.commit('SET_isUploading', true)
    const file = evt.target.files[0]
    store.commit('organization/orgLogo/SET_uploadStatus', 'uploading')
    evt.target.removeEventListener('change', this.handleFileSelect, false)
    checkImgFormat(file, evt.currentTarget.em)
  }
}
const fileUtils = new FileUtils()

export default fileUtils
