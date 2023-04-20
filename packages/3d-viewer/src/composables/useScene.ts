import { onMounted, onUnmounted, ref, toRaw } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { downloadDataURLFile } from '../utils/fileOperator'

THREE.ColorManagement.enabled = true

export default function useScene(baseUrl: string) {
  const container = ref<HTMLElement>()
  const canvas = ref<HTMLCanvasElement>()
  const scene = ref<THREE.Scene>()
  let controls: OrbitControls | undefined
  let renderer: THREE.WebGLRenderer | undefined
  let camera: THREE.PerspectiveCamera | undefined
  let animationReq: number | undefined

  const initScene = () => {
    if (!canvas.value) {
      throw new Error('canvas undefined')
    }
    if (!container.value) {
      throw new Error('container undefined')
    }

    const backgroundColor = 0x111111

    scene.value = new THREE.Scene()
    scene.value.background = new THREE.Color(backgroundColor)
    scene.value.fog = new THREE.Fog(backgroundColor, 10, 50)

    renderer = new THREE.WebGLRenderer({
      canvas: canvas.value,
      antialias: true,
      preserveDrawingBuffer: true,
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.outputEncoding = THREE.sRGBEncoding

    const groundTexture = new THREE.TextureLoader().load(
      `${baseUrl}/retina_wood.png`
    )
    groundTexture.wrapS = THREE.RepeatWrapping
    groundTexture.wrapT = THREE.RepeatWrapping
    groundTexture.repeat.set(25, 25)
    groundTexture.anisotropy = 36
    groundTexture.encoding = THREE.sRGBEncoding

    const groundMaterial = new THREE.MeshPhongMaterial({
      map: groundTexture,
      color: 0xf7f7f7,
      specular: 0x1e1e1e,
      shininess: 30,
      flatShading: true,
    })

    const groundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      groundMaterial
    )

    groundMesh.rotation.x = (Math.PI * -1) / 2
    groundMesh.receiveShadow = true
    scene.value.add(groundMesh)

    camera = new THREE.PerspectiveCamera(
      45,
      canvas.value.width / canvas.value.height,
      0.1,
      300
    )
    camera.position.set(0, 1, 2)

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6)
    hemiLight.position.set(0, 20, 0)
    scene.value.add(hemiLight)

    const spotLight = new THREE.SpotLight(0xffffff, 1)
    spotLight.position.set(0, 5, 0)
    spotLight.angle = Math.PI / 9
    spotLight.penumbra = 0.1
    spotLight.decay = 1
    spotLight.distance = 50
    spotLight.castShadow = true
    spotLight.shadow.mapSize.width = 1024 * 2
    spotLight.shadow.mapSize.height = 1024 * 2
    spotLight.shadow.bias = -0.001
    scene.value.add(spotLight)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.target = new THREE.Vector3(0, 0.6, 0)
    controls.maxDistance = 4
    controls.minDistance = 0.5
    controls.maxPolarAngle = Math.PI

    function animate() {
      if (!renderer || !camera || !controls || !scene.value) {
        return
      }

      controls.update()
      renderer.render(toRaw(scene.value), camera)
      animationReq = requestAnimationFrame(animate)
    }

    animate()
  }

  const takeScreenShot = () => {
    if (!canvas.value) {
      throw new Error('error')
    }

    canvas.value.toBlob((blob) => {
      if (!blob || !canvas.value) {
        return
      }

      const { width, height } = canvas.value
      const fileName = `screencapture-${width}x${height}.png`
      const url = window.URL.createObjectURL(blob)
      downloadDataURLFile(url, fileName)
    })
  }

  const observer = new ResizeObserver(() => {
    if (!container.value || !canvas.value) {
      return
    }

    canvas.value.style.width = '100%'
    canvas.value.style.height = '100%'
    canvas.value.width = container.value.clientWidth * window.devicePixelRatio
    canvas.value.height = container.value.clientHeight * window.devicePixelRatio

    if (!renderer) {
      throw new Error('renderer undefined')
    }
    if (!camera) {
      throw new Error('camera undefined')
    }
    if (!scene.value) {
      throw new Error('scene undefined')
    }

    camera.aspect = canvas.value.clientWidth / canvas.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(
      container.value.clientWidth,
      container.value.clientHeight,
      false
    )
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.render(toRaw(scene.value), camera)
  })

  onMounted(() => {
    if (!container.value) {
      throw new Error('container undefined')
    }
    initScene()
    observer.observe(container.value)
  })

  onUnmounted(() => {
    if (animationReq) {
      cancelAnimationFrame(animationReq)
    }

    scene.value = undefined
    camera = undefined
    renderer = undefined

    if (container.value) {
      observer.unobserve(container.value)
    }
  })

  return { scene, container, canvas, takeScreenShot }
}
