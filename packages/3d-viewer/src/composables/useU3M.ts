import { computed, onMounted, ref } from 'vue'
import { path } from 'ramda'

interface U3MColor {
  r: number
  g: number
  b: number
}

export interface U3M {
  u3m: object
  alpha: number
  baseColor: U3MColor
  metalness: number
  roughness: number
  specular: number
}

export const loadU3m = async (u3mPath: string): Promise<U3M> => {
  const res = await fetch(u3mPath, { method: 'GET' })
  const u3m = await res.json()

  const frontPath = ['material', 'front']

  const baseColorPath = [...frontPath, 'basecolor']
  const specularPath = [...frontPath, 'specular_value']

  const alphaConstantPath = path([...frontPath, 'alpha', 'constant'])
  const roughnessConstantPath = path([...frontPath, 'roughness', 'constant'])
  const metalnessConstantPath = path([...frontPath, 'metalness', 'constant'])
  const baseColorConstantPath = path([...baseColorPath, 'constant'])
  const specularConstantPath = path([...specularPath, 'constant'])

  const alpha = alphaConstantPath(u3m) as number
  const baseColor = baseColorConstantPath(u3m) as U3MColor
  const metalness = metalnessConstantPath(u3m) as number
  const roughness = roughnessConstantPath(u3m) as number
  let specular = specularConstantPath(u3m) as number

  /*
   * 因後端給的預設 specular 為 0,
   * 前端幫忙塞布料預設值 0.05，等到後端重產完 u3m 後再拿掉這段 code。
   */
  if (specular === 0) {
    specular = 0.05
  }

  return {
    u3m,
    alpha,
    baseColor,
    metalness,
    roughness,
    specular,
  }
}

export default function useU3M(path: string) {
  const isLoading = ref(true)
  const originU3m = ref<U3M>()
  const u3m = ref<U3M>()

  const alpha = computed(() => u3m.value?.alpha || 0)
  const roughness = computed(() => u3m.value?.roughness || 0)
  const specular = computed(() => u3m.value?.specular || 0)

  const handleAlphaChange = (alpha: number) => {
    if (!u3m.value) {
      return
    }
    u3m.value = { ...u3m.value, alpha }
  }

  const handleRoughnessChange = (roughness: number) => {
    if (!u3m.value) {
      return
    }
    u3m.value = { ...u3m.value, roughness }
  }

  const handleSpecularChange = (specular: number) => {
    if (!u3m.value) {
      return
    }
    u3m.value = { ...u3m.value, specular }
  }

  onMounted(() => {
    loadU3m(path).then((result) => {
      originU3m.value = result
      u3m.value = result
      isLoading.value = false
    })
  })

  return {
    isLoading,
    originU3m,
    u3m,
    alpha,
    roughness,
    specular,
    handleAlphaChange,
    handleRoughnessChange,
    handleSpecularChange,
  }
}
