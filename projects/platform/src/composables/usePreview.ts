import { ref, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import Konva from 'konva'
import {
  setupStage,
  preRender,
  setScale,
  getFitScale,
  getFitOffset,
} from '@/utils/perspectiveCropper'

class PreviewDisplay {
  destinationCanvas: HTMLCanvasElement
  downSampledCanvases: HTMLCanvasElement[]
  stage: Konva.Stage
  layer: Konva.Layer
  previewImages: Konva.Image[] = []
  lines: Konva.Line[] = []
  gridColor: string
  showGrid = true
  wheelScaleBy = 1.03
  /**
   * The reason for adding borderBuffer(1) to the width and height is to ensure that
   * the image is not clipped at the edges, improving its display quality and integrity.
   */
  borderBuffer = 1
  onScaleChange: (v: number) => void
  static downSampleScales = [0.1, 0.15, 0.3, 0.5]

  static async getDownSampled(
    canvas: HTMLCanvasElement
  ): Promise<HTMLCanvasElement[]> {
    const downSampledCanvases = this.downSampleScales.map(() =>
      document.createElement('canvas')
    )
    await preRender(canvas, this.downSampleScales, downSampledCanvases)
    return downSampledCanvases
  }

  constructor(
    previewCanvasContainer: HTMLDivElement,
    destinationCanvas: HTMLCanvasElement,
    downSampledCanvases: HTMLCanvasElement[],
    initialGridColor: string,
    onScaleChange: (v: number) => void
  ) {
    this.onScaleChange = onScaleChange
    this.destinationCanvas = destinationCanvas
    this.downSampledCanvases = downSampledCanvases
    this.gridColor = initialGridColor

    this.layer = new Konva.Layer()
    this.drawByCanvas(this.destinationCanvas)
    this.stage = new Konva.Stage({
      container: previewCanvasContainer,
      width: previewCanvasContainer.offsetWidth,
      height: previewCanvasContainer.offsetHeight,
      draggable: true,
    })
    setupStage(
      this.stage,
      destinationCanvas,
      this.wheelScaleBy,
      this.handleScaleChange.bind(this),
      3
    )
    this.stage.add(this.layer)
    const width = destinationCanvas.width
    const height = destinationCanvas.height
    this.drawLines(width, height, this.gridColor)
  }

  drawLines = (width: number, height: number, stroke: string) => {
    const drawLine = (points: number[]) => {
      const line = new Konva.Line({
        points,
        stroke,
        strokeWidth: 2,
        closed: true,
        strokeScaleEnabled: false,
      })
      this.lines.push(line)
      this.layer.add(line)
    }
    drawLine([width, 0, width, height * 3])
    drawLine([width * 2, 0, width * 2, height * 3])
    drawLine([0, height, width * 3, height])
    drawLine([0, height * 2, width * 3, height * 2])
  }

  drawImage = (
    from: HTMLCanvasElement,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    const image = new Konva.Image({
      x,
      y,
      image: from,
      width: width + this.borderBuffer,
      height: height + this.borderBuffer,
      // here fill set to transparent to avoid konva auto fill with a color
      fill: 'rgba(255, 255, 255, 0)',
      strokeEnabled: false,
    })
    this.previewImages.push(image)
    this.layer.add(image)
  }

  drawByCanvas = (from: HTMLCanvasElement) => {
    const width = from.width
    const height = from.height

    // +---+---+---+
    // | 1 | 2 | 3 |
    // +---+---+---+
    // | 4 | 5 | 6 |
    // +---+---+---+
    // | 7 | 8 | 9 |
    // +---+---+---+
    // layer drwa order must be below
    this.drawImage(from, 0, height * 2, width, height) // draw number 7 picture
    this.drawImage(from, width, height * 2, width, height) // draw number 8 picture
    this.drawImage(from, width * 2, height * 2, width, height) // draw number 9 picture
    this.drawImage(from, 0, height, width, height) // draw number 4 picture
    this.drawImage(from, width, height, width, height) //  draw number 5 picture
    this.drawImage(from, width * 2, height, width, height) // draw number 6 picture
    this.drawImage(from, 0, 0, width, height) // draw number 1 picture
    this.drawImage(from, width, 0, width, height) // draw number 2 picture
    this.drawImage(from, width * 2, 0, width, height) // draw number 3 picture
  }

  draw() {
    this.layer.draw()
  }

  redraw(
    destinationCanvas: HTMLCanvasElement,
    downSampledCanvases: HTMLCanvasElement[]
  ) {
    this.destinationCanvas = destinationCanvas
    this.downSampledCanvases = downSampledCanvases
    this.previewImages = []
    this.lines = []
    this.layer.destroyChildren()
    this.drawByCanvas(destinationCanvas)
    /**
     * The reason for dividing by 3 is that each image above has an additional 1px,
     * but since they overlap with each other, the actual increase is only 1/3px.
     */
    this.drawLines(
      destinationCanvas.width + this.borderBuffer / 3,
      destinationCanvas.height + this.borderBuffer / 3,
      this.gridColor
    )
    this.lines.forEach((line) => line.opacity(this.showGrid ? 1 : 0))
    this.drawByScale(this.stage.scaleX())
  }

  setScale(newScale: number) {
    setScale(this.stage, newScale, this.handleScaleChange.bind(this))
  }

  drawByScale(scale: number) {
    let drawn = false
    for (let i = 0; i < this.downSampledCanvases.length; i++) {
      const downSampleScale = PreviewDisplay.downSampleScales[i]
      const downSampledCanvas = this.downSampledCanvases[i]
      if (scale <= downSampleScale) {
        this.previewImages.forEach((i) => i.image(downSampledCanvas))
        drawn = true
        break
      }
    }
    if (!drawn) {
      this.previewImages.forEach((i) => i.image(this.destinationCanvas))
    }
  }

  handleScaleChange(scale: number) {
    this.drawByScale(scale)
    this.onScaleChange(scale)
  }

  setGridColor(hex: string) {
    this.lines.forEach((line) => line.stroke(hex))
    this.gridColor = hex
  }

  toggleGrid() {
    this.lines.forEach((line) => line.opacity(this.showGrid ? 0 : 1))
    this.showGrid = !this.showGrid
    return this.showGrid
  }

  zoomToFit() {
    const fitScale = getFitScale(this.stage, this.destinationCanvas, 3)
    const fitOffset = getFitOffset(
      this.stage,
      this.destinationCanvas,
      fitScale,
      3
    )
    this.stage.setPosition({ x: 0, y: 0 })
    this.stage.scale({ x: fitScale, y: fitScale })
    this.stage.offset(fitOffset)
    this.handleScaleChange(fitScale)
  }

  cleanUp() {
    this.stage.destroy()
  }
}

const usePreview = (
  destinationCanvas: Ref<HTMLCanvasElement | undefined>,
  previewCanvasContainer: Ref<HTMLDivElement | undefined>,
  initialGridColor: string,
  onScaleChange: (v: number) => void,
  onError: (err: Error) => void
) => {
  const previewDisplay = ref<PreviewDisplay>()

  const renderPreviewDisplay = async (
    behaviorType: 'move' | 'grab' = 'move'
  ) => {
    try {
      if (!previewCanvasContainer.value) {
        return
      }
      if (!destinationCanvas.value) {
        return
      }
      const downSampled = await PreviewDisplay.getDownSampled(
        destinationCanvas.value
      )
      if (previewDisplay.value) {
        previewDisplay.value.redraw(destinationCanvas.value, downSampled)
      } else {
        previewDisplay.value = new PreviewDisplay(
          previewCanvasContainer.value,
          destinationCanvas.value,
          downSampled,
          initialGridColor,
          onScaleChange
        )
        previewDisplay.value.draw()
      }
      if (behaviorType !== 'grab') {
        previewDisplay.value.zoomToFit()
      }
    } catch (err) {
      if (err instanceof Error) {
        onError(err)
      }
    }
  }

  const loadImageToCanvas = async (imageUrl: string) => {
    if (!destinationCanvas.value) {
      console.error(`Destination Canvas not found.`)
      return
    }
    const ctx = destinationCanvas.value.getContext('2d')
    if (!ctx) {
      console.error('Canvas context not available.')
      return
    }

    const img = new Image()
    img.crossOrigin = 'anonymous' // Avoid CORS issues for external images
    const loadImage = () =>
      new Promise<void>((resolve, reject) => {
        img.onload = () => {
          if (!destinationCanvas.value) {
            console.error(`Destination Canvas not found.`)
            reject(new Error('Destination Canvas not found.'))
            return
          }
          destinationCanvas.value.width = img.width
          destinationCanvas.value.height = img.height
          ctx.drawImage(img, 0, 0)
          resolve()
        }

        img.onerror = () => {
          console.error('Failed to load the image.')
          reject(new Error('Failed to load the image.'))
        }
      })

    img.src = imageUrl
    await loadImage()
    await renderPreviewDisplay()
  }

  onUnmounted(() => {
    previewDisplay.value?.cleanUp()
  })

  return {
    previewDisplay,
    renderPreviewDisplay,
    loadImageToCanvas,
  }
}

export default usePreview
