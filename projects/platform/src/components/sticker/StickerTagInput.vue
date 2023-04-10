<template lang="pug">
f-select-input(
  v-if="innerInputTagList.length !== 0 || isEditing || revealForever"
  ref="reFSelectInput"
  v-model:selectValue="innerInputTagList"
  multiple
  size="md"
  prependIcon="tag"
  :dropdownMenuTree="menuTagList"
  @addNew="addNewTag"
  @collapse="isEditing = false"
)
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const props = defineProps({
  inputTagList: {
    type: Array,
    required: true,
  },
  revealForever: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:inputTagList'])

const innerInputTagList = computed({
  get: () => props.inputTagList,
  set: (v) => emit('update:inputTagList', v),
})

const newAddTagList = ref([]) // 前端暫時新增的
const sourceTagList = computed(() => store.getters['sticker/sourceTagList'])
const menuTagList = computed(() => ({
  scrollAreaMaxHeight: 'max-h-45',
  blockList: [
    {
      menuList: newAddTagList.value.concat(sourceTagList.value).map((tag) => ({
        title: tag,
        selectValue: tag,
      })),
    },
  ],
}))
const addNewTag = (tag) => {
  newAddTagList.value.push(tag)
}

const reFSelectInput = ref(null)
const isEditing = ref(false)

defineExpose({
  focus: async () => {
    isEditing.value = true
    await nextTick()
    reFSelectInput.value.focus()
  },
})
</script>
