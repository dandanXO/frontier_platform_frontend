import { ref, toRaw, onMounted, onUnmounted } from 'vue'
import Konva from 'konva'
import cv from '@techstark/opencv-js'
import {
  getDistance,
  preRender,
  setupStage,
  setScale,
  getFitScale,
  getCenter,
} from '@/utils/perspectiveCropper'
import { pixelToCm, cmToPixel, toDP1 } from '@/utils/cropper'
import tempFilenameGenerator from '@/utils/temp-filename-generator'
import type { Ref } from 'vue'
import type { TextConfig } from 'konva/lib/shapes/Text'
import type {
  Coord,
  Dimension,
  EditStatus,
  PerspectiveCropRecord,
} from '@/types'

const DEFAULT_CROP_CM = 4
const MIN_CROP_CM = 1

const INVALID_LINE_COLOR = '#A0253A'
const INVALID_LINE_OUTER_COLOR = '#FFF'

/**
 * 設計稿上 w:56, h: 28, radius:4, fontSize: 12
 * 因 Canvas 可能會經過縮放，所以這裡透過等比例換算成大略的數字。
 * offset 則是為了因應旋轉，將旋轉點固定在物件的中心點。
 */
const textProps: TextConfig = {
  offsetX: 250,
  offsetY: 125,
  fontSize: 100,
  opacity: 0,
  width: 500,
  height: 250,
  fontFamily: 'Noto Sans TC',
  verticalAlign: 'middle',
  align: 'center',
  fill: '#F4F4F4',
}
const rectProps = {
  offsetX: 250,
  offsetY: 125,
  width: 500,
  height: 250,
  fill: 'rgb(168, 168, 168)',
  cornerRadius: 36,
  opacity: 0,
}

class PerspectiveCropper {
  sourceImage: HTMLImageElement
  sourceCanvas: HTMLCanvasElement
  sourceDimension: Dimension
  destinationImage: HTMLImageElement
  destinationCanvas: HTMLCanvasElement
  destinationDimension?: Dimension
  downSampledCanvases: HTMLCanvasElement[]
  sourceMat: cv.Mat
  stage: Konva.Stage
  layer: Konva.Layer
  displayImage: Konva.Image
  circleLeftTop: Konva.Circle
  circleRightTop: Konva.Circle
  circleLeftBottom: Konva.Circle
  circleRightBottom: Konva.Circle
  line: Konva.Line
  errorLine: Konva.Line
  leftSideInfoRect: Konva.Rect
  topSideInfoRect: Konva.Rect
  rightSideInfoRect: Konva.Rect
  bottomSideInfoRect: Konva.Rect
  leftSideInfoText: Konva.Text
  topSideInfoText: Konva.Text
  rightSideInfoText: Konva.Text
  bottomSideInfoText: Konva.Text
  restoreRecord?: PerspectiveCropRecord
  initialRecord?: PerspectiveCropRecord
  editStatus: EditStatus
  gridColor: string
  initialMargin = 0
  rotatePresets = [0, 90, 180, 270]
  rotatePresetsIndex = 0
  wheelScaleBy = 1.03
  grabbingOpacity = 0.5
  onCropStart: () => void
  onCropSuccess: () => void
  onCropError: (err: Error) => void
  onScaleChange: (v: number) => void
  onRotationChange: (v: number) => void
  onEditStatusChange: (status: EditStatus) => void
  static downSampleScales = [0.1, 0.15, 0.3, 0.5]

  static async getSourceImageWithDownSampled(imageUrl: string): Promise<{
    sourceImage: HTMLImageElement
    downSampledCanvases: HTMLCanvasElement[]
  }> {
    const downSampledCanvases = this.downSampleScales.map(() =>
      document.createElement('canvas')
    )

    return new Promise((resolve, reject) => {
      try {
        const img = new Image()
        img.src = imageUrl
        img.crossOrigin = 'anonymous'
        img.onload = async () => {
          await preRender(img, this.downSampleScales, downSampledCanvases)
          resolve({
            sourceImage: img,
            downSampledCanvases,
          })
        }
      } catch (err) {
        if (err instanceof Error) return reject(err)
      }
    })
  }

  get circles() {
    return [
      this.circleLeftTop,
      this.circleRightTop,
      this.circleRightBottom,
      this.circleLeftBottom,
    ]
  }

  get infoTexts() {
    return [
      this.leftSideInfoText,
      this.topSideInfoText,
      this.rightSideInfoText,
      this.bottomSideInfoText,
    ]
  }

  get infoRects() {
    return [
      this.leftSideInfoRect,
      this.topSideInfoRect,
      this.rightSideInfoRect,
      this.bottomSideInfoRect,
    ]
  }

  get cropPoints() {
    return this.circles.map((c) => c.getPosition())
  }

  get scale() {
    const scale = this.stage.scale()
    if (!scale) throw new Error('get scale failed, this.stage not exist')
    return scale.x
  }

  get rotateDeg() {
    return this.rotatePresets[this.rotatePresetsIndex]
  }

  set rotateDeg(deg: number) {
    const result = this.rotatePresets.findIndex(
      (presetDeg) => presetDeg === deg
    )
    if (result === -1) throw new Error('invalid deg')
    this.rotatePresetsIndex = result
  }

  get leftSideInCm() {
    return pixelToCm(
      getDistance(
        this.circleLeftTop.position(),
        this.circleLeftBottom.position()
      ),
      this.sourceDimension.dpi
    )
  }

  get topSideInCm() {
    return pixelToCm(
      getDistance(
        this.circleLeftTop.position(),
        this.circleRightTop.position()
      ),
      this.sourceDimension.dpi
    )
  }
  get rightSideInCm() {
    return pixelToCm(
      getDistance(
        this.circleRightTop.position(),
        this.circleRightBottom.position()
      ),
      this.sourceDimension.dpi
    )
  }
  get bottomSideInCm() {
    return pixelToCm(
      getDistance(
        this.circleLeftBottom.position(),
        this.circleRightBottom.position()
      ),
      this.sourceDimension.dpi
    )
  }

  constructor(
    sourceImage: HTMLImageElement,
    downSampledCanvases: HTMLCanvasElement[],
    sourceCanvasContainer: HTMLDivElement,
    destinationImage: HTMLImageElement,
    destinationCanvas: HTMLCanvasElement,
    dpi: number,
    restoreRecord: PerspectiveCropRecord | undefined,
    initialRecord: PerspectiveCropRecord | undefined,
    initialGridColor: string,
    onCropStart: () => void,
    onCropSuccess: () => void,
    onCropError: (err: Error) => void,
    onScaleChange: (v: number) => void,
    onRotationChange: (v: number) => void,
    onEditStatusChange: (status: EditStatus) => void
  ) {
    // Setup callbacks.
    this.onCropStart = onCropStart
    this.onCropSuccess = onCropSuccess
    this.onCropError = onCropError
    this.onScaleChange = onScaleChange
    this.onRotationChange = onRotationChange
    this.onEditStatusChange = onEditStatusChange

    // Setup source canvas, image and source OpenCV matrix data.
    this.downSampledCanvases = downSampledCanvases
    this.sourceImage = sourceImage
    this.sourceCanvas = document.createElement('canvas')
    const ctx = this.sourceCanvas.getContext('2d')
    if (!ctx) throw new Error('canvas context not exist')
    const { width, height } = this.sourceImage
    this.sourceCanvas.width = width
    this.sourceCanvas.height = height
    ctx.drawImage(this.sourceImage, 0, 0, width, height)
    this.sourceMat = cv.imread(this.sourceCanvas)
    if (!this.sourceMat) throw new Error('source Matrix undefined')
    this.sourceDimension = {
      dpi,
      pixel: { width: sourceImage.width, height: sourceImage.height },
      cm: {
        width: pixelToCm(sourceImage.width, dpi),
        height: pixelToCm(sourceImage.height, dpi),
      },
    }

    // Setup destination canvas.
    this.destinationCanvas = destinationCanvas
    this.destinationImage = destinationImage

    // Setup stage, layer and image.
    this.displayImage = new Konva.Image({
      x: 0,
      y: 0,
      image: sourceImage,
      width: sourceImage.width,
      height: sourceImage.height,
    })
    this.layer = new Konva.Layer()
    this.layer.add(this.displayImage)
    this.stage = setupStage(
      sourceCanvasContainer,
      sourceImage,
      this.wheelScaleBy,
      this.handleScaleChange.bind(this)
    )
    this.stage.add(this.layer)

    // Setup draggable cropper circles and line.
    this.initialRecord = initialRecord
    this.restoreRecord = restoreRecord
    this.gridColor = initialGridColor
    this.editStatus = {
      isSizeValid: true,
      isDirectionValid: true,
      isRotationDirty: false,
      isPositionsDirty: false,
    }
    const circleStyle: Partial<Konva.CircleConfig> = {
      radius: 75,
      stroke: this.gridColor,
      strokeWidth: 20,
      draggable: true,
    }

    const defaultPositions = this.getDefaultPositions()
    this.circleLeftTop = new Konva.Circle({
      ...defaultPositions.leftTop,
      ...(initialRecord && initialRecord.leftTop),
      ...circleStyle,
    })
    this.circleRightTop = new Konva.Circle({
      ...defaultPositions.rightTop,
      ...(initialRecord && initialRecord.rightTop),
      ...circleStyle,
    })
    this.circleLeftBottom = new Konva.Circle({
      ...defaultPositions.leftBottom,
      ...(initialRecord && initialRecord.leftBottom),
      ...circleStyle,
    })
    this.circleRightBottom = new Konva.Circle({
      ...defaultPositions.rightBottom,
      ...(initialRecord && initialRecord.rightBottom),
      ...circleStyle,
    })
    this.line = new Konva.Line({
      points: [
        this.circleLeftTop,
        this.circleRightTop,
        this.circleRightBottom,
        this.circleLeftBottom,
      ].flatMap((circle) => {
        const pos = circle.getPosition()
        return [pos.x, pos.y]
      }),
      stroke: this.gridColor,
      strokeWidth: 10,
      lineJoin: 'round',
      closed: true,
    })
    this.errorLine = new Konva.Line({
      visible: false,
      points: [
        this.circleLeftTop,
        this.circleRightTop,
        this.circleRightBottom,
        this.circleLeftBottom,
      ].flatMap((circle) => {
        const pos = circle.getPosition()
        return [pos.x, pos.y]
      }),
      stroke: INVALID_LINE_OUTER_COLOR,
      strokeWidth: 30,
      lineJoin: 'round',
      closed: true,
    })
    this.leftSideInfoRect = new Konva.Rect(rectProps)
    this.topSideInfoRect = new Konva.Rect(rectProps)
    this.rightSideInfoRect = new Konva.Rect(rectProps)
    this.bottomSideInfoRect = new Konva.Rect(rectProps)
    this.leftSideInfoText = new Konva.Text(textProps)
    this.topSideInfoText = new Konva.Text(textProps)
    this.rightSideInfoText = new Konva.Text(textProps)
    this.bottomSideInfoText = new Konva.Text(textProps)
    this.layer.add(this.leftSideInfoRect)
    this.layer.add(this.topSideInfoRect)
    this.layer.add(this.rightSideInfoRect)
    this.layer.add(this.bottomSideInfoRect)
    this.layer.add(this.leftSideInfoText)
    this.layer.add(this.topSideInfoText)
    this.layer.add(this.rightSideInfoText)
    this.layer.add(this.bottomSideInfoText)
    this.updateInfos()
    this.handleEditStatusChange()
    this.circles.forEach((c) => {
      c.on('dragstart', () => {
        this.stage.container().style.cursor = 'grabbing'
        const opacity = this.grabbingOpacity
        this.circles.forEach((c) => c.opacity(opacity))
        this.line.opacity(opacity)
        this.errorLine.opacity(opacity)
        this.infoTexts.forEach((i) => i.opacity(1))
        this.infoRects.forEach((i) => i.opacity(0.8))
      })
      c.on('dragmove', () => {
        const handleBoundingLimit = () => {
          c.x(Math.max(c.x(), 0))
          c.x(Math.min(c.x(), width))
          c.y(Math.max(c.y(), 0))
          c.y(Math.min(c.y(), height))
        }
        handleBoundingLimit()
        this.updateLines()
        this.updateInfos()
        this.handleEditStatusChange()
      })
      c.on('dragend', () => {
        setTimeout(() => this.cropToCanvas(), 0)
        this.stage.container().style.cursor = 'grab'
        this.circles.forEach((c) => c.opacity(1))
        this.line.opacity(1)
        this.errorLine.opacity(1)
        this.infoTexts.forEach((i) => i.opacity(0))
        this.infoRects.forEach((i) => i.opacity(0))
      })
      c.on('mouseenter', () => {
        if (c.isDragging()) return
        this.stage.container().style.cursor = 'grab'
      })
      c.on('mouseleave', () => {
        if (c.isDragging()) return
        this.stage.container().style.cursor = 'move'
      })
    })

    this.layer.add(this.errorLine)
    this.layer.add(this.line)
    this.circles.forEach((c) => this.layer.add(c))
    if (initialRecord && this.rotateDeg !== initialRecord.rotateDeg) {
      this.rotateDeg = initialRecord.rotateDeg
      this.rotate(this.rotateDeg)
    }
  }

  draw() {
    this.layer.draw()
  }

  rotate(deg: number, crop?: boolean) {
    this.rotateDeg = deg

    const image = this.displayImage
    const degToRad = Math.PI / 180

    const rotatePoint = ({ x, y }: Coord, deg: number) => {
      const rcos = Math.cos(deg * degToRad)
      const rsin = Math.sin(deg * degToRad)
      return { x: x * rcos - y * rsin, y: y * rcos + x * rsin }
    }

    // current rotation origin (0, 0) relative to desired origin - center (node.width()/2, node.height()/2)
    const topLeft = { x: -image.width() / 2, y: -image.height() / 2 }
    const current = rotatePoint(topLeft, image.rotation())
    const rotated = rotatePoint(topLeft, this.rotateDeg)
    const dx = rotated.x - current.x
    const dy = rotated.y - current.y

    this.layer.rotation(this.rotateDeg)
    this.layer.x(image.x() + dx)
    this.layer.y(image.y() + dy)

    if (crop) this.cropToCanvas()
    this.onRotationChange(this.rotateDeg)
    this.handleEditStatusChange()
  }

  setScale(newScale: number) {
    setScale(this.stage, newScale, this.handleScaleChange.bind(this))
  }

  handleScaleChange(scale: number) {
    let drawn = false
    for (let i = 0; i < this.downSampledCanvases.length; i++) {
      const downSampleScale = PerspectiveCropper.downSampleScales[i]
      const downSampledCanvas = this.downSampledCanvases[i]
      if (scale <= downSampleScale) {
        this.displayImage.image(downSampledCanvas)
        drawn = true
        break
      }
    }
    if (!drawn) this.displayImage.image(this.sourceImage)
    this.onScaleChange(scale)
  }

  handleEditStatusChange() {
    const isEqual = (p1: Coord, p2: Coord) => {
      return p1.x === p2.x && p1.y === p2.y
    }

    const isSizeValid = [
      this.leftSideInCm,
      this.topSideInCm,
      this.rightSideInCm,
      this.bottomSideInCm,
    ].every((sideInCm) => sideInCm.gte(MIN_CROP_CM))

    const isDirectionValid =
      this.circleLeftTop.position().y < this.circleLeftBottom.position().y &&
      this.circleRightTop.position().y < this.circleRightBottom.position().y &&
      this.circleLeftTop.position().x < this.circleRightTop.position().x &&
      this.circleLeftBottom.position().x < this.circleRightBottom.position().x

    if (
      this.editStatus.isSizeValid !== isSizeValid ||
      this.editStatus.isDirectionValid !== isDirectionValid
    ) {
      if (isSizeValid && isDirectionValid) {
        this.updateGridColor(this.gridColor)
        this.errorLine.visible(false)
      } else {
        this.updateGridColor(INVALID_LINE_COLOR)
        this.errorLine.visible(true)
      }
    }

    if (this.restoreRecord) {
      const isPositionsDirty = !(
        isEqual(this.circleLeftTop.position(), this.restoreRecord.leftTop) &&
        isEqual(
          this.circleLeftBottom.position(),
          this.restoreRecord.leftBottom
        ) &&
        isEqual(this.circleRightTop.position(), this.restoreRecord.rightTop) &&
        isEqual(
          this.circleRightBottom.position(),
          this.restoreRecord.rightBottom
        )
      )

      this.editStatus = {
        isSizeValid,
        isDirectionValid,
        isPositionsDirty,
        isRotationDirty: this.rotateDeg !== this.restoreRecord.rotateDeg,
      }
      this.onEditStatusChange(this.editStatus)

      return
    }

    const defaultPositions = this.getDefaultPositions()
    const isPositionsDirty = !(
      isEqual(this.circleLeftTop.position(), defaultPositions.leftTop) &&
      isEqual(this.circleLeftBottom.position(), defaultPositions.leftBottom) &&
      isEqual(this.circleRightTop.position(), defaultPositions.rightTop) &&
      isEqual(this.circleRightBottom.position(), defaultPositions.rightBottom)
    )

    this.editStatus = {
      isSizeValid,
      isDirectionValid,
      isPositionsDirty,
      isRotationDirty: this.rotateDeg !== 0,
    }
    this.onEditStatusChange(this.editStatus)
  }

  setGridColor(hex: string) {
    this.gridColor = hex
    this.updateGridColor(hex)
  }

  updateGridColor(hex: string) {
    this.line.stroke(hex)
    this.circles.forEach((c) => c.stroke(hex))
  }

  cropToCanvas() {
    this.onCropStart()
    try {
      const getDestinationWidth = (points: Coord[]) => {
        const [leftTop, rightTop, rightBottom, leftBottom] = points
        const topWidth = getDistance(leftTop, rightTop)
        const bottomWidth = getDistance(leftBottom, rightBottom)
        return Math.floor((topWidth + bottomWidth) / 2)
      }

      const getDestinationHeight = (points: Coord[]) => {
        const [leftTop, rightTop, rightBottom, leftBottom] = points
        const leftHeight = getDistance(leftTop, leftBottom)
        const rightHeight = getDistance(rightTop, rightBottom)
        return Math.floor((leftHeight + rightHeight) / 2)
      }

      const rotateLeft = (src: Coord[], n: number) => {
        const dst = src.slice()
        for (let i = 0; i < n; i++) {
          const point = dst.shift()
          if (!point) throw new Error('rotate empty array')
          dst.push(point)
        }
        return dst
      }

      const rotateRight = (src: Coord[], n: number) => {
        const dst = src.slice()
        for (let i = 0; i < n; i++) {
          const point = dst.pop()
          if (!point) throw new Error('rotate empty array')
          dst.unshift(point)
        }
        return dst
      }

      const pointsArray = this.cropPoints.flatMap((p) => [p.x, p.y])
      const rotatedPoints = rotateRight(
        this.cropPoints,
        this.rotatePresetsIndex
      )
      const destinationWidth = getDestinationWidth(rotatedPoints)
      const destinationHeight = getDestinationHeight(rotatedPoints)
      const dstPointsArray = rotateLeft(
        [
          { x: 0, y: 0 },
          { x: destinationWidth, y: 0 },
          { x: destinationWidth, y: destinationHeight },
          { x: 0, y: destinationHeight },
        ],
        this.rotatePresetsIndex
      ).flatMap((p) => [p.x, p.y])

      console.time('Perspective Transform')
      const src = toRaw(this.sourceMat)
      const dst = new cv.Mat()
      const dSize = new cv.Size(destinationWidth, destinationHeight)
      const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, pointsArray)
      const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, dstPointsArray)
      const M = cv.getPerspectiveTransform(srcTri, dstTri)
      cv.warpPerspective(
        src,
        dst,
        M,
        dSize,
        cv.INTER_LINEAR,
        cv.BORDER_CONSTANT,
        new cv.Scalar()
      )
      this.destinationCanvas.width = destinationWidth
      this.destinationCanvas.height = destinationHeight
      cv.imshow(this.destinationCanvas, dst)

      dst.delete()
      M.delete()
      srcTri.delete()
      dstTri.delete()
      console.timeEnd('Perspective Transform')

      const dpi = this.sourceDimension.dpi
      this.destinationDimension = {
        dpi,
        pixel: { width: destinationWidth, height: destinationHeight },
        cm: {
          width: pixelToCm(destinationWidth, dpi),
          height: pixelToCm(destinationHeight, dpi),
        },
      }

      this.onCropSuccess()
    } catch (err) {
      console.timeEnd('Perspective Transform')
      if (err instanceof Error) this.onCropError(err)
    }
  }

  async getCroppedImage() {
    const imageFile = await new Promise<File>((resolve, reject) => {
      this.destinationCanvas.toBlob((blob) => {
        if (!blob) return reject('no blob')
        if (this.destinationImage.src)
          URL.revokeObjectURL(this.destinationImage.src)
        this.destinationImage.src = URL.createObjectURL(blob)

        const fileName = `${tempFilenameGenerator()}.jpeg`
        resolve(new File([blob], fileName, { type: 'image/jpeg' }))
      }, 'image/jpeg')
    })

    const cropRecord: PerspectiveCropRecord = {
      leftTop: this.circleLeftTop.getPosition(),
      leftBottom: this.circleLeftBottom.getPosition(),
      rightTop: this.circleRightTop.getPosition(),
      rightBottom: this.circleRightBottom.getPosition(),
      rotateDeg: this.rotateDeg,
    }

    return { imageFile, cropRecord }
  }

  updateLines() {
    this.line.points(
      [
        this.circleLeftTop,
        this.circleRightTop,
        this.circleRightBottom,
        this.circleLeftBottom,
        this.circleLeftTop,
      ].flatMap((circle) => {
        const pos = circle.getPosition()
        return [pos.x, pos.y]
      })
    )
    this.errorLine.points(
      [
        this.circleLeftTop,
        this.circleRightTop,
        this.circleRightBottom,
        this.circleLeftBottom,
        this.circleLeftTop,
      ].flatMap((circle) => {
        const pos = circle.getPosition()
        return [pos.x, pos.y]
      })
    )
  }

  updateInfos() {
    const margin = 300
    this.leftSideInfoText.text(`${toDP1(this.leftSideInCm)} cm`)
    this.topSideInfoText.text(`${toDP1(this.topSideInCm)} cm`)
    this.rightSideInfoText.text(`${toDP1(this.rightSideInCm)} cm`)
    this.bottomSideInfoText.text(`${toDP1(this.bottomSideInCm)} cm`)
    const leftSideCenter = getCenter(
      this.circleLeftTop.position(),
      this.circleLeftBottom.position()
    )
    const topSideCenter = getCenter(
      this.circleLeftTop.position(),
      this.circleRightTop.position()
    )
    const rightSideCenter = getCenter(
      this.circleRightTop.position(),
      this.circleRightBottom.position()
    )
    const bottomSideCenter = getCenter(
      this.circleLeftBottom.position(),
      this.circleRightBottom.position()
    )

    this.leftSideInfoRect.position({
      x: leftSideCenter.x - margin,
      y: leftSideCenter.y,
    })
    this.topSideInfoRect.position({
      x: topSideCenter.x,
      y: topSideCenter.y - margin,
    })
    this.rightSideInfoRect.position({
      x: rightSideCenter.x + margin,
      y: rightSideCenter.y,
    })
    this.bottomSideInfoRect.position({
      x: bottomSideCenter.x,
      y: bottomSideCenter.y + margin,
    })

    const leftPadding = (rectProps.width - (textProps.width || 0)) / 2
    const topPadding = (rectProps.height - (textProps.height || 0)) / 2

    this.leftSideInfoText.position({
      x: this.leftSideInfoRect.position().x + leftPadding,
      y: this.leftSideInfoRect.position().y + topPadding,
    })
    this.topSideInfoText.position({
      x: this.topSideInfoRect.position().x + leftPadding,
      y: this.topSideInfoRect.position().y + topPadding,
    })
    this.rightSideInfoText.position({
      x: this.rightSideInfoRect.position().x + leftPadding,
      y: this.rightSideInfoRect.position().y + topPadding,
    })
    this.bottomSideInfoText.position({
      x: this.bottomSideInfoRect.position().x + leftPadding,
      y: this.bottomSideInfoRect.position().y + topPadding,
    })
    ;[
      this.leftSideInfoText,
      this.leftSideInfoRect,
      this.topSideInfoText,
      this.topSideInfoRect,
      this.rightSideInfoText,
      this.rightSideInfoRect,
      this.bottomSideInfoText,
      this.bottomSideInfoRect,
    ].forEach((i) => i.rotation(-this.rotateDeg))
  }

  zoomToFit() {
    const fitScale = getFitScale(this.stage, this.sourceImage, 1)
    this.stage.setPosition({ x: 0, y: 0 })
    this.stage.scale({ x: fitScale, y: fitScale })
    this.handleScaleChange(fitScale)
  }

  resetRotation() {
    this.rotate(this.restoreRecord?.rotateDeg || 0, true)
  }

  getDefaultPositions() {
    const offset = cmToPixel(
      DEFAULT_CROP_CM,
      this.sourceDimension.dpi
    ).toNumber()
    return {
      leftTop: {
        x: (this.sourceImage.width - offset) / 2,
        y: (this.sourceImage.height - offset) / 2,
      },
      rightTop: {
        x: (this.sourceImage.width + offset) / 2,
        y: (this.sourceImage.height - offset) / 2,
      },
      leftBottom: {
        x: (this.sourceImage.width - offset) / 2,
        y: (this.sourceImage.height + offset) / 2,
      },
      rightBottom: {
        x: (this.sourceImage.width + offset) / 2,
        y: (this.sourceImage.height + offset) / 2,
      },
    }
  }

  resetPosition(crop = false) {
    const defaultPositions = this.getDefaultPositions()
    this.circleLeftTop.position({
      ...defaultPositions.leftTop,
      ...(this.restoreRecord && this.restoreRecord.leftTop),
    })
    this.circleRightTop.position({
      ...defaultPositions.rightTop,
      ...(this.restoreRecord && this.restoreRecord.rightTop),
    })
    this.circleLeftBottom.position({
      ...defaultPositions.leftBottom,
      ...(this.restoreRecord && this.restoreRecord.leftBottom),
    })
    this.circleRightBottom.position({
      ...defaultPositions.rightBottom,
      ...(this.restoreRecord && this.restoreRecord.rightBottom),
    })
    this.updateLines()
    if (crop) {
      this.cropToCanvas()
    }
    this.handleEditStatusChange()
  }

  restore() {
    this.resetPosition()
    this.rotateDeg = this.restoreRecord?.rotateDeg || 0
    this.rotate(this.rotateDeg)
    this.cropToCanvas()
    this.zoomToFit()
  }

  cleanUp() {
    if (this.sourceMat) toRaw(this.sourceMat).delete()
    this.stage.destroy()
  }
}

const usePerspectiveCrop = ({
  sourceCanvasContainer,
  dpi,
  imageUrl,
  destinationCanvas,
  restoreRecord,
  initialRecord,
  initialGridColor,
  onInitStart,
  onInitEnd,
  onCropStart,
  onCropSuccess,
  onScaleChange,
  onRotationChange,
  onEditStatusChange,
  onError,
}: {
  sourceCanvasContainer: Ref<HTMLDivElement | undefined>
  dpi: number
  imageUrl: string
  destinationCanvas: Ref<HTMLCanvasElement | undefined>
  restoreRecord?: PerspectiveCropRecord
  initialRecord?: PerspectiveCropRecord
  initialGridColor: string
  onInitStart: () => void
  onInitEnd: () => void
  onCropStart: () => void
  onCropSuccess: () => void
  onScaleChange: (v: number) => void
  onRotationChange: (v: number) => void
  onEditStatusChange: (status: EditStatus) => void
  onError: (err: Error) => void
}) => {
  const destinationImage = ref<HTMLImageElement>()
  const perspectiveCropper = ref<PerspectiveCropper>()

  onMounted(() => {
    onInitStart()
    const init = async () => {
      const { sourceImage, downSampledCanvases } =
        await PerspectiveCropper.getSourceImageWithDownSampled(imageUrl)
      if (!sourceCanvasContainer.value)
        throw new Error('sourceCanvasContainer undefined')
      if (!destinationImage.value) throw new Error('destinationImage undefined')
      if (!destinationCanvas.value)
        throw new Error('destinationCanvas undefined')
      perspectiveCropper.value = new PerspectiveCropper(
        sourceImage,
        downSampledCanvases,
        sourceCanvasContainer.value,
        destinationImage.value,
        destinationCanvas.value,
        dpi,
        restoreRecord,
        initialRecord,
        initialGridColor,
        onCropStart,
        onCropSuccess,
        onError,
        onScaleChange,
        onRotationChange,
        onEditStatusChange
      )
      perspectiveCropper.value.draw()
      onInitEnd()
      perspectiveCropper.value.cropToCanvas()
    }

    try {
      let isCvReady = false
      try {
        new cv.Mat().delete()
        isCvReady = true
        // eslint-disable-next-line no-empty
      } catch {}
      if (isCvReady) {
        init()
      } else {
        cv['onRuntimeInitialized'] = init
      }
    } catch (err) {
      if (err instanceof Error) onError(err)
    }
  })

  onUnmounted(() => {
    if (!perspectiveCropper.value) return
    perspectiveCropper.value.cleanUp()
  })

  return {
    destinationCanvas,
    destinationImage,
    perspectiveCropper,
  }
}

export default usePerspectiveCrop
