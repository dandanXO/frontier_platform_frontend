<template lang="pug">
model-editor(
  v-if="!!material"
  :dpi="material.u3m.dpi"
  :u3mPath="material.u3m.u3mSpecUrl"
  :baseImgUrl="material.u3m.baseImgUrl"
  :normalImgUrl="material.u3m.normalImgUrl"
  :roughImgUrl="material.u3m.roughImgUrl"
  :dispImgUrl="material.u3m.dispImgUrl"
  @close="handleClose"
)
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import openApi from '@/apis/openApi'

const route = useRoute()
const material = ref()

const handleMessage = async (e) => {
  if (e.origin + '/' !== document.referrer) return false

  const methodHandler = {
    setApiKey: async (params) => {
      const { apiKey } = params
      const { materialId: frontierNo } = route.params
      const res = await openApi.getMaterialByApiKey({ apiKey, frontierNo })
      material.value = res.data.result.material
    },
    setAccessToken: async (params) => {
      const { accessToken } = params
      const materialId = Number(route.params.materialId)
      const res = await openApi.getMaterialByAccessToken({
        accessToken,
        materialId,
      })
      material.value = res.data.result.material
    },
  }

  try {
    const { method, params } = e.data
    await methodHandler[method](params)
  } catch (error) {
    if (error.response) {
      const errorMessage = {
        error: {
          type: 'openApiError',
          status: error.response.status,
          response: error.response.data,
        },
      }
      parent.postMessage(errorMessage, document.referrer)
    }
  }
}

const handleClose = () => {
  parent.postMessage({ method: 'close' }, document.referrer)
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>
