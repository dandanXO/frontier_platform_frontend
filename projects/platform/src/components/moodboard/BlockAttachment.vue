<template lang="pug">
div(class="rounded border border-grey-150") 
  div(
    class="h-12 pl-7 pr-4 flex items-center justify-between"
    :class="[attachmentList.length > 0 ? 'text-grey-900 hover:bg-grey-100 cursor-pointer' : 'text-grey-250', { 'bg-grey-100': isExpand }]"
    @click="handleExpand"
  )
    p(class="text-caption font-bold") {{ $t('RR0298') }} ({{ attachmentList.length }})
    f-svg-icon(v-if="!isExpand" iconName="keyboard_arrow_down" size="24")
    f-svg-icon(v-else iconName="keyboard_arrow_up" size="24")
  f-scrollbar-container(v-if="isExpand && attachmentList.length > 0" class="max-h-105")
    div(class="flex flex-wrap gap-5 p-6")
      attachment-card(
        v-for="(attachment, index) in attachmentList"
        :key="attachment.url"
        v-bind="mapToCardProps(attachment)"
        @click="openAttachmentPreview(index)"
      )
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import type { MoodboardAllOfAttachmentList } from '@frontier/platform-web-sdk'
import AttachmentCard from '../common/material/attachment/AttachmentCard.vue'
import type { EXTENSION } from '@frontier/constants'
import type { MaterialViewModeFile } from '@/types'

const store = useStore()

const props = defineProps<{
  attachmentList: MoodboardAllOfAttachmentList[]
}>()

const isExpand = ref(false)

const handleExpand = () => {
  if (props.attachmentList.length > 0) {
    isExpand.value = !isExpand.value
  }
}

const mapToCardProps = (attachment: MoodboardAllOfAttachmentList) => ({
  thumbnailUrl: attachment.url,
  originalUrl: attachment.url,
  extension: attachment.extension as EXTENSION,
  displayFileName: attachment.displayFileName,
})

const fileList = computed<MaterialViewModeFile[]>(() =>
  props.attachmentList.map((a) => ({
    id: a.attachmentId,
    originalUrl: a.url,
    displayUrl: a.url,
    thumbnailUrl: a.url,
    displayName: a.displayFileName,
    extension: a.extension as EXTENSION,
  }))
)

const openAttachmentPreview = (index: number) => {
  store.dispatch('helper/pushModal', {
    component: 'modal-view-mode',
    properties: {
      viewModeService: {
        startIndex: index,
        fileList,
      },
    },
  })
}
</script>
