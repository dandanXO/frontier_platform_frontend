<template lang="pug">
div(class="w-90 md:w-200")
  div(
    class="relative h-80 md:h-113 flex flex-col justify-center items-center"
    :class="[extensionInfo.display === 'video' ? 'bg-grey-900' : 'bg-grey-100']"
  )
    img(
      v-if="extensionInfo.display === 'image'"
      :src="currentAttachment.url"
      class="max-h-full max-w-full"
    )
    video(
      v-else-if="extensionInfo.display === 'video'"
      class="max-h-113"
      :key="currentAttachment.url"
      controls
    )
      source(:src="currentAttachment.url" type="video/mp4")
    f-svg-icon(
      v-else
      :iconName="extensionInfo.placeholder"
      size="110"
      class="text-grey-900"
    )
    a(
      v-if="extensionInfo.display === 'open-new-tab'"
      class="flex items-center"
      :href="currentAttachment.url"
      target="_blank"
    )
      f-svg-icon(iconName="open_in_new" size="20" class="text-grey-900")
      p(class="text-body2 leading-1.6 text-grey-900 pl-1.5") {{ $t('DD0070') }}
  div(class="h-16 md:h-25 bg-grey-0 flex justify-between items-center px-4 md:px-8")
    div(class="flex-1 flex items-center text-grey-900")
      div(v-if="isEditingName" class="flex-1 px-2.5 py-4 flex gap-2")
        f-input-text(
          class="flex-1"
          :placeholder="$t('TT0148')"
          v-model:textValue="currentName"
        )
        div(class="flex flex-row gap-2 items-center")
          f-svg-icon(
            class="cursor-pointer"
            :class="isNameValid ? 'text-primary-400' : 'text-grey-400'"
            iconName="done"
            size="24"
            @click="handleSubmitRename"
          )
          f-svg-icon(
            class="cursor-pointer"
            iconName="clear"
            size="24"
            @click="doneEdit"
          )
      span(v-else class="text-caption md:text-h6/1.6 mr-5 line-clamp-1") {{ currentAttachment.displayFileName }}
      f-popper(placement="right-start" class="cursor-pointer")
        template(#trigger)
          f-svg-icon(
            iconName="more_horiz"
            size="24"
            class="text-grey-600 hover:text-primary-400"
          )
        template(#content="{ collapsePopper }")
          f-contextual-menu(
            :menuTree="getMenuTree(currentIndex)"
            @click:menu="collapsePopper"
          )
    div(class="flex justify-between items-center gap-5 flex-shrink-0")
      f-svg-icon(
        iconName="keyboard_arrow_left"
        size="24"
        class="cursor-pointer"
        @click="getLast"
      )
      span(class="text-grey-900 text-caption md:text-h6 font-bold") {{ currentIndex + 1 }} / {{ fileList.length }}
      f-svg-icon(
        iconName="keyboard_arrow_right"
        size="24"
        class="cursor-pointer"
        @click="getNext"
      )
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { EXTENSION } from '@frontier/lib'
import type { Attachment } from '@/composables/material/useAttachmentSelect'
import type { MenuTree } from '@frontier/ui-component/src/types'
import useNameEditor from '@/composables/useNameEditor'

const props = defineProps<{
  fileList: Attachment[]
  index: number
  getMenuTree: (index: number) => MenuTree
  onRename: (index: number) => void
  onRemove: (index: number, attachment: Attachment) => void
}>()

const { PNG, JPEG, JPG, GIF, MOV, MP4, ZIP, PDF, SCCH, YDT } = EXTENSION

const extensionInfoMap = {
  [PNG]: { placeholder: null, display: 'image' },
  [JPG]: { placeholder: null, display: 'image' },
  [JPEG]: { placeholder: null, display: 'image' },
  [SCCH]: { placeholder: null, display: 'no-preview' },
  [YDT]: { placeholder: null, display: 'no-preview' },
  [GIF]: { placeholder: 'file_gif', display: 'image' },
  [MOV]: { placeholder: 'file_mov', display: 'video' },
  [MP4]: { placeholder: 'file_mp4', display: 'video' },
  [PDF]: { placeholder: 'file_pdf', display: 'open-new-tab' },
  [ZIP]: { placeholder: 'file_zip', display: 'no-preview' },
}

const extensionInfo = computed(() => {
  const ext = currentAttachment.value.extension
  const result = extensionInfoMap[ext as keyof typeof extensionInfoMap]
  if (!result) {
    throw new Error('invalid extension type')
  }
  return result
})

const currentIndex = ref(props.index)
const currentAttachment = computed(() => props.fileList[currentIndex.value])

const { isEditingName, currentName, isNameValid, doneEdit } = useNameEditor(
  computed(() => currentAttachment.value.displayFileName)
)

watch(currentIndex, () => {
  doneEdit()
})

const getNext = () => {
  if (currentIndex.value < props.fileList.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
}

const getLast = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = props.fileList.length - 1
  }
}

const handleSubmitRename = () => {
  props.onRename(currentIndex.value, currentName.value)
  doneEdit()
}
</script>
