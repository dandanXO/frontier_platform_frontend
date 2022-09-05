const image2Object = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      const { width, height, src } = img
      resolve({ width, height, src })
    }

    img.src = url
  })
}

class Cropper {
  constructor ({ src, dpi = 0, cropRectSize = 200 }) {
    this.src = src
    this.cropRectSize = cropRectSize
    this.dpi = dpi
    this.config = {
      image: {
        width: 0,
        height: 0,
        src: ''
      },
      dpi: this.dpi,
      rotateDeg: 0,
      scaleRatio: 1,
      options: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        initWidth: 0,
        initHeight: 0,
        imgWidth: 0,
        imgHeight: 0
      }
    }

    if (typeof src !== 'string') {
      this.config.image = src
      this.getConfig()
    }
  }

  async formatImage () {
    this.config.image = await image2Object(this.src)
    this.getConfig()
  }

  getConfig () {
    const { width, height } = this.config.image
    const aspectRatio = width / height
    const resizeRatio = aspectRatio > 1 ? height / this.cropRectSize : width / this.cropRectSize
    const scaledWidth = aspectRatio > 1 ? width / resizeRatio : this.cropRectSize
    const scaledHeight = aspectRatio > 1 ? this.cropRectSize : height / (resizeRatio)

    this.config.options = {
      x: this.cropRectSize / 2 - scaledWidth / 2,
      y: this.cropRectSize / 2 - scaledHeight / 2,
      width: scaledWidth,
      height: scaledHeight,
      initWidth: scaledWidth,
      initHeight: scaledHeight,
      imgWidth: scaledWidth,
      imgHeight: scaledHeight
    }
  }
}

export { image2Object, Cropper }
