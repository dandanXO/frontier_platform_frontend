<template lang="pug">
//- Tag List
div(class="flex items-center flex-wrap gap-x-1.5 gap-y-1.5 pt-2")
  template(v-if="!isEditingTagList")
    f-tag(v-for="tag in stickerTagList" size="sm")
      p(
        class="h-full flex items-center"
        :class="{ 'bg-yellow-100': filter.tagList.includes(tag) }"
      ) {{ tag }}
    div(
      v-if="!isFilterDirty"
      class="group text-grey-300 flex items-center gap-x-1.5 cursor-pointer"
      @click.stop="onEditTagList"
    )
      f-svg-icon(
        iconName="create"
        size="16"
        class="text-grey-300 group-hover:text-grey-600"
      )
      span(
        v-if="stickerTagList.length === 0"
        class="text-caption group-hover:text-grey-600"
      ) {{ $t('TT0058') }}
//- Tag List Input
div(v-if="isEditingTagList" @click.stop)
  sticker-tag-input(
    ref="refStickerTagInput"
    v-model:inputTagList="editingTagList"
    :revealForever="isEditingTagList"
  )
  div(class="flex items-center justify-end gap-x-2 pt-4")
    f-button(type="text" size="sm" @click="cancelEditTagList") {{ $t('UU0002') }}
    f-button(size="sm" @click="updateStickerTagList") {{ $t('UU0018') }}
</template>

<script setup>
import { ref, nextTick, computed } from 'vue'
import StickerTagInput from '@/components/sticker/StickerTagInput.vue'
import { useStore } from 'vuex'

const store = useStore()

const props = defineProps({
  stickerId: {
    type: Number,
    required: true,
  },
  stickerTagList: {
    type: Array,
    required: true,
  },
})

const refStickerTagInput = ref(null)
const isEditingTagList = ref(false)
const editingTagList = ref([])
const onEditTagList = async () => {
  isEditingTagList.value = true
  await nextTick()
  editingTagList.value.push(...props.stickerTagList)
  refStickerTagInput.value.focus()
}
const updateStickerTagList = () => {
  store.dispatch('sticker/updateStickerTagList', {
    stickerId: props.stickerId,
    tagList: editingTagList.value,
  })
  cancelEditTagList()
}
const cancelEditTagList = () => {
  isEditingTagList.value = false
  editingTagList.value.length = 0
}

defineExpose({
  isEditingTagList,
})

const isFilterDirty = computed(() => store.getters['sticker/isFilterDirty'])
const filter = computed(() => store.getters['sticker/filter'])
</script>
