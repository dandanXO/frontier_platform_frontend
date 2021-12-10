<template lang="pug">
div(class="cropped-image " :style="rotateStyles")
  div(:style="styles")
    div(:style="scaleStyles")
      img(
        draggable="false"
        :class="[{'opacity-30': isTransparent}]"
        :src="imageSrc"
        @mousedown.left.stop="moveStart"
      )
</template>

<script>
import { reactive, computed } from '@vue/runtime-core'

export default {
  props: {
    scaleRatio: {
      type: Number,
      default: 1
    },
    rotationAngle: {
      type: Number,
      default: 0
    },
    imageSrc: {
      type: String
    },
    isTransparent: {
      default: false,
      type: Boolean
    },
    options: {
      type: Object,
      required: true
    }
  },
  setup (props, { emit }) {
    const options = reactive(props.options)
    const initialPos = { x: 0, y: 0 }
    const initImgPos = { x: 0, y: 0 }

    const styles = computed(() => {
      const { x, y, width, height } = options
      return {
        transform: `translate(${x}px, ${y}px)`,
        width: `${width}px`,
        height: `${height}px`
      }
    })

    const scaleStyles = computed(() => {
      return {
        transform: `scale(${props.scaleRatio}`
      }
    })

    const rotateStyles = computed(() => {
      return {
        transform: `rotate(${props.rotationAngle}deg)`
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

    const moveStart = (event) => {
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

    const getRotatedOffset = (offset) => {
      return {
        x: offset.x * cos(-props.rotationAngle) - offset.y * sin(-props.rotationAngle),
        y: offset.x * sin(-props.rotationAngle) + offset.y * cos(-props.rotationAngle)
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

    return {
      styles,
      rotateStyles,
      scaleStyles,
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
