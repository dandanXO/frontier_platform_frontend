const state = {
  uploadImgConfig: {
    src: '',
    binaryData: '',
    size: 0,
    dpi: 0,
    styles: {
      x: 0,
      y: 0,
      scale: 1,
      scaleX: 0,
      scaleY: 0,
      rotate: 0,
      width: 400,
      height: 400,
      initWidth: 400,
      initHeight: 400,
      imgX: 0,
      imgY: 0,
      imgWidth: 400,
      imgHeight: 400
    },
    exif: {
    }
  },
  uploadStatus: 'none'
}

const getters = {
  getUploadImgConfig (state) {
    return state.uploadImgConfig
  },
  getUploadStatus (state) {
    return state.uploadStatus
  }
}
const mutations = {
  SET_uploadImgConfig (state, config) {
    Object.assign(state.uploadImgConfig.styles, config.styles)
    delete config.styles
    Object.assign(state.uploadImgConfig, config)
  },
  UPDATE_imgProps (state, props) {
    Object.entries(props).forEach(([k, v]) => {
      state.uploadImgConfig[k] = v
    })
  },
  UPDATE_imgStyles (state, styles) {
    Object.entries(styles).forEach(([k, v]) => {
      state.uploadImgConfig.styles[k] = v
    })
  },
  UPDATE_imgPos (state, pos) {
    state.uploadImgConfig.styles.x += pos.x
    state.uploadImgConfig.styles.y += pos.y
  },
  SET_uploadStatus (state, status) {
    // none -> uploading -> done
    state.uploadStatus = status
  }
}
const actions = {
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
