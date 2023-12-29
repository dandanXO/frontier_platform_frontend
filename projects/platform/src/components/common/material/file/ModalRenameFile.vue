<template lang="pug">
modal-behavior(
  :theme="theme"
  :header="$t('RR0302')"
  :primaryBtnText="$t('UU0018')"
  :primaryBtnDisabled="!isFileNameValid"
  primaryBtnIcon="done"
  :secondaryBtnText="$t('UU0026')"
  @click:primary="primaryHandler"
  @click:secondary="closeModal"
)
  div(class="min-w-88")
    f-input-text(
      :theme="theme"
      v-model:textValue="fileName"
      :placeholder="$t('MI0086')"
    )
</template>

<script setup lang="ts">
import type { THEME } from '@frontier/constants'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const props = defineProps<{
  theme: THEME
  fileName: string
  onSubmit: (newFileName: string) => Promise<void>
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
  await props.onSubmit(fileName.value)
  closeModal()
}
</script>

<style scoped></style>
