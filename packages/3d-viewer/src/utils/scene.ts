import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/**
 *
 * @param alpha set false to optimize performance, only enable when output screenshots.
 */
export const setupRenderer = (canvas: HTMLCanvasElement, alpha = false) => {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    preserveDrawingBuffer: true,
    alpha,
  })

  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  renderer.outputEncoding = THREE.sRGBEncoding

  return renderer
}

export const setupScene = () => {
  const scene = new THREE.Scene()

  const backgroundColor = 0x111111
  scene.background = new THREE.Color(backgroundColor)
  scene.fog = new THREE.Fog(backgroundColor, 10, 50)

  const spotLight = setupSpotLight()
  const hemiLight = setupHemiLight()
  const groundMesh = setupGroundMesh(
    `${import.meta.env.VITE_APP_WEB_URL}/static-data/3d-viewer/ground.png`
  )
  scene.add(groundMesh)
  scene.add(spotLight)
  scene.add(hemiLight)

  return scene
}

export const setupScreenshotScene = (
  camera: THREE.Camera,
  model: THREE.Group
) => {
  const scene = new THREE.Scene()

  const directionalLight = setupDirectionalLightFromCamera(camera)
  scene.add(directionalLight)
  scene.add(model.clone())

  return scene
}

export const setupControls = (
  camera: THREE.Camera,
  renderer: THREE.Renderer
) => {
  const controls = new OrbitControls(camera, renderer.domElement)

  controls.enableDamping = true
  controls.target = new THREE.Vector3(0, 0.6, 0)
  controls.maxDistance = 4
  controls.minDistance = 0.5
  controls.maxPolarAngle = Math.PI

  return controls
}

export const setupCamera = (canvas: HTMLCanvasElement) => {
  const fov = 45
  const aspect = canvas.width / canvas.height
  const near = 0.1
  const far = 300

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, 1, 2)
  return camera
}

const setupDirectionalLightFromCamera = (camera: THREE.Camera) => {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)

  directionalLight.position.copy(camera.position)
  directionalLight.target.position.applyQuaternion(camera.quaternion)

  return directionalLight
}

export const setupSpotLight = () => {
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

  return spotLight
}
export const setupHemiLight = () => {
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6)

  hemiLight.position.set(0, 20, 0)

  return hemiLight
}

const setupGroundTexture = (url: string) => {
  const groundTexture = new THREE.TextureLoader().load(url)

  groundTexture.wrapS = THREE.RepeatWrapping
  groundTexture.wrapT = THREE.RepeatWrapping
  groundTexture.repeat.set(25, 25)
  groundTexture.anisotropy = 36
  groundTexture.encoding = THREE.sRGBEncoding

  return groundTexture
}

export const setupGroundMesh = (url: string) => {
  const groundMaterial = new THREE.MeshPhongMaterial({
    map: setupGroundTexture(url),
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

  return groundMesh
}
