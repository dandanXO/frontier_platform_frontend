import Decimal from 'decimal.js'

export interface Image {
  width: number
  height: number
  src: string
}

export interface CropperConfig {
  image: Image
  dpi: number
  rotateDeg: number
  scaleRatio: number
  options: {
    x: number
    y: number
    width: number
    height: number
    initWidth: number
    initHeight: number
    imgWidth: number
    imgHeight: number
  }
}

export type SideName = 'refFaceSide' | 'refBackSide'

export interface Side {
  sideName: SideName
  config: CropperConfig
  rotateStart: number
}

export interface CropRecord {
  x: number
  y: number
  rotateDeg: number
  scaleRatio: number
}

export interface U3mCropRecord {
  squareCropRecord?: CropRecord
}

export interface MaterialImage {
  cropRecord?: CropRecord
  u3mCropRecord: U3mCropRecord
  dpi: number
}

// 1 dpi = 0.393701 pixel/cm; 1 pixel/cm = 2.54 dpi
export const PX_PER_CM = 2.54

export const pixelToCm = (pixel: number, dpi: number, dp: number = 1) =>
  new Decimal(pixel).mul(PX_PER_CM).div(dpi).toDP(dp).toNumber()

const image2Object = (url: string): Promise<Image> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image()
      img.src = url
      img.onload = () => {
        const { width, height, src } = img
        resolve({ width, height, src })
      }
    } catch (err) {
      reject(err)
    }
  })
}

class Cropper {
  src: string
  cropRectSize: number
  dpi: number
  config: CropperConfig

  constructor({
    src,
    dpi = 0,
    cropRectSize = 200,
  }: {
    src: string
    dpi: number
    cropRectSize: number
  }) {
    this.src = src
    this.cropRectSize = cropRectSize
    this.dpi = dpi
    this.config = {
      image: {
        width: 0,
        height: 0,
        src: '',
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
        imgHeight: 0,
      },
    }

    if (typeof src !== 'string') {
      this.config.image = src
      this.getConfig()
    }
  }

  async formatImage() {
    this.config.image = await image2Object(this.src)
    this.getConfig()
  }

  getConfig() {
    const { width, height } = this.config.image
    const aspectRatio = width / height
    const resizeRatio =
      aspectRatio > 1 ? height / this.cropRectSize : width / this.cropRectSize
    const scaledWidth =
      aspectRatio > 1 ? width / resizeRatio : this.cropRectSize
    const scaledHeight =
      aspectRatio > 1 ? this.cropRectSize : height / resizeRatio

    this.config.options = {
      x: this.cropRectSize / 2 - scaledWidth / 2,
      y: this.cropRectSize / 2 - scaledHeight / 2,
      width: scaledWidth,
      height: scaledHeight,
      initWidth: scaledWidth,
      initHeight: scaledHeight,
      imgWidth: scaledWidth,
      imgHeight: scaledHeight,
    }
  }
}

export { image2Object, Cropper }
