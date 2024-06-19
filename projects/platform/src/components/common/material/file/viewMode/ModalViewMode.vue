<template lang="pug">
div(class="fixed w-screen h-full z-modal bg-grey-900 left-0 top-0 flex flex-col")
  view-mode-header(
    :currentIndex="currentIndex"
    :fileList="fileList"
    @close="closeModal"
    @changeIndex="(index) => (currentIndex = index)"
  )
  view-mode-content(
    :index="currentIndex"
    :file="currentFile"
    :getMenuTree="getMenuTree"
  )
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, toRaw, type ComputedRef } from 'vue'
import { useStore } from 'vuex'
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
/**
 * 因為 ModalPipeline 會將 properties 透過 v-bind 解構傳入，而解構會造成響應式失效
 * 所以多包一層 viewModeService 來解決此問題。
 */
export interface PropsModalViewMode {
  viewModeService: ViewModeService
}

const props = defineProps<PropsModalViewMode>()

const { startIndex, fileList, getMenuTree } = toRaw(props.viewModeService)

const store = useStore()

const currentIndex = ref(startIndex)
const currentFile = computed(() => fileList.value[currentIndex.value])

const closeModal = () => {
  store.dispatch('helper/closeModal')
}

watchEffect(() => {
  if (!fileList.value.length) {
    return closeModal()
  }
})
</script>
