<template lang="pug">
div(class="grid grid-cols-3 bg-grey-800 py-4")
  f-input-tap(
    class="col-start-2 justify-self-center"
    :theme="THEME.DARK"
    :optionList="optionList"
    :inputValue="cropMode"
    @update:inputValue="(v) => emit('update:cropMode', v)"
  )
  div(class="col-start-3 justify-self-end pr-8")
    f-button(
      :theme="THEME.DARK"
      type="text"
      size="sm"
      prependIcon="restore_original_state"
      @click="emit('restore')"
    ) {{ $t('EE0149') }}
</template>

<script setup lang="ts">
import { THEME, CROP_MODE } from '@/utils/constants'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{ cropMode: CROP_MODE }>()

const emit = defineEmits<{
  (e: 'restore'): void
  (e: 'update:cropMode', v: CROP_MODE): void
}>()

const optionList = [
  {
    label: t('EE0150'),
    selectValue: CROP_MODE.SQUARE,
    icon: 'crop',
  },
  {
    label: t('EE0151'),
    selectValue: CROP_MODE.PERSPECTIVE,
    icon: 'crop_skew',
  },
]
</script>

<style scoped></style>
