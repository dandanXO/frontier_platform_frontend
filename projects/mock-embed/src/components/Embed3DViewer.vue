<template lang="pug">
#container
  h1 Embed Partner
  div
    span Target Domain
    input(v-model="targetDomain")
  div
    input#two(type="radio" v-model="type" :value="TYPE.BY_ACCESS_TOKEN")
    label(for="two") {{ TYPE.BY_ACCESS_TOKEN }}
    input#one(type="radio" v-model="type" :value="TYPE.BY_API_KEY")
    label(for="one") {{ TYPE.BY_API_KEY }}
  template(v-if="type === TYPE.BY_API_KEY")
    div
      span API KEY
      input(v-model="apiKey")
    div
      span Frontier No
      input(v-model="frontierNo")
  template(v-else)
    div
      span Access Token
      input(v-model="accessToken")
    div
      span Material ID
      input(v-model="materialId")
  button(@click="handleLoad") load
  p(v-if="errorMessage") {{ errorMessage }}
  div(class="iframe")
    iframe(
      :key="iframeKey"
      v-if="iframeKey"
      ref="iframeDom"
      width="100%"
      height="100%"
      frameborder="0"
      :src="iframePath"
      :onload="handleIframeLoad"
    )
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'

const TYPE = {
  BY_API_KEY: 'By API Key',
  BY_ACCESS_TOKEN: 'By Access Token',
}

const type = ref(TYPE.BY_ACCESS_TOKEN)
const frontierNo = ref('F632274840497')
const materialId = ref(56)
const apiKey = ref('')
const accessToken = ref('')
const targetDomain = ref('https://textile-dev.frontier.cool')

const iframeDom = ref<HTMLIFrameElement>()

const iframePath = ref('')
const iframeKey = ref('')
const loadCount = ref(0)
const errorMessage = ref('')

const handleIframeLoad = () => {
  if (type.value === TYPE.BY_API_KEY) setApiKey()
  if (type.value === TYPE.BY_ACCESS_TOKEN) setAccessToken()
}

const setApiKey = () => {
  if (!iframeDom.value) return
  const { contentWindow } = iframeDom.value
  if (!contentWindow) return

  contentWindow.postMessage(
    { method: 'setApiKey', params: { apiKey: apiKey.value } },
    targetDomain.value
  )
}

const setAccessToken = () => {
  if (!iframeDom.value) return
  const { contentWindow } = iframeDom.value
  if (!contentWindow) return

  contentWindow.postMessage(
    { method: 'setAccessToken', params: { accessToken: accessToken.value } },
    targetDomain.value
  )
}

const handleMessage = (e: MessageEvent) => {
  const { method, error } = e.data
  if (error) {
    errorMessage.value = error
    console.error(error)
  }

  if (method === 'close') {
    iframePath.value = ''
    iframeKey.value = ''
  }
}

const handleLoad = () => {
  loadCount.value++
  errorMessage.value = ''
  if (type.value === TYPE.BY_API_KEY) {
    iframePath.value = `${targetDomain.value}/embed-3d-viewer/${frontierNo.value}`
    iframeKey.value = iframePath.value + apiKey.value + loadCount.value
  }
  if (type.value === TYPE.BY_ACCESS_TOKEN) {
    iframePath.value = `${targetDomain.value}/embed-3d-viewer/${materialId.value}`
    iframeKey.value = iframePath.value + accessToken.value + loadCount.value
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<style scoped>
#container {
  height: 100%;
  width: 100%;
}
#container .iframe {
  height: 100%;
  width: 100%;
}
</style>
