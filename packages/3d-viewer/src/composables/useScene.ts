import { onMounted, onUnmounted, ref, toRaw } from 'vue'
import * as THREE from 'three'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
  setupControls,
  setupCamera,
  setupRenderer,
  setupScene,
} from '../utils/scene'

THREE.ColorManagement.enabled = true

export default function useScene() {
  const container = ref<HTMLElement>()
  const canvas = ref<HTMLCanvasElement>()
  const scene = ref<THREE.Scene | undefined>()
  const camera = ref<THREE.PerspectiveCamera | undefined>()
  let controls: OrbitControls | undefined
  let renderer: THREE.WebGLRenderer | undefined
  let animationReq: number | undefined

  const renderUpdateSize = () => {
    if (!container.value || !canvas.value) {
      return
    }
    if (!renderer) {
      throw new Error('renderer undefined')
    }
    if (!camera.value) {
      throw new Error('camera undefined')
    }
    if (!scene.value) {
      throw new Error('scene undefined')
    }

    canvas.value.style.width = '100%'
    canvas.value.style.height = '100%'

    camera.value.aspect = canvas.value.clientWidth / canvas.value.clientHeight
    camera.value.updateProjectionMatrix()
    renderer.setSize(
      container.value.clientWidth,
      container.value.clientHeight,
      false
    )
    renderer.render(toRaw(scene.value), toRaw(camera.value))
  }

  const observer = new ResizeObserver(renderUpdateSize)

  function render() {
    if (!renderer || !camera.value || !controls || !scene.value) {
      throw new Error('renderer or camera or controls or scene undefined')
    }

    controls.update()
    renderer.render(toRaw(scene.value), toRaw(camera.value))
    animationReq = requestAnimationFrame(render)
  }

  const init = () => {
    if (!canvas.value) {
      throw new Error('canvas undefined')
    }
    if (!container.value) {
      throw new Error('container undefined')
    }

    scene.value = setupScene()
    renderer = setupRenderer(canvas.value)
    camera.value = setupCamera(canvas.value)
    controls = setupControls(toRaw(camera.value), renderer)

    render()
    observer.observe(container.value)
  }

  const cleanUp = () => {
    if (animationReq) {
      cancelAnimationFrame(animationReq)
    }

    scene.value = undefined
    camera.value = undefined
    renderer = undefined

    if (container.value) {
      observer.unobserve(container.value)
    }
  }

  onMounted(init)
  onUnmounted(cleanUp)

  return { scene, camera, container, canvas }
}
