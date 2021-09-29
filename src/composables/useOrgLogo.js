import { reactive, ref } from 'vue'

export default function useOrgLogo () {
  const uploadImgConfig = reactive({
    src: '',
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
  })

  const uploadStatus = ref('none')

  const setUploadImgConfig = (config) => {
    Object.assign(uploadImgConfig.styles, config.styles)
    delete config.styles
    Object.assign(uploadImgConfig, config)
  }

  const setUploadStatus = (status) => {
    // none -> uploading -> done
    uploadStatus.value = status
  }

  return {
    uploadImgConfig,
    uploadStatus,
    setUploadImgConfig,
    setUploadStatus
  }
}
