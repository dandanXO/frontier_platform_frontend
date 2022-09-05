<template lang="pug">
div(class="rounded border border-primary-middle") 
  div(
    class="h-12 pl-7 pr-4 flex items-center justify-between"
    :class="[attachmentList.length > 0 ? 'text-primary hover:bg-black-200 cursor-pointer' : 'text-black-500', { 'bg-black-200': isExpand }]"
    @click="handleExpand"
  )
    p(class="text-caption font-bold") {{ $t("QQ0015") }} ({{ attachmentList.length }})
    f-svg-icon(v-if="!isExpand" iconName="keyboard_arrow_down" size="24")
    f-svg-icon(v-else iconName="keyboard_arrow_up" size="24")
  f-scrollbar-container(v-if="isExpand && attachmentList.length > 0" class="max-h-105")
    div(class="flex flex-wrap gap-5 p-6")
      attachment-item(
        v-for="(attachment, index) in attachmentList"
        :key="attachment.url"
        :attachmentList="attachmentList"
        :attachment="attachment"
        :index="index"
        :isReadOnly="true"
      )
</template>

<script setup>
import { ref } from 'vue'
import AttachmentItem from '@/components/common/material/attachment/AttachmentItem.vue'

const props = defineProps({
  attachmentList: {
    type: Array,
    required: true
  }
})

const isExpand = ref(false)

const handleExpand = () => {
  if (props.attachmentList.length > 0) {
    isExpand.value = !isExpand.value
  }
}
</script>
