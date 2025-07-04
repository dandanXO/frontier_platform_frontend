<template lang="pug">
div(class="fixed w-screen h-full z-modal bg-grey-900 left-0 top-0 flex flex-col")
  div(v-if="error" class="flex items-center justify-center h-full")
    div(class="text-center text-grey-100")
      p(class="text-h4 mb-4") {{ error }}
      f-button(@click="closePreview") Close
  template(v-else)
    view-mode-header(
      :currentIndex="currentIndex"
      :fileList="fileList"
      @close="closePreview"
      @changeIndex="(index) => (currentIndex = index)"
    )
    view-mode-content(
      :index="currentIndex"
      :file="currentFile"
      :getMenuTree="getMenuTree"
    )
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import type { THEME } from '@frontier/constants'
import type { MenuTree } from '@frontier/ui-component'
import ViewModeHeader from '@/components/common/material/file/viewMode/ViewModeHeader.vue'
import ViewModeContent from '@/components/common/material/file/viewMode/ViewModeContent.vue'
import type { MaterialViewModeFile } from '@/types'

interface ViewModeService {
  startIndex: number
  fileList: ComputedRef<MaterialViewModeFile[]>
  getMenuTree?: ((id: number | string, theme: THEME) => MenuTree) | null
}

const route = useRoute()
const error = ref<string | null>(null)

// Parse data from URL parameters
const parsePreviewData = () => {
  const keyParam = route.query.key as string
  if (!keyParam) {
    throw new Error('No preview key provided')
  }

  try {
    const storedData = sessionStorage.getItem(keyParam)
    if (!storedData) {
      throw new Error('Preview data not found in session storage')
    }

    const previewData = JSON.parse(storedData)

    // Clean up the session storage after retrieving the data
    sessionStorage.removeItem(keyParam)

    return previewData
  } catch (error) {
    console.error('Failed to parse preview data:', error)
    throw new Error('Invalid preview data')
  }
}

let previewData: any
let fileList: any
let startIndex: number
let getMenuTree: any

try {
  previewData = parsePreviewData()
  fileList = ref(previewData.fileList || [])
  startIndex = previewData.startIndex || 0
  getMenuTree = null // No menu tree for standalone preview
} catch (err) {
  error.value = err instanceof Error ? err.message : 'Failed to load preview'
  fileList = ref([])
  startIndex = 0
  getMenuTree = null
}

const currentIndex = ref(startIndex)
const currentFile = computed(() => fileList.value[currentIndex.value])

const closePreview = () => {
  window.close()
}

watchEffect(() => {
  if (!fileList.value.length && !error.value) {
    return closePreview()
  }
})
</script>
