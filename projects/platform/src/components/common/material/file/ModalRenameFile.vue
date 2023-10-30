<template lang="pug">
modal-behavior(
  :header="$t('rename')"
  :primaryBtnText="$t('save')"
  :primaryBtnDisabled="!isFileNameValid"
  primaryBtnIcon="done"
  :secondaryBtnText="$t('UU0026')"
  @click:primary="primaryHandler"
  @click:secondary="closeModal"
)
  div(class="min-w-88")
    f-input-text(
      v-model:textValue="fileName"
      :placeholder="$t('Enter file name')"
    )
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const props = defineProps<{
  fileName: string
  onSubmit: (newFileName: string) => void
}>()

const fileName = ref<string | null>(props.fileName)

const isFileNameValid = computed(() => {
  if (fileName.value == null) {
    return false
  }
  if (fileName.value.length === 0) {
    return false
  }

  if (fileName.value === props.fileName) {
    return false
  }

  return true
})

const closeModal = () => {
  store.dispatch('helper/closeModalBehavior')
}

const primaryHandler = async () => {
  if (fileName.value == null) {
    throw new Error('fileName is null')
  }
  props.onSubmit(fileName.value)
  closeModal()
}
</script>

<style scoped></style>
