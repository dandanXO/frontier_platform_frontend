<template lang="pug">
div(class="croped-image")
  div(:style="styles()")
    div(:style="scaleStyles()")
        img(ref="body"
          :class="[{'opacity-30': isTransparent}]"
          draggable="false"
          :src="config.src"
          @mousedown.left.stop="moveStart")
        div(v-for="(scaler, index)  in scalers"
            class="controller-point absolute bg-black-0"
            :key="index"
            :style="Object.assign(scaler, cursorStyles(index, 0))"
            @mousedown.stop="scaleStart")
</template>

<script>
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
export default {
  props: {
    scaleRatio: {
      default: 1,
      type: Number
    },
    rotateDeg: {
      default: 0,
      type: Number
    },
    movable: {
      default: false,
      type: Boolean
    },
    isTransparent: {
      default: false,
      type: Boolean
    }
  },
  setup (props) {
    const store = useStore()
    const organization = computed(() => store.getters['organization/organization'])
    let initialPos = { x: 0, y: 0 }
    const initImgPos = { x: 0, y: 0 }
    const controlling = ref(false)
    const initialWH = { width: 0, height: 0 }
    const control = { xSign: 1, ySign: 1, isHorizon: false }
    let center = { x: 0, y: 0 }
    const body = ref(null)

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

    const config = computed(() => {
      return store.getters['organization/orgLogo/getUploadImgConfig']
    })

    // const cropSize = 200

    function styles () {
      const styles = config.value.styles
      return {
        transform: `translate(${styles.x}px, ${styles.y}px)`,
        width: `${styles.width}px`,
        height: `${styles.height}px`
      }
    }

    function scaleStyles () {
      return {
        transform: `scale(${props.scaleRatio}`
      }
    }

    function cursorStyles (index, rotateAngle) {
      const cursorIndex = rotateAngle >= 0 ? (index + Math.floor(rotateAngle / 45)) % 8
        : (index + Math.ceil(rotateAngle / 45) + 8) % 8
      return { cursor: cursors[cursorIndex] }
    }

    function getMouseAbsPoint (e) {
      return { x: e.clientX, y: e.clientY }
    }

    function getMouseRelPoint (e, target) {
      const x = e.clientX - target.x
      const y = e.clientY - target.y
      return { x, y }
    }
    function getRectCenter (rect) {
      return {
        x: rect.left + rect.width / 2 - window.pageXOffset,
        y: rect.top + rect.height / 2 - window.pageYOffset
      }
    }

    function getNoRotationPos (vectClient, center, rotation) {
      return {
        x: vectClient.x * Math.cos(-rotation) - vectClient.y * Math.sin(-rotation) + center.x,
        y: vectClient.y * Math.cos(-rotation) + vectClient.x * Math.sin(-rotation) + center.y
      }
    }

    function updateImgPos (x, y) {
      store.commit('organization/orgLogo/UPDATE_imgStyles', {
        x,
        y
      })
    }

    function updateImgSize (width, height) {
      store.commit('organization/orgLogo/UPDATE_imgStyles', {
        width,
        height
      })
    }

    function moveStart (event) {
      if (props.movable) {
        initialPos = getMouseAbsPoint(event)
        Object.assign(initImgPos, { x: config.value.styles.x, y: config.value.styles.y })
        document.documentElement.addEventListener('mouseup', moveEnd)
        window.addEventListener('mousemove', moving)
      }
    }

    function moving (event) {
      event.preventDefault()

      const width = config.value.styles.width
      const height = config.value.styles.height

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

      store.commit('organization/orgLogo/UPDATE_imgStyles', rotatedOffset)
      // initialPos.x += rotatedOffset.x
      // initialPos.y += rotatedOffset.y
    }

    function moveEnd () {
      document.documentElement.removeEventListener('mouseup', moveEnd)
      window.removeEventListener('mousemove', moving)
    }

    function scaleStart (event) {
      controlling.value = true
      initialPos = getMouseAbsPoint(event)
      // this.initImgControllerPos = this.getImgController
      Object.assign(initialWH, {
        width: config.value.styles.width,
        height: config.value.styles.height
      })
      const rect = body.value.getBoundingClientRect()
      center = getRectCenter(rect)

      Object.assign(initImgPos, { x: config.value.styles.x, y: config.value.styles.y })

      // const angleInRad = getLayerRotate * Math.PI / 180
      const vect = getMouseRelPoint(event, center)
      const clientP = getNoRotationPos(vect, center, 0)
      control.xSign = (clientP.x - center.x > 0) ? 1 : -1
      control.ySign = (clientP.y - center.y > 0) ? 1 : -1
      // currCursorStyling(event)
      document.documentElement.addEventListener('mousemove', scaling, false)
      document.documentElement.addEventListener('mouseup', scaleEnd, false)
    }

    function scaling (event) {
      event.preventDefault()
      let width = config.value.styles.width
      let height = config.value.styles.height

      // const angleInRad = this.getLayerRotate * Math.PI / 180
      const angleInRad = 0
      const tmp = getMouseRelPoint(event, initialPos)

      // const diff = MathUtils.getActualMoveOffset(tmp.x, tmp.y)
      const [dx, dy] = [tmp.x, tmp.y]
      // const [dx, dy] = [diff.offsetX / this.config.styles.scale, diff.offsetY / this.config.styles.scale]
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

      // if (width <= 40 || height <= 40) return
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
        baseLine.y = -height / 2 + (config.value.styles.height) / 2
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
      updateImgSize(width, height)
      updateImgPos(imgPos.x, imgPos.y)
    }

    function scaleEnd () {
      controlling.value = false
      // this.setCursorStyle('default')
      document.documentElement.removeEventListener('mousemove', scaling, false)
      document.documentElement.removeEventListener('mouseup', scaleEnd, false)
    }

    function getRotatedOffset (offset) {
      return {
        x: offset.x * cos(-props.rotateDeg) - offset.y * sin(-props.rotateDeg),
        y: offset.x * sin(-props.rotateDeg) + offset.y * cos(-props.rotateDeg)
      }
    }

    function cos (angle) {
      const angleInRad = angle / 180 * Math.PI
      return Math.cos(angleInRad)
    }

    function sin (angle) {
      const angleInRad = angle / 180 * Math.PI
      return Math.sin(angleInRad)
    }

    return {
      styles,
      moveStart,
      scaleStart,
      scaleStyles,
      config,
      organization,
      scalers,
      cursorStyles,
      body
    }
  }
}
</script>

<style lang="scss" scoped>
.croped-image {
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
