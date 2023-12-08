<template lang="pug">
div(class="fixed w-screen h-full z-modal bg-grey-900 left-0 top-0 flex flex-col")
  view-mode-header(
    :currentIndex="currentIndex"
    :fileList="fileList"
    @close="emits('close')"
    @changeIndex="(index) => (currentIndex = index)"
  )
  view-mode-content(
    :index="currentIndex"
    :file="currentFile"
    :getMenuTree="getMenuTree"
  )
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import type { THEME } from '@frontier/constants'
import type { MenuTree } from '@frontier/ui-component'
import ViewModeHeader from '@/components/common/material/file/viewMode/ViewModeHeader.vue'
import ViewModeContent from '@/components/common/material/file/viewMode/ViewModeContent.vue'
import type { MaterialViewModeFile } from '@/types'

const props = defineProps<{
  startIndex: number
  fileList: MaterialViewModeFile[]
  getMenuTree?: ((id: number | string, theme: THEME) => MenuTree) | null
}>()

const emits = defineEmits<{
  (e: 'close'): void
}>()

const currentIndex = ref(props.startIndex)
const currentFile = computed(() => props.fileList[currentIndex.value])

watchEffect(() => {
  if (!props.fileList[currentIndex.value]) {
    currentIndex.value = props.fileList.length - 1
  }
})
</script>
