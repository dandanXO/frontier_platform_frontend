<template lang="pug">
div(class="cropped-image" :style="rotateStyle")
  div(:style="previewScaleStyles")
    div(:style="styleObject")
      div(:style="scaleStyle")
        img(
          ref="body"
          draggable="false"
          class="w-full h-full"
          :class="{'opacity-30': isTransparent}"
          :src="config.image.src"
          @mousedown.left.stop="moveStart"
        )
        template(v-if="scaleControl")
          div(
            v-for="(scaler, index)  in scalers"
            class="controller-point absolute bg-black-500"
            :key="index"
            :style="Object.assign(scaler, cursorStyle(index, 0))"
            @mousedown.stop="scaleStart"
          )
</template>

<script>
import { ref, computed, reactive } from 'vue'

export default {
  name: 'CroppedImage',
  props: {
    config: {
      type: Object,
      required: true
    },
    previewScaleRatio: {
      // only use in U3M
      type: Number,
      default: 1
    },
    movable: {
      type: Boolean,
      default: true
    },
    isTransparent: {
      type: Boolean,
      default: false
    },
    scaleControl: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update'],
  setup (props, { emit }) {
    const body = ref(null)
    const { options } = reactive(props.config)
    const initialPos = { x: 0, y: 0 }
    const initImgPos = { x: 0, y: 0 }
    const initialWH = { width: 0, height: 0 }
    const control = { xSign: 1, ySign: 1, isHorizon: false }
    const center = { x: 0, y: 0 }

    const styleObject = computed(() => {
      const { x, y, width, height } = options
      return {
        transform: `translate(${x}px, ${y}px)`,
        width: `${width}px`,
        height: `${height}px`
      }
    })

    const scaleStyle = computed(() => {
      return {
        transform: `scale(${props.config.scaleRatio}`
      }
    })

    const rotateStyle = computed(() => {
      return {
        transform: `rotate(${props.config.rotateDeg}deg)`
      }
    })

    const previewScaleStyles = computed(() => {
      return {
        transform: `
          scale(${props.previewScaleRatio}`
      }
    })

    const getMouseAbsPoint = (e) => {
      return { x: e.clientX, y: e.clientY }
    }

    const getMouseRelPoint = (e, target) => {
      const x = e.clientX - target.x
      const y = e.clientY - target.y
      return { x, y }
    }

    const getRectCenter = (rect) => {
      return {
        x: rect.left + rect.width / 2 - window.pageXOffset,
        y: rect.top + rect.height / 2 - window.pageYOffset
      }
    }

    const getNoRotationPos = (vectClient, center, rotation) => {
      return {
        x: vectClient.x * Math.cos(-rotation) - vectClient.y * Math.sin(-rotation) + center.x,
        y: vectClient.y * Math.cos(-rotation) + vectClient.x * Math.sin(-rotation) + center.y
      }
    }

    const getRotatedOffset = (offset) => {
      return {
        x: offset.x * cos(-props.config.rotateDeg) - offset.y * sin(-props.config.rotateDeg),
        y: offset.x * sin(-props.config.rotateDeg) + offset.y * cos(-props.config.rotateDeg)
      }
    }

    const cos = (angle) => {
      const angleInRad = angle / 180 * Math.PI
      return Math.cos(angleInRad)
    }

    const sin = (angle) => {
      const angleInRad = angle / 180 * Math.PI
      return Math.sin(angleInRad)
    }

    /**
     * Move Handler: moveStart、moving、moveEnd
     */
    const moveStart = (event) => {
      if (!props.movable) return
      Object.assign(initialPos, getMouseAbsPoint(event))
      Object.assign(initImgPos, { x: options.x, y: options.y })
      document.documentElement.addEventListener('mouseup', moveEnd)
      window.addEventListener('mousemove', moving)
    }

    const moving = (event) => {
      event.preventDefault()

      if (props.scaleControl) {
        const width = options.width
        const height = options.height

        const baseLine = {
          x: -width / 2 + 200 / 2,
          y: -height / 2 + 200 / 2
        }
        const translateLimit = {
          width: (width - 200) / 2,
          height: (height - 200) / 2
        }

        const offsetPos = getMouseRelPoint(event, initialPos)
        const rotatedOffset = getRotatedOffset(offsetPos)

        rotatedOffset.x += initImgPos.x
        rotatedOffset.y += initImgPos.y

        if (Math.abs(rotatedOffset.x - baseLine.x) > translateLimit.width) {
          rotatedOffset.x = rotatedOffset.x - baseLine.x > 0 ? 0 : 200 - width
        }
        if (Math.abs(rotatedOffset.y - baseLine.y) > translateLimit.height) {
          rotatedOffset.y = rotatedOffset.y - baseLine.y > 0 ? 0 : 200 - height
        }

        emit('update', rotatedOffset)
      } else {
        const offsetPos = getMouseRelPoint(event, initialPos)
        const rotatedOffset = getRotatedOffset(offsetPos)

        rotatedOffset.x += initImgPos.x
        rotatedOffset.y += initImgPos.y

        emit('update', rotatedOffset)
      }
    }

    const moveEnd = () => {
      document.documentElement.removeEventListener('mouseup', moveEnd)
      window.removeEventListener('mousemove', moving)
    }

    /**
     * Scale Handler: scaleStart、scaling、scaleEnd
     */
    const scaleStart = (event) => {
      Object.assign(initialPos, getMouseAbsPoint(event))
      Object.assign(initialWH, {
        width: options.width,
        height: options.height
      })
      const rect = body.value.getBoundingClientRect()
      Object.assign(center, getRectCenter(rect))
      Object.assign(initImgPos, { x: options.x, y: options.y })

      const vect = getMouseRelPoint(event, center)
      const clientP = getNoRotationPos(vect, center, 0)
      control.xSign = (clientP.x - center.x > 0) ? 1 : -1
      control.ySign = (clientP.y - center.y > 0) ? 1 : -1

      document.documentElement.addEventListener('mousemove', scaling, false)
      document.documentElement.addEventListener('mouseup', scaleEnd, false)
    }

    const scaling = (event) => {
      event.preventDefault()
      let width = options.width
      let height = options.height

      const angleInRad = 0
      const tmp = getMouseRelPoint(event, initialPos)

      const [dx, dy] = [tmp.x, tmp.y]

      const offsetWidth = control.xSign * (dy * Math.sin(angleInRad) + dx * Math.cos(angleInRad))
      const offsetHeight = control.ySign * (dy * Math.cos(angleInRad) - dx * Math.sin(angleInRad))

      if (offsetWidth === 0 || offsetHeight === 0) return

      const initWidth = initialWH.width
      const initHeight = initialWH.height

      if ((width + offsetWidth) / initWidth >= (height + offsetHeight) / initHeight) {
        width = offsetWidth + initWidth
        height = width * initHeight / initWidth
      } else {
        height = offsetHeight + initHeight
        width = height * initWidth / initHeight
      }

      const offsetSize = {
        width: width - initWidth,
        height: height - initHeight
      }

      const imgPos = {
        x: control.xSign < 0 ? -offsetSize.width + initImgPos.x : initImgPos.x,
        y: control.ySign < 0 ? -offsetSize.height + initImgPos.y : initImgPos.y
      }

      const baseLine = {
        x: -width / 2 + 200 / 2,
        y: -height / 2 + 200 / 2
      }

      const translateLimit = {
        width: (width - 200) / 2,
        height: (height - 200) / 2
      }

      const ratio = width / height

      if (Math.abs(imgPos.x - baseLine.x) > translateLimit.width) {
        if (control.xSign < 0) {
          imgPos.x = 0
          offsetSize.width = initImgPos.x
        } else {
          offsetSize.width = 200 - initImgPos.x - initWidth
        }

        offsetSize.height = offsetSize.width / ratio
        imgPos.y = control.ySign < 0 ? -offsetSize.height + initImgPos.y : initImgPos.y
        height = offsetSize.height + initHeight
        width = offsetSize.width + initWidth

        baseLine.x = -width / 2 + (200) / 2
        baseLine.y = -height / 2 + (options.height) / 2
        translateLimit.width = (width - 200) / 2
        translateLimit.height = (height - 200) / 2
      }

      if (Math.abs(imgPos.y - baseLine.y) > translateLimit.height) {
        if (control.ySign < 0) {
          imgPos.y = 0
          offsetSize.height = initImgPos.y
        } else {
          offsetSize.height = 200 - initImgPos.y - initHeight
        }

        offsetSize.width = offsetSize.height * ratio
        imgPos.x = control.xSign < 0 ? -offsetSize.width + initImgPos.x : initImgPos.x
        height = offsetSize.height + initHeight
        width = offsetSize.width + initWidth
      }

      emit('update', {
        x: imgPos.x,
        y: imgPos.y,
        width,
        height
      })
    }

    const scaleEnd = () => {
      document.documentElement.removeEventListener('mousemove', scaling, false)
      document.documentElement.removeEventListener('mouseup', scaleEnd, false)
    }

    /**
     * Scalers & Cursor Style Handler
     */
    const scalers = reactive([
      {
        width: '8px',
        height: '8px',
        left: '0',
        top: '0',
        transform: 'translate3d(-50%,-50%,0)',
        borderRadius: '50%'
      },
      {
        width: '8px',
        height: '8px',
        transform: 'translate3d(50%,-50%,0)',
        right: '0',
        top: '0',
        borderRadius: '50%'
      },
      {
        width: '8px',
        height: '8px',
        transform: 'translate3d(50%,50%,0)',
        right: '0',
        bottom: '0',
        borderRadius: '50%'
      },
      {
        width: '8px',
        height: '8px',
        transform: 'translate3d(-50%,50%,0)',
        left: '0',
        bottom: '0',
        borderRadius: '50%'
      }
    ])

    const cursors = [
      'nwse-resize',
      'ew-resize',
      'nesw-resize',
      'ew-resize',
      'nwse-resize',
      'ns-resize',
      'nesw-resize',
      'ns-resize'
    ]

    const cursorStyle = (index, rotateAngle) => {
      const cursorIndex = rotateAngle >= 0 ? (index + Math.floor(rotateAngle / 45)) % 8
        : (index + Math.ceil(rotateAngle / 45) + 8) % 8
      return { cursor: cursors[cursorIndex] }
    }

    return {
      body,
      styleObject,
      rotateStyle,
      scaleStyle,
      previewScaleStyles,
      moveStart,
      scaleStart,
      scalers,
      cursorStyle
    }
  }
}
</script>
<style lang="scss" scoped>
.cropped-image {
  position: relative;
  width: 100%;
  height: 100%;
  > div:nth-child(1) {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    transform-origin: top left;
    > div:nth-child(1) {
      position: absolute;
      top: 0px;
      left: 0px;
      > div:nth-child(1) {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        > img {
          user-select: none;
        }
      }
    }
  }
}
</style>
