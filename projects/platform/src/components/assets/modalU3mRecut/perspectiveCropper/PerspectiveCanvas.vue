<template>
  <v-stage ref="stageRef" :config="stageConfig">
    <v-layer><v-image :config="displayImageConfig" /></v-layer>
    <v-layer ref="layerRef" :config="layerConfig" v-if="isCropReady">
      <v-group
        :config="cropGroupConfig"
        @mouseenter="handleCropGroupMouseEnter"
        @mouseleave="handleCropGroupMouseLeave"
        @mousedown="handleCropGroupMouseDown"
        @mouseup="handleCropGroupMouseUp"
        @dragmove="handleCropGroupDragMove"
        @dragend="handleCropGroupDragEnd"
      >
        <v-line :config="invalidOuterLineConfig"></v-line>
        <v-line :config="lineConfig"></v-line>
        <v-group :config="infosGroupConfig">
          <v-group :config="leftInfoGroupConfig">
            <v-rect :config="leftInfoRectConfig"></v-rect>
            <v-text :config="leftInfoTextConfig"></v-text>
          </v-group>
          <v-group :config="topInfoGroupConfig">
            <v-rect :config="topInfoRectConfig"></v-rect>
            <v-text :config="topInfoTextConfig"></v-text>
          </v-group>
          <v-group :config="rightInfoGroupConfig">
            <v-rect :config="rightInfoRectConfig"></v-rect>
            <v-text :config="rightInfoTextConfig"></v-text>
          </v-group>
          <v-group :config="bottomInfoGroupConfig">
            <v-rect :config="bottomInfoRectConfig"></v-rect>
            <v-text :config="bottomInfoTextConfig"></v-text>
          </v-group>
        </v-group>
        <v-group>
          <v-circle
            ref="leftTopCircle"
            :config="circleLeftTopConfig"
            @mouseenter="
              handleCircleMouseEnter($event, 'leftTop', 'nwse-resize')
            "
            @mouseleave="handleCircleMouseLeave"
            @mousedown="handleCircleMouseDown($event, 'leftTop')"
            @mouseup="handleCircleMouseUp"
            @dragmove="
              handleCircleDragMove($event, circleLeftTopPosition, 'LeftTop')
            "
            @dragend="handleCircleDragEnd"
          ></v-circle>
          <v-circle
            ref="rightTopCircle"
            :config="circleRightTopConfig"
            @mouseenter="
              handleCircleMouseEnter($event, 'rightTop', 'nesw-resize')
            "
            @mouseleave="handleCircleMouseLeave"
            @mousedown="handleCircleMouseDown($event, 'rightTop')"
            @mouseup="handleCircleMouseUp"
            @dragmove="
              handleCircleDragMove($event, circleRightTopPosition, 'RightTop')
            "
            @dragend="handleCircleDragEnd"
          ></v-circle>
          <v-circle
            ref="rightBottomCircle"
            :config="circleRightBottomConfig"
            @mouseenter="
              handleCircleMouseEnter($event, 'rightBottom', 'nwse-resize')
            "
            @mouseleave="handleCircleMouseLeave"
            @mousedown="handleCircleMouseDown($event, 'rightBottom')"
            @mouseup="handleCircleMouseUp"
            @dragmove="
              handleCircleDragMove(
                $event,
                circleRightBottomPosition,
                'RightBottom'
              )
            "
            @dragend="handleCircleDragEnd"
          ></v-circle>
          <v-circle
            ref="leftBottomCircle"
            :config="circleLeftBottomConfig"
            @mouseenter="
              handleCircleMouseEnter($event, 'leftBottom', 'nesw-resize')
            "
            @mouseleave="handleCircleMouseLeave"
            @mousedown="handleCircleMouseDown"
            @mouseup="handleCircleMouseUp"
            @dragmove="
              handleCircleDragMove(
                $event,
                circleLeftBottomPosition,
                'LeftBottom'
              )
            "
            @dragend="handleCircleDragEnd"
          ></v-circle>
        </v-group>
      </v-group>
    </v-layer>
  </v-stage>
</template>

<script setup lang="ts">
import type Konva from 'konva'
import {
  ref,
  reactive,
  computed,
  onMounted,
  watch,
  toRaw,
  onUnmounted,
  toRef,
} from 'vue'
import cv from '@techstark/opencv-js'
import debounce from 'lodash/debounce'

import type { PerspectiveCropImageRecord } from '@frontier/platform-web-sdk'
import {
  getDistance,
  setupStage,
  setScale as innerSetScale,
  getDistanceInCm,
  getFitScale,
  getCenter,
  rotatePoints,
} from '@/utils/perspectiveCropper'
import { cmToPixel, toDP1, pixelToCm, getIntCoord } from '@/utils/cropper'
import type {
  Coord,
  EditStatus,
  PerspectiveCropPositions,
  PerspectiveCropRecord,
} from '@/types'
import colors from '@frontier/tailwindcss/colors'
import { THEME, isEqual } from '@frontier/lib'
import { useStore } from 'vuex'

type CircleId = 'leftTop' | 'rightTop' | 'rightBottom' | 'leftBottom'

export type GenerateCustomResultParams = Omit<
  PerspectiveCropImageRecord,
  'rotateDeg'
>

const props = defineProps<{
  container: HTMLDivElement
  sourceImage: HTMLImageElement
  downSampledCanvases: HTMLCanvasElement[]
  downSampleScales: number[]
  gridColor: string
  dpi: number
  restoreRecord: PerspectiveCropRecord | undefined
  initialRecord: PerspectiveCropRecord | undefined
  isSquare?: boolean
  isGenerateCustomResult?: boolean
}>()

const emit = defineEmits<{
  (e: 'cropStart'): void
  (
    e: 'cropSuccess',
    cropResult: {
      canvas: HTMLCanvasElement
      record: PerspectiveCropRecord
      behaviorType: 'move' | 'grab'
    }
  ): void
  (e: 'generateCustomResult', coords: GenerateCustomResultParams): void
  (e: 'cropError', err: Error): void
  (e: 'scaleChange', v: number): void
  (e: 'rotateDegChange', v: number): void
  (e: 'rotationChange', v: number): void
  (e: 'editStatusChange', status: EditStatus): void
}>()

const DEFAULT_CROP_CM = 4
const MIN_CROP_CM = 1.99
const INVALID_LINE_COLOR = colors.red[400].DEFAULT
const CIRCLE_HOVER_STROKE = colors.grey[300].DEFAULT
const WHEEL_SCALE_BY = 1.03
const store = useStore()

const previousBehaviarType = ref<'move' | 'grab'>('move')

const size = { width: 56, height: 28 }
/**
 * offset 是為了因應旋轉，將旋轉點固定在物件的中心點。
 */
const offset = {
  offsetX: size.width / 2,
  offsetY: size.height / 2,
}
const textProps: Konva.TextConfig = {
  ...size,
  ...offset,
  fontSize: 12,
  fontFamily: 'Noto Sans TC',
  verticalAlign: 'middle',
  lineHeight: 1.3,
  align: 'center',
  fill: colors.grey[900].DEFAULT,
}
const rectProps: Konva.RectConfig = {
  ...size,
  ...offset,
  fill: colors.grey[100].DEFAULT,
  cornerRadius: 4,
  opacity: 0.7,
}

const stageConfig: Konva.StageConfig = {
  container: props.container,
  width: props.container.offsetWidth,
  height: props.container.offsetHeight,
  draggable: true,
}

const cropGroupConfig = {
  draggable: true,
}

const assignPositionBasedOnSize = (size: number, firstRender?: boolean) => {
  let offset = cmToPixel(size, props.dpi).toNumber()
  const offsetMoreThanImage =
    props.sourceImage.width < offset || props.sourceImage.height < offset
  if (offsetMoreThanImage && firstRender) {
    if (props.sourceImage.width < props.sourceImage.height) {
      const cm = pixelToCm(props.sourceImage.width, props.dpi).toNumber()
      offset = cmToPixel(cm, props.dpi).toNumber()
    } else {
      const cm = pixelToCm(props.sourceImage.height, props.dpi).toNumber()
      offset = cmToPixel(cm, props.dpi).toNumber()
    }
  }

  return {
    leftTop: {
      x: (props.sourceImage.width - offset) / 2,
      y: (props.sourceImage.height - offset) / 2,
    },
    rightTop: {
      x: (props.sourceImage.width + offset) / 2,
      y: (props.sourceImage.height - offset) / 2,
    },
    leftBottom: {
      x: (props.sourceImage.width - offset) / 2,
      y: (props.sourceImage.height + offset) / 2,
    },
    rightBottom: {
      x: (props.sourceImage.width + offset) / 2,
      y: (props.sourceImage.height + offset) / 2,
    },
  }
}

const getDefaultPositions = () =>
  assignPositionBasedOnSize(DEFAULT_CROP_CM, true)

const defaultPositions = getDefaultPositions()

const sourceMat = ref<cv.Mat>()
const scale = ref<number>(1)
const isMouseInCircles = ref(false)
const isMouseInCropGroup = ref(false)
const hoverInCircle = ref<CircleId | null>(null)
const isCirclesPressing = ref(false)
const pressedInCircle = ref<CircleId | null>(null)
const isCropGroupPressing = ref(false)
const isCropReady = ref(false)

const stageRef = ref()
const leftTopCircle = ref<Konva.Circle>()
const rightTopCircle = ref<Konva.Circle>()
const rightBottomCircle = ref<Konva.Circle>()
const leftBottomCircle = ref<Konva.Circle>()

const leftInfoRectConfig = reactive({ ...rectProps })
const topInfoRectConfig = reactive({ ...rectProps })
const rightInfoRectConfig = reactive({ ...rectProps })
const bottomInfoRectConfig = reactive({ ...rectProps })
const rotateDegRef = ref(0)
const rotateDeg = computed(() => rotateDegRef.value)
const scaleInverse = computed(() => 1 / scale.value)
const infoVisible = computed(() => isCirclesPressing.value)
const imageWidthCm = computed(() =>
  pixelToCm(props.sourceImage.width, props.dpi).toNumber()
)
const imageHeightCm = computed(() =>
  pixelToCm(props.sourceImage.height, props.dpi).toNumber()
)

const displayImageConfig = computed(() => {
  {
    if (!props.sourceImage || !props.downSampledCanvases) {
      return null
    }

    let image: HTMLImageElement | HTMLCanvasElement = props.sourceImage
    for (let i = 0; i < props.downSampledCanvases.length; i++) {
      const downSampleScale = props.downSampleScales[i]
      const downSampledCanvas = props.downSampledCanvases[i]
      if (scale.value <= downSampleScale) {
        image = downSampledCanvas
        break
      }
    }
    return {
      x: 0,
      y: 0,
      rotation: 0,
      image,
      width: props.sourceImage.width,
      height: props.sourceImage.height,
    }
  }
})

const layerConfig = computed(() =>
  !displayImageConfig.value ? { x: 0, y: 0, rotation: 0 } : null
)

const infosGroupConfig = computed(() => ({
  visible: infoVisible.value,
}))

const mx = computed(() => (12.5 + 28) * scaleInverse.value)
const my = computed(() => (12.5 + 14) * scaleInverse.value)

const circleLeftTopPosition = reactive<Coord>({
  ...defaultPositions.leftTop,
  ...(props.initialRecord && props.initialRecord.leftTop),
})
const circleRightTopPosition = reactive<Coord>({
  ...defaultPositions.rightTop,
  ...(props.initialRecord && props.initialRecord.rightTop),
})
const circleRightBottomPosition = reactive<Coord>({
  ...defaultPositions.rightBottom,
  ...(props.initialRecord && props.initialRecord.rightBottom),
})
const circleLeftBottomPosition = reactive<Coord>({
  ...defaultPositions.leftBottom,
  ...(props.initialRecord && props.initialRecord.leftBottom),
})

const generateCustomResult = () => {
  store.dispatch('helper/pushModalLoading', { theme: THEME.DARK })

  /**
   * Generate largest square from crop area coordinates
   */
  const generateLargestSquare = (): GenerateCustomResultParams => {
    const xAxis = [
      circleLeftTopPosition.x,
      circleRightTopPosition.x,
      circleRightBottomPosition.x,
      circleLeftBottomPosition.x,
    ].sort((a, b) => a - b)

    const yAxis = [
      circleLeftTopPosition.y,
      circleRightTopPosition.y,
      circleRightBottomPosition.y,
      circleLeftBottomPosition.y,
    ].sort((a, b) => a - b)

    const biggestXAxis = xAxis[xAxis.length - 1]
    const biggestYAxis = yAxis[yAxis.length - 1]

    return {
      leftTop: getIntCoord({
        x: xAxis[0],
        y: yAxis[0],
      }),
      rightTop: getIntCoord({
        x: biggestXAxis,
        y: yAxis[0],
      }),
      rightBottom: getIntCoord({
        x: biggestXAxis,
        y: biggestYAxis,
      }),
      leftBottom: getIntCoord({
        x: xAxis[0],
        y: biggestYAxis,
      }),
    }
  }

  /**
   * this emits will used the largest square from crop area coordinates
   * as an input for the quilting or color balancing process.
   */
  emit('generateCustomResult', generateLargestSquare())
}

const getCoordsMap = (): PerspectiveCropImageRecord => {
  return {
    leftBottom: getIntCoord(circleLeftBottomPosition),
    rightBottom: getIntCoord(circleRightBottomPosition),
    leftTop: getIntCoord(circleLeftTopPosition),
    rightTop: getIntCoord(circleRightTopPosition),
    rotateDeg: rotateDeg.value,
  }
}

const setCoordsMap = (coordsMap: PerspectiveCropImageRecord) => {
  const positions: Record<
    Exclude<keyof PerspectiveCropImageRecord, 'rotateDeg'>,
    Coord
  > = {
    rightTop: circleRightTopPosition,
    leftTop: circleLeftTopPosition,
    leftBottom: circleLeftBottomPosition,
    rightBottom: circleRightBottomPosition,
  }

  for (const [key, position] of Object.entries(positions)) {
    position.x = coordsMap[key as keyof typeof positions].x
    position.y = coordsMap[key as keyof typeof positions].y
  }

  rotateDegRef.value = coordsMap.rotateDeg
  crop()
}
const isChanging = ref(false)

const debouncedGenerateCustomResult = debounce(generateCustomResult, 1000)

const leftSideCenter = computed(() =>
  getCenter(circleLeftTopPosition, circleLeftBottomPosition)
)
const topSideCenter = computed(() =>
  getCenter(circleLeftTopPosition, circleRightTopPosition)
)
const rightSideCenter = computed(() =>
  getCenter(circleRightTopPosition, circleRightBottomPosition)
)
const bottomSideCenter = computed(() =>
  getCenter(circleLeftBottomPosition, circleRightBottomPosition)
)

const leftSideInCm = computed(() =>
  getDistanceInCm(circleLeftTopPosition, circleLeftBottomPosition, props.dpi)
)
const topSideInCm = computed(() =>
  getDistanceInCm(circleLeftTopPosition, circleRightTopPosition, props.dpi)
)
const rightSideInCm = computed(() =>
  getDistanceInCm(circleRightTopPosition, circleRightBottomPosition, props.dpi)
)
const bottomSideInCm = computed(() =>
  getDistanceInCm(
    circleLeftBottomPosition,
    circleRightBottomPosition,
    props.dpi
  )
)

const leftInfoTextConfig = computed(() => ({
  ...textProps,
  text: `${toDP1(leftSideInCm.value)} cm`,
}))
const topInfoTextConfig = computed(() => ({
  ...textProps,
  text: `${toDP1(topSideInCm.value)} cm`,
}))
const rightInfoTextConfig = computed(() => ({
  ...textProps,
  text: `${toDP1(rightSideInCm.value)} cm`,
}))
const bottomInfoTextConfig = computed(() => ({
  ...textProps,
  text: `${toDP1(bottomSideInCm.value)} cm`,
}))

const leftInfoGroupConfig = computed(() => ({
  x: leftSideCenter.value.x - mx.value,
  y: leftSideCenter.value.y,
  scaleX: scaleInverse.value,
  scaleY: scaleInverse.value,
}))
const topInfoGroupConfig = computed(() => ({
  x: topSideCenter.value.x,
  y: topSideCenter.value.y - my.value,
  scaleX: scaleInverse.value,
  scaleY: scaleInverse.value,
}))
const rightInfoGroupConfig = computed(() => ({
  x: rightSideCenter.value.x + mx.value,
  y: rightSideCenter.value.y,
  scaleX: scaleInverse.value,
  scaleY: scaleInverse.value,
}))
const bottomInfoGroupConfig = computed(() => ({
  x: bottomSideCenter.value.x,
  y: bottomSideCenter.value.y + my.value,
  scaleX: scaleInverse.value,
  scaleY: scaleInverse.value,
}))

const editStatus = computed<EditStatus>(() => {
  const isSizeValid = [
    leftSideInCm.value,
    topSideInCm.value,
    rightSideInCm.value,
    bottomSideInCm.value,
  ].every((sideInCm) => sideInCm.gte(MIN_CROP_CM))

  const hasCrossedLines = (
    leftTop: Coord,
    rightTop: Coord,
    rightBottom: Coord,
    leftBottom: Coord
  ) => {
    const doLinesIntersect = (p1: Coord, p2: Coord, p3: Coord, p4: Coord) => {
      function orientation(a: Coord, b: Coord, c: Coord): number {
        const { x: x1, y: y1 } = a
        const { x: x2, y: y2 } = b
        const { x: x3, y: y3 } = c

        //cross product of ab x bc
        const val = (x2 - x1) * (y3 - y2) - (y2 - y1) * (x3 - x2)

        // 0 -> Collinear, you can create stright line with a, b, c coordinates
        if (val === 0) {
          return val
        }

        // 1 -> Clockwise, c beside line a and b, c position will be on the area on clockwise dirrection
        // 2 -> Counterclockwise, c beside line a and b, c position will be on the area on counter clockwise dirrection
        return val > 0 ? 1 : 2
      }

      // Check if 'point' lies on line segment `pLine1-pLine2`
      function onSegment(pLine1: Coord, pLine2: Coord, point: Coord): boolean {
        return (
          Math.min(pLine1.x, pLine2.x) <= point.x &&
          point.x <= Math.max(pLine1.x, pLine2.x) &&
          Math.min(pLine1.y, pLine2.y) <= point.y &&
          point.y <= Math.max(pLine1.y, pLine2.y)
        )
      }

      // get orientations for the four combinations of points
      const o1 = orientation(p1, p2, p3)
      const o2 = orientation(p1, p2, p4)
      const o3 = orientation(p3, p4, p1)
      const o4 = orientation(p3, p4, p2)

      return (
        //If orientations are different, lines intersect
        (o1 !== o2 && o3 !== o4) ||
        //if related points is collinear, and 'point' is between pLineA-pLineB
        // then there are intersect lines
        (o1 === 0 && onSegment(p1, p2, p3)) ||
        (o2 === 0 && onSegment(p1, p2, p4)) ||
        (o3 === 0 && onSegment(p3, p4, p1)) ||
        (o4 === 0 && onSegment(p3, p4, p2))
      )
    }

    const diagonalIntersect = doLinesIntersect(
      leftTop,
      rightTop,
      rightBottom,
      leftBottom
    )

    const oppositeIntersect = doLinesIntersect(
      leftTop,
      leftBottom,
      rightTop,
      rightBottom
    )

    return diagonalIntersect || oppositeIntersect
  }

  const isDirectionValid = !hasCrossedLines(
    circleLeftTopPosition,
    circleRightTopPosition,
    circleRightBottomPosition,
    circleLeftBottomPosition
  )

  const positionsEqualTo = (target: PerspectiveCropPositions) => {
    return (
      isEqual(circleLeftTopPosition, target.leftTop) &&
      isEqual(circleLeftBottomPosition, target.leftBottom) &&
      isEqual(circleRightTopPosition, target.rightTop) &&
      isEqual(circleRightBottomPosition, target.rightBottom)
    )
  }

  if (props.restoreRecord) {
    const isPositionsDirty = !positionsEqualTo(props.restoreRecord)
    return {
      isSizeValid,
      isDirectionValid,
      isPositionsDirty,
      isRotationDirty: rotateDeg.value !== props.restoreRecord.rotateDeg,
    }
  }

  const isPositionsDirty = !positionsEqualTo(defaultPositions)

  return {
    isSizeValid,
    isDirectionValid,
    isPositionsDirty,
    isRotationDirty: rotateDeg.value !== 0,
  }
})

const lineColor = computed(() => {
  if (!editStatus.value.isSizeValid || !editStatus.value.isDirectionValid) {
    return INVALID_LINE_COLOR
  }
  return props.gridColor
})

const circleBasedStyles = computed<Konva.CircleConfig>(() => ({
  radius: 5,
  fill: '#ffffff',
  stroke: props.gridColor,
  strokeWidth: 2,
  draggable: true,
  opacity: 0.9,
}))

const circleLeftTopConfig = computed(() => ({
  ...circleLeftTopPosition,
  ...circleBasedStyles.value,
  ...(hoverInCircle.value === 'leftTop' && {
    stroke: CIRCLE_HOVER_STROKE,
  }),
  ...(pressedInCircle.value === 'leftTop' && {
    stroke: '#ffffff',
    fill: props.gridColor,
  }),
  ...((!editStatus.value.isSizeValid || !editStatus.value.isDirectionValid) && {
    stroke: INVALID_LINE_COLOR,
    fill: '#ffffff',
  }),
  scaleX: scaleInverse.value,
  scaleY: scaleInverse.value,
}))

const circleRightTopConfig = computed(() => ({
  ...circleRightTopPosition,
  ...circleBasedStyles.value,
  ...(hoverInCircle.value === 'rightTop' && {
    stroke: CIRCLE_HOVER_STROKE,
  }),
  ...(pressedInCircle.value === 'rightTop' && {
    stroke: '#ffffff',
    fill: props.gridColor,
  }),
  ...((!editStatus.value.isSizeValid || !editStatus.value.isDirectionValid) && {
    stroke: INVALID_LINE_COLOR,
    fill: '#ffffff',
  }),
  scaleX: scaleInverse.value,
  scaleY: scaleInverse.value,
}))

const circleRightBottomConfig = computed(() => ({
  ...circleRightBottomPosition,
  ...circleBasedStyles.value,
  ...(hoverInCircle.value === 'rightBottom' && {
    stroke: CIRCLE_HOVER_STROKE,
  }),
  ...(pressedInCircle.value === 'rightBottom' && {
    stroke: '#ffffff',
    fill: props.gridColor,
  }),
  ...((!editStatus.value.isSizeValid || !editStatus.value.isDirectionValid) && {
    stroke: INVALID_LINE_COLOR,
    fill: '#ffffff',
  }),
  scaleX: scaleInverse.value,
  scaleY: scaleInverse.value,
}))

const circleLeftBottomConfig = computed(() => ({
  ...circleLeftBottomPosition,
  ...circleBasedStyles.value,
  ...(hoverInCircle.value === 'leftBottom' && {
    stroke: CIRCLE_HOVER_STROKE,
  }),
  ...(pressedInCircle.value === 'leftBottom' && {
    stroke: '#ffffff',
    fill: props.gridColor,
  }),
  ...((!editStatus.value.isSizeValid || !editStatus.value.isDirectionValid) && {
    stroke: INVALID_LINE_COLOR,
    fill: '#ffffff',
  }),
  scaleX: scaleInverse.value,
  scaleY: scaleInverse.value,
}))

const lineConfig = computed<Konva.LineConfig>(() => ({
  points: [
    circleLeftTopPosition,
    circleRightTopPosition,
    circleRightBottomPosition,
    circleLeftBottomPosition,
  ].flatMap((circleConfig) => [circleConfig.x, circleConfig.y]),
  stroke: lineColor.value,
  strokeWidth: 2,
  lineJoin: 'round',
  closed: true,
  strokeScaleEnabled: false,
}))

const invalidOuterLineConfig = computed<Konva.LineConfig>(() => ({
  points: [
    circleLeftTopPosition,
    circleRightTopPosition,
    circleRightBottomPosition,
    circleLeftBottomPosition,
  ].flatMap((circleConfig) => [circleConfig.x, circleConfig.y]),
  stroke: '#ffffff',
  strokeWidth: 4,
  lineJoin: 'round',
  closed: true,
  strokeScaleEnabled: false,
  visible: !editStatus.value.isSizeValid || !editStatus.value.isDirectionValid,
}))

const handleScaleChange = (newScale: number) => {
  scale.value = newScale
  emit('scaleChange', newScale)
}

const handleCropGroupMouseEnter = (e: Konva.KonvaEventObject<'mouseenter'>) => {
  isMouseInCropGroup.value = true
  const stage = e.target.getStage()
  if (!stage || isMouseInCircles.value) {
    return
  }
  stage.container().style.cursor = 'grab'
}

const handleCropGroupMouseLeave = (e: Konva.KonvaEventObject<'mouseleave'>) => {
  isMouseInCropGroup.value = false
  const stage = e.target.getStage()
  if (!stage || isCirclesPressing.value) {
    return
  }
  stage.container().style.cursor = isCropGroupPressing.value
    ? 'grabbing'
    : 'move'
  if (stage.container().style.cursor === 'grabbing') {
    previousBehaviarType.value = 'grab'
  } else {
    previousBehaviarType.value = 'move'
  }
}

const handleCropGroupMouseDown = (e: Konva.KonvaEventObject<'mousedown'>) => {
  const stage = e.target.getStage()
  if (!stage) {
    return
  }
  stage.container().style.cursor = 'grabbing'
  isCropGroupPressing.value = true
  if (stage.container().style.cursor === 'grabbing') {
    previousBehaviarType.value = 'grab'
  }
}

const handleCropGroupMouseUp = (e: Konva.KonvaEventObject<'mouseup'>) => {
  const stage = e.target.getStage()
  if (!stage || isCirclesPressing.value) {
    return
  }
  isCropGroupPressing.value = false
  stage.container().style.cursor = 'grab'
}

const handleCropGroupDragMove = (e: Konva.KonvaEventObject<'dragmove'>) => {
  const cropGroup = e.target
  const layer = e.target.getLayer()
  if (!layer) {
    throw new Error('layer undefined')
  }

  const circles = [
    leftTopCircle,
    rightTopCircle,
    rightBottomCircle,
    leftBottomCircle,
  ].map((c) => {
    if (!c.value) {
      return
    }
    //@ts-ignore the value exists
    return c.value.getNode()
  }) as Konva.Circle[]
  const left = circles.reduce(
    (result, c) => Math.min(c.getAbsolutePosition(layer).x, result),
    Number.POSITIVE_INFINITY
  )
  const right = circles.reduce(
    (result, c) => Math.max(c.getAbsolutePosition(layer).x, result),
    Number.NEGATIVE_INFINITY
  )
  const top = circles.reduce(
    (result, c) => Math.min(c.getAbsolutePosition(layer).y, result),
    Number.POSITIVE_INFINITY
  )
  const bottom = circles.reduce(
    (result, c) => Math.max(c.getAbsolutePosition(layer).y, result),
    Number.NEGATIVE_INFINITY
  )
  const rightSpan = right - cropGroup.x()
  const leftSpan = cropGroup.x() - left
  const topSpan = cropGroup.y() - top
  const bottomSpan = bottom - cropGroup.y()
  if (right >= props.sourceImage.width) {
    cropGroup.x(props.sourceImage.width - rightSpan)
  }
  if (left <= 0) {
    cropGroup.x(leftSpan)
  }
  if (bottom >= props.sourceImage.height) {
    cropGroup.y(props.sourceImage.height - bottomSpan)
  }
  if (cropGroup.y() - topSpan <= 0) {
    cropGroup.y(topSpan)
  }
}

const handleCropGroupDragEnd = (e: Konva.KonvaEventObject<'dragend'>) => {
  const dragGroup = e.target
  const { x: dx, y: dy } = dragGroup.position()
  dragGroup.position({ x: 0, y: 0 })
  ;[leftTopCircle, rightTopCircle, rightBottomCircle, leftBottomCircle].map(
    (c, index) => {
      if (!c.value) {
        return
      }
      //@ts-ignore the value exists
      const circle = c.value.getNode()
      const pos = circle.position()
      const newX = pos.x + dx
      const newY = pos.y + dy
      circle.position({ x: newX, y: newY })
      const targetPosition = [
        circleLeftTopPosition,
        circleRightTopPosition,
        circleRightBottomPosition,
        circleLeftBottomPosition,
      ][index]
      targetPosition.x = newX
      targetPosition.y = newY
    }
  )
  crop()

  isCropGroupPressing.value = false
  const stage = e.target.getStage()
  if (!stage) {
    return
  }
  stage.container().style.cursor = isMouseInCropGroup.value ? 'grab' : 'move'
  if (stage.container().style.cursor === 'grabbing') {
    previousBehaviarType.value = 'grab'
  } else {
    previousBehaviarType.value = 'move'
  }
}

const handleCircleMouseEnter = (
  e: Konva.KonvaEventObject<'mouseenter'>,
  circleId: CircleId,
  defaultCursorType: 'nwse-resize' | 'nesw-resize'
) => {
  isMouseInCircles.value = true
  hoverInCircle.value = circleId
  const stage = e.target.getStage()
  if (!stage) {
    return
  }
  stage.container().style.cursor = defaultCursorType
}

const handleCircleMouseLeave = (e: Konva.KonvaEventObject<'mouseleave'>) => {
  isMouseInCircles.value = false
  hoverInCircle.value = null
  const stage = e.target.getStage()
  if (!stage || isCirclesPressing.value) {
    return
  }
  stage.container().style.cursor = isMouseInCropGroup.value ? 'grab' : 'move'
  if (stage.container().style.cursor === 'grabbing') {
    previousBehaviarType.value = 'grab'
  } else {
    previousBehaviarType.value = 'move'
  }
}

const handleCircleMouseDown = (
  e: Konva.KonvaEventObject<'mousedown'>,
  circleId: CircleId
) => {
  e.cancelBubble = true
  isCirclesPressing.value = true
  pressedInCircle.value = circleId
}

const handleCircleMouseUp = (e: Konva.KonvaEventObject<'mouseup'>) => {
  e.cancelBubble = true
  isCirclesPressing.value = false
  pressedInCircle.value = null
  const stage = e.target.getStage()
  if (!stage) {
    return
  }
  if (isMouseInCircles.value) {
    return
  }
  stage.container().style.cursor = 'move'
  if (stage.container().style.cursor === 'grabbing') {
    previousBehaviarType.value = 'grab'
  } else {
    previousBehaviarType.value = 'move'
  }
}

const handleCircleDragMove = (
  e: Konva.KonvaEventObject<'dragmove'>,
  position: Coord,
  positionType: 'LeftTop' | 'RightTop' | 'RightBottom' | 'LeftBottom'
) => {
  e.cancelBubble = true

  if (props.isSquare) {
    const circle = e.target

    const points = [
      circleLeftTopPosition,
      circleRightTopPosition,
      circleRightBottomPosition,
      circleLeftBottomPosition,
    ]

    const isOutOfBounds = points.some(
      (point) =>
        point.x < 0 ||
        point.x > props.sourceImage.width ||
        point.y < 0 ||
        point.y > props.sourceImage.height
    )

    if (isOutOfBounds) {
      circle.stopDrag()
      circle.x(position.x)
      circle.y(position.y)

      return // Out Of Bounds not move point
    }

    const handleBoundingLimit = () => {
      circle.x(Math.min(props.sourceImage.width, Math.max(0, circle.x())))
      circle.y(Math.min(props.sourceImage.height, Math.max(0, circle.y())))
    }
    handleBoundingLimit()
    position.x = circle.x()
    position.y = circle.y()
    if (positionType === 'LeftTop') {
      let size = Math.max(
        Math.abs(position.x - circleRightTopPosition.x),
        Math.abs(position.y - circleLeftBottomPosition.y)
      )
      position.x = circleRightBottomPosition.x - size
      position.y = circleRightBottomPosition.y - size
      circleLeftTopPosition.x = position.x
      circleLeftTopPosition.y = position.y
      circleRightTopPosition.x = position.x + size
      circleRightTopPosition.y = position.y
      circleLeftBottomPosition.x = position.x
      circleLeftBottomPosition.y = position.y + size
    }
    if (positionType === 'RightTop') {
      let size = Math.max(
        Math.abs(position.x - circleLeftTopPosition.x),
        Math.abs(position.y - circleRightBottomPosition.y)
      )
      position.x = circleLeftBottomPosition.x + size
      position.y = circleLeftBottomPosition.y - size
      circleRightTopPosition.x = position.x
      circleRightTopPosition.y = position.y
      circleLeftTopPosition.x = position.x - size
      circleLeftTopPosition.y = position.y
      circleRightBottomPosition.x = position.x
      circleRightBottomPosition.y = position.y + size
    }
    if (positionType === 'RightBottom') {
      let size = Math.max(
        Math.abs(position.x - circleLeftBottomPosition.x),
        Math.abs(position.y - circleRightTopPosition.y)
      )
      position.x = circleLeftTopPosition.x + size
      position.y = circleLeftTopPosition.y + size
      circleRightBottomPosition.x = position.x
      circleRightBottomPosition.y = position.y
      circleRightTopPosition.x = position.x
      circleRightTopPosition.y = position.y - size
      circleLeftBottomPosition.x = position.x - size
      circleLeftBottomPosition.y = position.y
    }
    if (positionType === 'LeftBottom') {
      let size = Math.max(
        Math.abs(position.x - circleRightBottomPosition.x),
        Math.abs(position.y - circleLeftTopPosition.y)
      )
      position.x = circleRightTopPosition.x - size
      position.y = circleRightTopPosition.y + size
      circleLeftBottomPosition.x = position.x
      circleLeftBottomPosition.y = position.y
      circleLeftTopPosition.x = position.x
      circleLeftTopPosition.y = position.y - size
      circleRightBottomPosition.x = position.x + size
      circleRightBottomPosition.y = position.y
    }
  } else {
    const circle = e.target
    const handleBoundingLimit = () => {
      circle.x(Math.min(props.sourceImage.width, Math.max(0, circle.x())))
      circle.y(Math.min(props.sourceImage.height, Math.max(0, circle.y())))
    }
    handleBoundingLimit()
    position.x = circle.x()
    position.y = circle.y()
  }
}

const handleCircleDragEnd = (e: Konva.KonvaEventObject<'dragend'>) => {
  e.cancelBubble = true
  setTimeout(crop, 0)

  const stage = e.target.getStage()
  if (!stage || isMouseInCircles.value) {
    return
  }
  isCirclesPressing.value = false
  pressedInCircle.value = null
  stage.container().style.cursor = 'move'
  if (stage.container().style.cursor === 'grabbing') {
    previousBehaviarType.value = 'grab'
  } else {
    previousBehaviarType.value = 'move'
  }
}

const crop = async (init?: boolean, skipGenerateCustomResult?: boolean) => {
  emit('cropStart')

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

    const circlePoints = [
      circleLeftTopPosition,
      circleRightTopPosition,
      circleRightBottomPosition,
      circleLeftBottomPosition,
    ]
    const pointsArray = circlePoints.flatMap((p) => [p.x, p.y])

    const destinationWidth = getDestinationWidth(circlePoints)
    const destinationHeight = getDestinationHeight(circlePoints)
    const dstPointsArray = rotatePoints(
      [
        { x: 0, y: 0 },
        { x: destinationWidth, y: 0 },
        { x: destinationWidth, y: destinationHeight },
        { x: 0, y: destinationHeight },
      ],
      /**
       * We perform the rotation twice because:
       * - The first rotation aligns the result with the rotation of the cropping area
       *   (since the image output doesn't account for the cropping area's 'x' degree rotation).
       * - The second rotation ensures the image appears rotated by 'x' degrees,
       *   creating the correct perspective.
       */
      rotateDeg.value * 2
    ).flatMap((p) => [p.x, p.y])

    // console.time('Perspective Transform')
    const src = toRaw(sourceMat.value)
    if (!src) {
      throw new Error('sourceMat undefined')
    }

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

    const resultCanvas = document.createElement('canvas')
    resultCanvas.width = destinationWidth
    resultCanvas.height = destinationHeight
    cv.imshow(resultCanvas, dst)

    dst.delete()
    M.delete()
    srcTri.delete()
    dstTri.delete()
    // console.timeEnd('Perspective Transform')

    const resultRecord = {
      leftTop: circleLeftTopPosition,
      leftBottom: circleLeftBottomPosition,
      rightTop: circleRightTopPosition,
      rightBottom: circleRightBottomPosition,
      rotateDeg: rotateDeg.value,
    }

    const type = previousBehaviarType.value
    emit('cropSuccess', {
      canvas: resultCanvas,
      record: resultRecord,
      behaviorType: type,
    })
    isChanging.value = !init
    !init &&
      props.isGenerateCustomResult &&
      !skipGenerateCustomResult &&
      debouncedGenerateCustomResult()
  } catch (err) {
    // console.timeEnd('Perspective Transform')
    if (err instanceof Error) {
      emit('cropError', err)
    }
  }
}

const changeCropWidth = async (width: number) => {
  const { leftBottom, leftTop, rightBottom, rightTop } =
    assignPositionBasedOnSize(width)

  circleLeftBottomPosition.x = leftBottom.x
  circleRightBottomPosition.x = rightBottom.x
  circleRightTopPosition.x = rightTop.x
  circleLeftTopPosition.x = leftTop.x
  crop()
}

const changeCropHeight = async (height: number) => {
  const { leftBottom, leftTop, rightBottom, rightTop } =
    assignPositionBasedOnSize(height)

  circleLeftBottomPosition.y = leftBottom.y
  circleRightBottomPosition.y = rightBottom.y
  circleRightTopPosition.y = rightTop.y
  circleLeftTopPosition.y = leftTop.y
  crop()
}

onMounted(() => {
  const init = async () => {
    sourceMat.value = cv.imread(props.sourceImage)
    if (!sourceMat.value) {
      throw new Error('source Matrix undefined')
    }
    if (props.initialRecord?.rotateDeg) {
      rotateDegRef.value = props.initialRecord.rotateDeg
      emit('rotateDegChange', props.initialRecord.rotateDeg)
    }
    isCropReady.value = true
    crop(true)
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
    if (err instanceof Error) {
      emit('cropError', err)
    }
  }
})

onUnmounted(() => {
  if (sourceMat.value) {
    toRaw(sourceMat.value).delete()
  }
})

const setScale = (newScale: number) => {
  const stage = stageRef.value.getNode() as Konva.Stage
  innerSetScale(stage, newScale, handleScaleChange)
}

const zoomToFit = () => {
  if (!props.sourceImage) {
    return
  }
  const stage = stageRef.value.getNode() as Konva.Stage
  const fitScale = getFitScale(stage, props.sourceImage, 1)
  stage.setPosition({ x: 0, y: 0 })
  stage.scale({ x: fitScale, y: fitScale })
  handleScaleChange(fitScale)
}

watch([isCropReady], () => {
  if (!isCropReady.value || !props.sourceImage) {
    return
  }
  const stage = stageRef.value.getNode() as Konva.Stage
  setupStage(stage, props.sourceImage, WHEEL_SCALE_BY, handleScaleChange)
})

watch(editStatus, (newVal, oldVal) => {
  if (
    newVal.isDirectionValid === oldVal.isDirectionValid &&
    newVal.isSizeValid === oldVal.isSizeValid &&
    newVal.isPositionsDirty === oldVal.isPositionsDirty &&
    newVal.isRotationDirty === oldVal.isRotationDirty
  ) {
    return
  }
  emit('editStatusChange', editStatus.value)
})

const rotate = (deg: number, isReset?: boolean) => {
  const innerDeg = deg
  // Store the four points in an array
  let points = [
    circleLeftTopPosition,
    circleRightTopPosition,
    circleRightBottomPosition,
    circleLeftBottomPosition,
  ]

  const needChangeDeg = isReset ? 0 : innerDeg - rotateDegRef.value

  // Rotated points
  const rotatedPoints = rotatePoints(points, needChangeDeg)

  circleLeftTopPosition.x = rotatedPoints[0].x
  circleLeftTopPosition.y = rotatedPoints[0].y
  circleRightTopPosition.x = rotatedPoints[1].x
  circleRightTopPosition.y = rotatedPoints[1].y
  circleRightBottomPosition.x = rotatedPoints[2].x
  circleRightBottomPosition.y = rotatedPoints[2].y
  circleLeftBottomPosition.x = rotatedPoints[3].x
  circleLeftBottomPosition.y = rotatedPoints[3].y

  rotateDegRef.value = innerDeg
  emit('rotateDegChange', rotateDegRef.value)

  crop(isReset)
}

const resetRotation = () => {
  rotate(props.restoreRecord?.rotateDeg || 0, true)
}

const resetPositions = () => {
  Object.assign(circleLeftTopPosition, {
    ...defaultPositions.leftTop,
    ...(props.restoreRecord && props.restoreRecord.leftTop),
  })
  Object.assign(circleRightTopPosition, {
    ...defaultPositions.rightTop,
    ...(props.restoreRecord && props.restoreRecord.rightTop),
  })
  Object.assign(circleRightBottomPosition, {
    ...defaultPositions.rightBottom,
    ...(props.restoreRecord && props.restoreRecord.rightBottom),
  })
  Object.assign(circleLeftBottomPosition, {
    ...defaultPositions.leftBottom,
    ...(props.restoreRecord && props.restoreRecord.leftBottom),
  })
  crop(true)
}

const restore = () => {
  resetPositions()
  resetRotation()
  zoomToFit()
  isChanging.value = false
}

defineExpose({
  crop,
  setScale,
  zoomToFit,
  resetPositions,
  rotate,
  rotateDeg,
  resetRotation,
  restore,
  changeCropWidth,
  changeCropHeight,
  getCoordsMap,
  setCoordsMap,
  isChanging,
  imageHeightCm,
  imageWidthCm,
  generateCustomResult,
})
</script>

<style scoped></style>
