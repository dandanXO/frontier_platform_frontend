<template lang="pug">
div(
  v-if="items.length > 0"
  class="border border-grey-150 rounded-lg p-4 mb-5 w-full flex flex-col"
)
  div(class="flex w-full content-center justify-between")
    p(class="text-xl font-bold" :class="titleClass") {{ title }}
    f-svg-icon(
      :iconName="isExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
      @click="isExpanded = !isExpanded"
      size="24"
    )
  div(class="flex flex-col w-full mt-4" v-if="isExpanded")
    div(class="flex flex-col")
      div(v-for="(item, index) in items" :key="item.file.name") 
        div(class="flex flex-col space-y-2 text-grey-900")
          div(class="font-semibold text-sm") {{ item.file.name }}
          div(class="flex mb-2")
            div(class="text-grey-600 flex items-center text-xs") {{ (item.size / 1048576).toFixed(2) }} MB
            div(v-if="item.invalidCode" class="flex items-center justify-center p-2")
              div(class="w-0.5 h-0.5 bg-grey-600 rounded-full") 
            f-badge(v-if="item.invalidCode" type="critical" size="small") {{ item.invalidCode && getErrorMessage(item.invalidCode) }}
        hr(v-if="index < items.length - 1" class="border border-grey-150 my-2")
</template>

<script setup lang="ts">
import { INVALID_IMAGE_CODE } from '@/utils/constants'
import { bytesToSize } from '@frontier/lib'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { MIN_DIMENSION } from '../ModalSmartUpload.vue'

export interface ImageItem {
  file: File
  processing: number
  isRemoved: boolean
  type: string
  size: number
  width: number
  height: number
  invalidCode: number | null
}

interface Props {
  title: string
  titleClass: string
  items: ImageItem[]
  isExpanded?: boolean
}

const { t } = useI18n()

const props = defineProps<Props>()
const store = useStore()
const fileSizeMaxLimit = computed(
  () => store.getters['organization/materialAttachmentUploadSizeLimit']
)

const maxSize = computed(() => bytesToSize(fileSizeMaxLimit.value))

function getErrorMessage(invalidCode: number) {
  switch (invalidCode) {
    case INVALID_IMAGE_CODE.INVALID_RESOLUTION:
      return t('WW0170')
    case INVALID_IMAGE_CODE.INVALID_DIMENSION:
      return `${MIN_DIMENSION} x ${MIN_DIMENSION}`
    case INVALID_IMAGE_CODE.INVALID_FILE_SIZE:
      return `> ${maxSize.value}`
    default:
      return t('WW0173')
  }
}

const isExpanded = ref(props.isExpanded)
</script>
