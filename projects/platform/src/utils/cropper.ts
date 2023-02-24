import Decimal from 'decimal.js'
import type { Image, Coord, CropperConfig, SquareCropRecord } from '@/types'

/**
 * 1 dpi = 0.393701 pixel/cm
 * 1 pixel/cm = 2.54 dpi
 */
export const CM_PER_INCH = 2.54

const toDP = (n: number | Decimal, dp: number) => {
  if (typeof n === 'number') {
    return new Decimal(n).toDP(dp).toNumber()
  }
  return n.toDP(dp).toNumber()
}

/**
 * 目前 Cropper 相關的 rotation、scale (cm) 等數字，
 * 無論是呈現或是傳遞給後端 API 都是處理到小數點第一位。
 */
export const toDP1 = (n: number | Decimal) => toDP(n, 1)

/**
 * 目前 Cropper 的 scale (百分比) 數字，
 * 無論是呈現或是傳遞給後端 API 都是處理到小數點第二位。
 */
export const toDP2 = (n: number | Decimal) => toDP(n, 2)

export const coordToDP1 = (coord: Coord) => ({
  x: toDP1(coord.x),
  y: toDP1(coord.y),
})

export const configToPercentScaleRecord = (
  config: CropperConfig
): SquareCropRecord => {
  const { options, rotateDeg, scaleRatio } = config
  return {
    x: toDP1(options.x),
    y: toDP1(options.y),
    rotateDeg: toDP1(rotateDeg),
    scaleRatio: toDP2(scaleRatio),
  }
}

export const pixelToCm = (pixel: number, dpi: number) =>
  new Decimal(pixel).div(dpi).mul(CM_PER_INCH)

export const cmToPixel = (cm: number, dpi: number) =>
  new Decimal(cm).div(CM_PER_INCH).mul(dpi)

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
