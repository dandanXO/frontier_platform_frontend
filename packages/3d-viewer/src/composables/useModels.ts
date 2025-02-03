import { ref, watch, computed, onMounted } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Pica from 'pica'
import { image2Object } from '../utils/cropper'
import useColors from './useColors'
import type { Ref } from 'vue'
import type { U3M } from './useU3M'
import modelsApi from '../apis/models'
import type {
  Material,
  Material3DViewerOrgGetAllModels200ResponseAllOfResultModelListInner,
} from '@frontier/platform-web-sdk'

THREE.ColorManagement.enabled = true

const DISPLACEMENT_SCALE_BASE = 0.005
const DEFAULT_PATTERN_SIZE = 20
const pica = Pica()

/**
 * 針對布料的 Moire Effect 進行處理：
 * 根據 https://github.com/mrdoob/three.js/issues/1921，Texture 的長寬為 2 的次方
 * 並且設定 `texture.minFilter = THREE.LinearMipMapLinearFilter` 即可解決問題。
 *
 * 假設圖片為 3000 x 3000，經過 downSample 後會得到 2048 x 2048。
 */
const getMoireEffectPreventedTexture = (
  url: string
): Promise<{
  texture: THREE.Texture
  img: HTMLImageElement
}> => {
  return new Promise((resolve) => {
    const originalImage = document.createElement('img')
    originalImage.src = url
    originalImage.crossOrigin = 'anonymous'
    originalImage.onload = async () => {
      if (!originalImage) {
        return
      }
      const processedCanvas = document.createElement('canvas')

      const nearestPowerOf2 = (n: number) => 1 << (31 - Math.clz32(n))
      const size = nearestPowerOf2(originalImage.width)
      processedCanvas.width = size
      processedCanvas.height = size

      await pica.resize(originalImage, processedCanvas)
      const dataUrl = processedCanvas.toDataURL()
      const processedImage = new Image()
      processedImage.src = dataUrl
      const moireEffectPreventedTexture = new THREE.TextureLoader().load(
        dataUrl
      )
      moireEffectPreventedTexture.minFilter = THREE.LinearMipMapLinearFilter
      resolve({ texture: moireEffectPreventedTexture, img: processedImage })
    }
  })
}

const useMoireEffectPreventSwitch = (
  material: Ref<THREE.MeshPhysicalMaterial | undefined>,
  baseTexture: Ref<THREE.Texture | undefined>,
  normalTexture: Ref<THREE.Texture | undefined>,
  roughnessTexture: Ref<THREE.Texture | undefined>,
  displacementTexture: Ref<THREE.Texture | undefined>,
  moireEffectPreventedBaseTexture: Ref<THREE.Texture | undefined>,
  moireEffectPreventedNormalTexture: Ref<THREE.Texture | undefined>,
  moireEffectPreventedRoughnessTexture: Ref<THREE.Texture | undefined>,
  moireEffectPreventedDisplacementTexture: Ref<THREE.Texture | undefined>,
  metalTexture: Ref<THREE.Texture | undefined>,
  alphaTexture: Ref<THREE.Texture | undefined>,
  moireEffectPreventedMetallacementTexture: Ref<THREE.Texture | undefined>,
  moireEffectPreventedAlphalacementTexture: Ref<THREE.Texture | undefined>
) => {
  /**
   * Only for testing purpose, it should always be true in production env.
   */
  const applyMoireEffectPreventedTexture = ref(true)

  const moireEffectPreventToggle = () => {
    applyMoireEffectPreventedTexture.value =
      !applyMoireEffectPreventedTexture.value
  }

  watch(applyMoireEffectPreventedTexture, () => {
    if (!material.value) {
      return
    }

    if (applyMoireEffectPreventedTexture.value) {
      if (
        !moireEffectPreventedBaseTexture.value ||
        !moireEffectPreventedNormalTexture.value ||
        !moireEffectPreventedRoughnessTexture.value ||
        !moireEffectPreventedDisplacementTexture.value ||
        !moireEffectPreventedMetallacementTexture.value ||
        !moireEffectPreventedAlphalacementTexture.value
      ) {
        return
      }
      material.value.map = moireEffectPreventedBaseTexture.value
      material.value.normalMap = moireEffectPreventedNormalTexture.value
      material.value.roughnessMap = moireEffectPreventedRoughnessTexture.value
      material.value.displacementMap =
        moireEffectPreventedDisplacementTexture.value
      material.value.metalnessMap =
        moireEffectPreventedMetallacementTexture.value
      material.value.alphaMap = moireEffectPreventedAlphalacementTexture.value
    } else {
      if (
        !baseTexture.value ||
        !normalTexture.value ||
        !roughnessTexture.value ||
        !displacementTexture.value ||
        !metalTexture.value ||
        !alphaTexture.value
      ) {
        return
      }
      material.value.map = baseTexture.value
      material.value.normalMap = normalTexture.value
      material.value.roughnessMap = roughnessTexture.value
      material.value.displacementMap = displacementTexture.value
      material.value.metalnessMap = metalTexture.value
      material.value.alphaMap = alphaTexture.value
    }
    material.value.needsUpdate = true
  })

  return {
    applyMoireEffectPreventedTexture,
    moireEffectPreventToggle,
  }
}

export default function useModels(
  scene: Ref<THREE.Scene | undefined>,
  u3m: Ref<U3M | undefined>,
  dpi: number,
  baseImgUrl: string,
  normalImgUrl: string,
  roughImgUrl: string,
  dispImgUrl: string,
  metalImgUrl: string,
  alphaImgUrl: string,
  orgId: Material['metaData']['materialOwnerOGId']
) {
  const isLoading = ref(true)

  const models = ref<
    Material3DViewerOrgGetAllModels200ResponseAllOfResultModelListInner[]
  >([])
  const modelIndex = ref<number>(0)
  const modelObject = ref<THREE.Group>()
  const material = ref<THREE.MeshPhysicalMaterial>()
  const baseTexture = ref<THREE.Texture>()
  const normalTexture = ref<THREE.Texture>()
  const roughnessTexture = ref<THREE.Texture>()
  const displacementTexture = ref<THREE.Texture>()

  const metalTexture = ref<THREE.Texture | undefined>(undefined)
  const alphaTexture = ref<THREE.Texture | undefined>(undefined)

  const moireEffectPreventedBaseImage = ref<HTMLImageElement>()
  const moireEffectPreventedBaseTexture = ref<THREE.Texture>()
  const moireEffectPreventedNormalTexture = ref<THREE.Texture>()
  const moireEffectPreventedRoughnessTexture = ref<THREE.Texture>()
  const moireEffectPreventedDisplacementTexture = ref<THREE.Texture>()
  const moireEffectPreventedmetallacementTexture = ref<
    THREE.Texture | undefined
  >(undefined)
  const moireEffectPreventedAlphalacementTexture = ref<
    THREE.Texture | undefined
  >(undefined)
  const scale = ref<number>(1)
  const originRepeatTimesX = ref<number>(1)
  const textureRatio = ref(1)
  const repeatTimesX = computed(() => originRepeatTimesX.value / scale.value)
  const repeatTimesY = computed(() => repeatTimesX.value * textureRatio.value)
  const currentModel = computed(() => models.value[modelIndex.value])

  const {
    pantoneList,
    currentColors,
    colorRemovable,
    colorAddable,
    handleColorChange,
    handleColorInput,
    handleColorAdd,
    handleColorRemove,
  } = useColors(
    material,
    moireEffectPreventedBaseTexture,
    moireEffectPreventedBaseImage,
    10
  )

  const { applyMoireEffectPreventedTexture, moireEffectPreventToggle } =
    useMoireEffectPreventSwitch(
      material,
      baseTexture,
      normalTexture,
      roughnessTexture,
      displacementTexture,
      moireEffectPreventedBaseTexture,
      moireEffectPreventedNormalTexture,
      moireEffectPreventedRoughnessTexture,
      moireEffectPreventedDisplacementTexture,
      metalTexture,
      alphaTexture,
      moireEffectPreventedmetallacementTexture,
      moireEffectPreventedAlphalacementTexture
    )

  const initMaterial = async () => {
    if (!scene || !u3m.value) {
      return
    }
    const setUpTextures = (textures: (THREE.Texture | null)[]) => {
      textures.forEach((texture) => {
        if (texture) {
          texture.matrixAutoUpdate = true
          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.RepeatWrapping
          texture.minFilter = THREE.LinearMipMapLinearFilter
          texture.needsUpdate = true
          texture.flipY = false
        }
      })
    }

    const loader = new THREE.TextureLoader()
    console.time('texture image network loading time')
    const loadResult = await Promise.all([
      loader.loadAsync(baseImgUrl),
      loader.loadAsync(normalImgUrl),
      loader.loadAsync(roughImgUrl),
      loader.loadAsync(dispImgUrl),
      getMoireEffectPreventedTexture(baseImgUrl),
      getMoireEffectPreventedTexture(normalImgUrl),
      getMoireEffectPreventedTexture(roughImgUrl),
      getMoireEffectPreventedTexture(dispImgUrl),
    ])
    baseTexture.value = loadResult[0]
    normalTexture.value = loadResult[1]
    roughnessTexture.value = loadResult[2]
    displacementTexture.value = loadResult[3]
    moireEffectPreventedBaseImage.value = loadResult[4].img
    moireEffectPreventedBaseTexture.value = loadResult[4].texture
    moireEffectPreventedNormalTexture.value = loadResult[5].texture
    moireEffectPreventedRoughnessTexture.value = loadResult[6].texture
    moireEffectPreventedDisplacementTexture.value = loadResult[7].texture

    if (metalImgUrl) {
      const result = await loader.loadAsync(metalImgUrl)
      const result2 = await getMoireEffectPreventedTexture(metalImgUrl)
      metalTexture.value = result
      moireEffectPreventedmetallacementTexture.value = result2.texture
    }
    if (alphaImgUrl) {
      const result = await loader.loadAsync(alphaImgUrl)
      const result2 = await getMoireEffectPreventedTexture(alphaImgUrl)
      alphaTexture.value = result
      moireEffectPreventedAlphalacementTexture.value = result2.texture
    }

    const { width, height } = baseTexture.value.image as HTMLImageElement
    textureRatio.value = width / height
    baseTexture.value.anisotropy = 16

    baseTexture.value.encoding = THREE.sRGBEncoding
    moireEffectPreventedBaseTexture.value.encoding = THREE.sRGBEncoding

    setUpTextures([
      baseTexture.value,
      normalTexture.value,
      roughnessTexture.value,
      displacementTexture.value,
      metalTexture.value || null,
      alphaTexture.value || null,
      moireEffectPreventedBaseTexture.value,
      moireEffectPreventedNormalTexture.value,
      moireEffectPreventedRoughnessTexture.value,
      moireEffectPreventedDisplacementTexture.value,
      moireEffectPreventedmetallacementTexture.value || null,
      moireEffectPreventedAlphalacementTexture.value || null,
    ])

    material.value = new THREE.MeshPhysicalMaterial({
      side: THREE.DoubleSide,
      alphaTest: 0.5,
      map: applyMoireEffectPreventedTexture.value
        ? moireEffectPreventedBaseTexture.value
        : baseTexture.value,
      normalMap: applyMoireEffectPreventedTexture.value
        ? moireEffectPreventedNormalTexture.value
        : normalTexture.value,
      roughnessMap: applyMoireEffectPreventedTexture.value
        ? moireEffectPreventedRoughnessTexture.value
        : roughnessTexture.value,
      opacity: u3m.value.alpha,
      displacementMap: applyMoireEffectPreventedTexture.value
        ? moireEffectPreventedDisplacementTexture.value
        : displacementTexture.value,
      roughness: u3m.value.roughness,
      specularColor: new THREE.Color(1, 1, 1),
      specularIntensity: u3m.value.specular,
      displacementScale: DISPLACEMENT_SCALE_BASE / repeatTimesX.value,
      transparent: true,
      metalnessMap: applyMoireEffectPreventedTexture.value
        ? moireEffectPreventedmetallacementTexture.value
        : metalTexture.value,
      alphaMap: applyMoireEffectPreventedTexture.value
        ? moireEffectPreventedAlphalacementTexture.value
        : alphaTexture.value,
    })
  }

  const loadModel = async (index: number) => {
    if (!scene.value) {
      return
    }

    modelIndex.value = index
    const model = models.value[index]

    const { width: widthInPx } = await image2Object(baseImgUrl)
    const widthInCm = (widthInPx / dpi) * 2.54
    originRepeatTimesX.value =
      (model.patternSize ?? DEFAULT_PATTERN_SIZE) / widthInCm

    scene.value.children.forEach((item) => {
      if (!scene.value) {
        return
      }
      if (item.type === 'Group') {
        scene.value.remove(item)
      }
    })

    const manager = new THREE.LoadingManager()
    manager.onStart = () => (isLoading.value = true)
    manager.onLoad = () => (isLoading.value = false)
    manager.onError = (url) => {
      console.error('There was an error loading ' + url)
      isLoading.value = false
    }

    const {
      data: { result: modelPath },
    } = await modelsApi.getModel(orgId!, model.id!)

    const loader = new GLTFLoader(manager)

    loader.load(modelPath, (gltf) => {
      if (!u3m.value || !scene.value) {
        throw new Error('error')
      }

      modelObject.value = gltf.scene
      modelObject.value.scale.set(0.5, 0.5, 0.5)
      modelObject.value.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (!mesh.isMesh || !material.value) {
          return
        }

        mesh.receiveShadow = true
        mesh.castShadow = true

        // 我們透過 blender 先將希望覆蓋 u3m 圖層的 material 命名為 `Mesh_` prefix
        if (mesh.name.includes('Mesh_')) {
          mesh.material = material.value
        }
        // 球體其中一層需要消失
        if (mesh.name === 'Mesh_1_2') {
          mesh.material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            flatShading: true,
            transparent: true,
            visible: false,
            depthWrite: false,
          })
        }
        if (mesh.name.includes('Ball_')) {
          mesh.material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            flatShading: true,
            transparent: true,
            visible: false,
            depthWrite: false,
          })
        }
      })

      scene.value.add(modelObject.value)
    })
    updateMaterialRepeatTimes()
  }

  const updateMaterial = async () => {
    if (!material.value || !u3m.value) {
      await initMaterial()
      loadModel(0)
      return
    }
    material.value.opacity = u3m.value.alpha
    material.value.roughness = u3m.value.roughness
    material.value.specularIntensity = u3m.value.specular
    material.value.needsUpdate = true
  }

  const updateMaterialRepeatTimes = () => {
    ;[
      baseTexture.value,
      normalTexture.value,
      roughnessTexture.value,
      displacementTexture.value,
      metalTexture.value,
      alphaTexture.value,
      moireEffectPreventedBaseTexture.value,
      moireEffectPreventedNormalTexture.value,
      moireEffectPreventedRoughnessTexture.value,
      moireEffectPreventedDisplacementTexture.value,
      moireEffectPreventedmetallacementTexture.value,
      moireEffectPreventedAlphalacementTexture.value,
    ].forEach((texture) => {
      texture?.repeat.set(repeatTimesX.value, repeatTimesY.value)
    })
    if (material.value) {
      material.value.displacementScale =
        DISPLACEMENT_SCALE_BASE / repeatTimesX.value
      material.value.needsUpdate = true
    }
  }

  const handleScaleChange = (v: number) => (scale.value = v)

  watch([u3m, models], async ([newU3m, newModels], [oldU3m]) => {
    if (!newU3m || newModels.length === 0) {
      return
    }
    if (oldU3m) {
      return updateMaterial()
    }
  })

  onMounted(async () => {
    if (!orgId) {
      return
    }
    const {
      data: {
        result: { modelList },
      },
    } = await modelsApi.getAllModels(orgId)
    if (!modelList?.length) {
      return
    }
    models.value = modelList
  })
  return {
    isLoading,
    models,
    modelIndex,
    currentModel,
    loadModel,
    modelObject,
    scale,
    pantoneList,
    currentColors,
    colorRemovable,
    colorAddable,
    handleScaleChange,
    applyMoireEffectPreventedTexture,
    moireEffectPreventToggle,
    handleColorChange,
    handleColorInput,
    handleColorAdd,
    handleColorRemove,
  }
}
