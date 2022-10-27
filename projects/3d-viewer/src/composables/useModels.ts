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
  const originRepeatTimes = ref<number>(1)
  const repeatTimes = computed(() => originRepeatTimes.value / scale.value)
  const currentModel = computed(() => MODELS[modelIndex.value])

  const initMaterial = () => {
    if (!scene || !u3m.value) return
    const setUpTextureWraps = (textures: THREE.Texture[]) => {
      textures.forEach((texture) => {
        texture.matrixAutoUpdate = true
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(repeatTimes.value, repeatTimes.value)
        texture.flipY = MODELS[0].flipY
        texture.needsUpdate = true
      })
    }

    const baseTexture = new THREE.TextureLoader().load(baseImgUrl)
    const normalTexture = new THREE.TextureLoader().load(normalImgUrl)
    const roughnessTexture = new THREE.TextureLoader().load(roughImgUrl)
    const displacementTexture = new THREE.TextureLoader().load(dispImgUrl)

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
      displacementScale: DISPLACEMENT_SCALE_BASE / repeatTimes.value,
      transparent: true,
    })
  }

  const loadModel = async (index: number) => {
    if (!scene.value) return

    modelIndex.value = index
    const model = MODELS[index]

    const { width } = await image2Object(baseImgUrl)
    const cm = (width / dpi) * 2.54
    originRepeatTimes.value = model.size / cm

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
    material.value.map?.repeat.set(repeatTimes.value, repeatTimes.value)
    material.value.normalMap?.repeat.set(repeatTimes.value, repeatTimes.value)
    material.value.roughnessMap?.repeat.set(
      repeatTimes.value,
      repeatTimes.value
    )
    material.value.displacementMap?.repeat.set(
      repeatTimes.value,
      repeatTimes.value
    )
    material.value.displacementScale =
      DISPLACEMENT_SCALE_BASE / repeatTimes.value
    material.value.needsUpdate = true
  }

  const handleScaleChange = (v: number) => (scale.value = v)

  const handleScaleReset = () => {
    scale.value = 1
  }

  watch(u3m, (newU3m, oldU3m) => {
    if (!newU3m) return
    if (oldU3m) return updateMaterial()
    initMaterial()
    loadModel(0)
  })
  watch(scale, updateMaterialRepeatTimes)

  return {
    modelIndex,
    currentModel,
    loadModel,
    material,
    scale,
    repeatTimes,
    handleScaleChange,
    handleScaleReset,
  }
}
