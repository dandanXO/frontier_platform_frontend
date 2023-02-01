import { ref, watch, computed } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { image2Object } from '../utils/cropper'
import MODELS from '../constants/models'
import type { U3M } from './useU3M'
import type { Ref } from 'vue'

const DISPLACEMENT_SCALE_BASE = 0.005

export default function useModels(
  scene: Ref<THREE.Scene | undefined>,
  u3m: Ref<U3M | undefined>,
  dpi: number,
  baseImgUrl: string,
  normalImgUrl: string,
  roughImgUrl: string,
  dispImgUrl: string,
  loading: Ref<boolean>
) {
  const modelIndex = ref<number>(0)
  const material = ref<THREE.MeshPhysicalMaterial>()
  const scale = ref<number>(1)
  const originRepeatTimesX = ref<number>(1)
  const textureRatio = ref(1)
  const repeatTimesX = computed(() => originRepeatTimesX.value / scale.value)
  const repeatTimesY = computed(() => repeatTimesX.value * textureRatio.value)
  const currentModel = computed(() => MODELS[modelIndex.value])

  const initMaterial = async () => {
    if (!scene || !u3m.value) return
    const setUpTextureWraps = (textures: THREE.Texture[]) => {
      textures.forEach((texture) => {
        texture.matrixAutoUpdate = true
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(repeatTimesX.value, repeatTimesY.value)
        texture.flipY = MODELS[0].flipY
        texture.needsUpdate = true
      })
    }

    const loader = new THREE.TextureLoader()
    const baseTexture = await loader.loadAsync(baseImgUrl)
    const normalTexture = await loader.loadAsync(normalImgUrl)
    const roughnessTexture = await loader.loadAsync(roughImgUrl)
    const displacementTexture = await loader.loadAsync(dispImgUrl)

    const { width, height } = baseTexture.image as HTMLImageElement
    textureRatio.value = width / height
    baseTexture.anisotropy = 16

    setUpTextureWraps([
      baseTexture,
      normalTexture,
      roughnessTexture,
      displacementTexture,
    ])

    material.value = new THREE.MeshPhysicalMaterial({
      side: THREE.DoubleSide,
      map: baseTexture,
      normalMap: normalTexture,
      roughnessMap: roughnessTexture,
      opacity: u3m.value.alpha,
      displacementMap: displacementTexture,
      roughness: u3m.value.roughness,
      specularColor: new THREE.Color(255, 255, 255),
      specularIntensity: u3m.value.specular,
      displacementScale: DISPLACEMENT_SCALE_BASE / repeatTimesX.value,
      transparent: true,
    })
  }

  const loadModel = async (index: number) => {
    if (!scene.value) return

    modelIndex.value = index
    const model = MODELS[index]

    const { width: widthInPx } = await image2Object(baseImgUrl)
    const widthInCm = (widthInPx / dpi) * 2.54
    originRepeatTimesX.value = model.size / widthInCm

    scene.value.children.forEach((item) => {
      if (!scene.value) return
      if (item.type === 'Group') scene.value.remove(item)
    })

    const manager = new THREE.LoadingManager()
    manager.onStart = () => (loading.value = true)
    manager.onLoad = () => (loading.value = false)
    manager.onError = (url) => {
      console.error('There was an error loading ' + url)
      loading.value = false
    }

    const modelPath = model.filePath
    const loader = new GLTFLoader(manager)
    loader.load(modelPath, (gltf) => {
      if (!u3m.value || !scene.value) throw new Error('error')

      const model = gltf.scene
      model.scale.set(0.5, 0.5, 0.5)
      model.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (!mesh.isMesh || !material.value) return

        mesh.receiveShadow = true
        mesh.castShadow = true

        // 我們透過 blender 先將希望覆蓋 u3m 圖層的 material 命名為 `Mesh_` prefix
        if (mesh.name.includes('Mesh_')) mesh.material = material.value
        if (mesh.name.includes('Ball_'))
          mesh.material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            flatShading: true,
          })
      })
      scene.value.add(model)
    })
    updateMaterialRepeatTimes()
  }

  const updateMaterial = () => {
    if (!material.value || !u3m.value) throw new Error('error')
    material.value.opacity = u3m.value.alpha
    material.value.roughness = u3m.value.roughness
    material.value.specularIntensity = u3m.value.specular
    material.value.needsUpdate = true
  }

  const updateMaterialRepeatTimes = () => {
    if (!material.value) return
    material.value.map?.repeat.set(repeatTimesX.value, repeatTimesY.value)
    material.value.normalMap?.repeat.set(repeatTimesX.value, repeatTimesY.value)
    material.value.roughnessMap?.repeat.set(
      repeatTimesX.value,
      repeatTimesY.value
    )
    material.value.displacementMap?.repeat.set(
      repeatTimesX.value,
      repeatTimesY.value
    )
    material.value.displacementScale =
      DISPLACEMENT_SCALE_BASE / repeatTimesX.value
    material.value.needsUpdate = true
  }

  const handleScaleChange = (v: number) => (scale.value = v)

  const handleScaleReset = () => {
    scale.value = 1
  }

  watch(u3m, async (newU3m, oldU3m) => {
    if (!newU3m) return
    if (oldU3m) return updateMaterial()
    await initMaterial()
    loadModel(0)
  })
  watch(scale, updateMaterialRepeatTimes)

  return {
    modelIndex,
    currentModel,
    loadModel,
    material,
    scale,
    handleScaleChange,
    handleScaleReset,
  }
}
