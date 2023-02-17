import Konva from 'konva'
import Pica from 'pica'
import type Decimal from 'decimal.js'

const pica = Pica()

const FIT_PERCENTAGE = 0.95

export interface Point {
  x: number
  y: number
}

export interface Dimension {
  dpi: number
  pixel: { width: number; height: number }
  cm: { width: Decimal; height: Decimal }
}

export const getDelta = (n1: number, n2: number) => Math.abs(n1 - n2)

export const getDistance = (p1: Point, p2: Point) => {
  const dx = getDelta(p1.x, p2.x)
  const dy = getDelta(p1.y, p2.y)
  return Math.sqrt(dx ** 2 + dy ** 2)
}

export const getCenter = (p1: Point, p2: Point) => ({
  x: (p1.x + p2.x) / 2,
  y: (p1.y + p2.y) / 2,
})

export const setScale = (
  stage: Konva.Stage,
  newScale: number,
  onScaleChange: (v: number) => void
) => {
  const oldScale = stage.scaleX()
  const center = {
    x: stage.width() / 2,
    y: stage.height() / 2,
  }
  const relatedTo = {
    x: (center.x - stage.x()) / oldScale,
    y: (center.y - stage.y()) / oldScale,
  }
  stage.scale({ x: newScale, y: newScale })
  const newPos = {
    x: center.x - relatedTo.x * newScale,
    y: center.y - relatedTo.y * newScale,
  }
  stage.position(newPos)
  onScaleChange(newScale)
}

export const preRender = (
  source: HTMLImageElement | HTMLCanvasElement,
  downSampleScales: number[],
  downSampledCanvases: HTMLCanvasElement[]
) => {
  if (!pica) {
    throw new Error('pica undefined')
  }
  if (!downSampledCanvases.length) {
    throw new Error('down sampled canvas not existed')
  }

  downSampleScales.forEach((scale, index) => {
    const downSampledCanvas = downSampledCanvases[index]
    downSampledCanvas.width = source.width * scale
    downSampledCanvas.height = source.height * scale
  })

  return Promise.all(
    downSampledCanvases.map((downSampledCanvas) =>
      pica.resize(source, downSampledCanvas)
    )
  )
}

export const getFitScale = (
  stage: Konva.Stage,
  target: HTMLImageElement | HTMLCanvasElement,
  mul: number
) => {
  const widthScale = stage.width() / target.width / mul
  const heightScale = stage.height() / target.height / mul
  const widthOrHeightScale = widthScale > heightScale ? heightScale : widthScale
  return widthOrHeightScale * FIT_PERCENTAGE
}

export const getFitOffset = (
  stage: Konva.Stage,
  target: HTMLImageElement | HTMLCanvasElement,
  fitScale: number,
  mul: number
) => {
  return {
    x: -(stage.width() / fitScale - target.width * mul) / 2,
    y: -(stage.height() / fitScale - target.height * mul) / 2,
  }
}

export const setupStage = (
  container: HTMLDivElement,
  source: HTMLImageElement | HTMLCanvasElement,
  wheelScaleBy: number,
  onScaleChange: (v: number) => void,
  mul = 1
) => {
  Konva.hitOnDragEnabled = true
  const stage = new Konva.Stage({
    container: container,
    width: container.offsetWidth,
    height: container.offsetHeight,
    draggable: true,
  })
  stage.container().style.cursor = 'move'
  const fitScale = getFitScale(stage, source, mul)
  const fitOffset = getFitOffset(stage, source, fitScale, mul)
  stage.offset(fitOffset)
  stage.scale({ x: fitScale, y: fitScale })
  onScaleChange(fitScale)
  let lastCenter: Point | null = null
  let lastDist = 0
  stage.on('touchstart', () => {
    stage.container().style.cursor = 'move'
  })
  stage.on('touchmove', (e) => {
    e.evt.preventDefault()
    const touch1 = e.evt.touches[0]
    const touch2 = e.evt.touches[1]
    if (touch1 && touch2) {
      // if the stage was under Konva's drag&drop
      // we need to stop it, and implement our own pan logic with two pointers
      if (stage.isDragging()) {
        stage.stopDrag()
      }
      const p1 = { x: touch1.clientX, y: touch1.clientY }
      const p2 = { x: touch2.clientX, y: touch2.clientY }
      if (!lastCenter) {
        lastCenter = getCenter(p1, p2)
        return
      }
      const newCenter = getCenter(p1, p2)
      const dist = getDistance(p1, p2)
      if (!lastDist) {
        lastDist = dist
      }
      // local coordinates of center point
      const pointTo = {
        x: (newCenter.x - stage.x()) / stage.scaleX(),
        y: (newCenter.y - stage.y()) / stage.scaleX(),
      }
      const scale = stage.scaleX() * (dist / lastDist)
      stage.scaleX(scale)
      stage.scaleY(scale)
      // calculate new position of the stage
      const dx = newCenter.x - lastCenter.x
      const dy = newCenter.y - lastCenter.y
      const newPos = {
        x: newCenter.x - pointTo.x * scale + dx,
        y: newCenter.y - pointTo.y * scale + dy,
      }
      stage.position(newPos)
      lastDist = dist
      lastCenter = newCenter
    }
  })
  stage.on('touchend', function () {
    lastDist = 0
    lastCenter = null
  })
  stage.on('wheel', (e) => {
    e.evt.preventDefault()
    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()
    if (!pointer) {
      throw new Error('pointer not available')
    }
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }
    let direction = e.evt.deltaY > 0 ? -1 : 1
    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
      direction = -direction
    }
    const newScale =
      direction > 0 ? oldScale * wheelScaleBy : oldScale / wheelScaleBy
    stage.scale({ x: newScale, y: newScale })
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    }
    stage.position(newPos)
    onScaleChange(newScale)
  })

  return stage
}
