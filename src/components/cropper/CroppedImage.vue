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
    }
  },
  emits: ['update'],
  setup (props, { emit }) {
    const body = ref(null)
    const { options } = reactive(props.config)
    const initialPos = { x: 0, y: 0 }
    const initImgPos = { x: 0, y: 0 }

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

      const offsetPos = getMouseRelPoint(event, initialPos)
      const rotatedOffset = getRotatedOffset(offsetPos)

      rotatedOffset.x += initImgPos.x
      rotatedOffset.y += initImgPos.y

      emit('update', rotatedOffset)
    }

    const moveEnd = () => {
      document.documentElement.removeEventListener('mouseup', moveEnd)
      window.removeEventListener('mousemove', moving)
    }

    return {
      body,
      styleObject,
      rotateStyle,
      scaleStyle,
      previewScaleStyles,
      moveStart
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
