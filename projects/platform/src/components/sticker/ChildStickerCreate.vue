<template lang="pug">
div(class="relative w-full overflow-hidden")
  div(class="flex items-center justify-between")
    div(class="flex items-center gap-x-1 text-grey-300")
      f-svg-icon(iconName="sticker")
      span(class="text-caption") {{ `#${order}` }}
    f-svg-icon(
      iconName="clear"
      size="20"
      class="text-grey-600 cursor-pointer"
      @click="emit('close')"
    )
  div
    div(class="min-h-25 pt-2.5 pb-2 box-content")
      common-sticker-text-editor(
        ref="refChildStickerTextEditor"
        v-model:content="content"
        :stickerId="stickerId"
        :addTo="addTo"
        @close="emit('close')"
      )
    sticker-tag-input(
      ref="refChildStickerTagInput"
      v-model:inputTagList="tagList"
      class="mb-2"
    )
    common-sticker-text-editor-footer(
      v-model:tagList="tagList"
      :addTo="addTo"
      :addFrom="addFrom"
      :addButtonDisabled="content.length === 0"
      @mentionTrigger="() => refChildStickerTextEditor.mentionPerson()"
      @tagInputTrigger="() => refChildStickerTagInput.focus()"
      @addButtonClick="createChildSticker"
    )
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import useStickerAddFromMenu from '@/composables/useStickerAddFromMenu'
import StickerTagInput from '@/components/sticker/StickerTagInput.vue'
import CommonStickerTextEditor from '@/components/sticker/stickerTextEditor/CommonStickerTextEditor.vue'
import CommonStickerTextEditorFooter from '@/components/sticker/stickerTextEditor/CommonStickerTextEditorFooter.vue'

const tempCreatingStickerId = uuidv4()

const emit = defineEmits('close')
const props = defineProps({
  order: {
    type: Number,
    required: true,
  },
  stickerId: {
    type: Number,
    required: true,
  },
  addTo: {
    type: Number,
    required: true,
  },
})

const store = useStore()
const menuAddFrom = useStickerAddFromMenu()

// form data of creating digit thread or sticker
const content = ref('')
const tagList = ref([])
const refChildStickerTagInput = ref(null)
const refChildStickerTextEditor = ref()

const addFrom = computed(() => {
  const menuItem = menuAddFrom.value.blockList[0].menuList.find(
    (v) =>
      v.selectValue.addFromOGId ===
      store.getters['sticker/digitalThread'].sideOGId
  )
  return {
    name: menuItem.title,
    labelColor: menuItem.labelColor,
  }
})

const createChildSticker = async () => {
  await store.dispatch('sticker/createChildSticker', {
    stickerId: props.stickerId,
    content: content.value,
    tagList: tagList.value,
  })
  emit('close')
}

watch(content, (contentValue) => {
  if (contentValue) {
    store.dispatch('sticker/addTempCreateStickerId', tempCreatingStickerId)
  } else {
    store.dispatch('sticker/removeTempCreateStickerId', tempCreatingStickerId)
  }
})

onUnmounted(() => {
  store.dispatch('sticker/removeTempCreateStickerId', tempCreatingStickerId)
})
</script>
