<template lang="pug">
div(class="flex items-center text-warn-middle leading-1.6")
  f-svg-icon(iconName="info_outline" size="14" class="mr-1.5")
  div {{ errorMsg }}
</template>

<script>
export default {
  name: 'FileUploadErrorNote'
}
</script>

<script setup>
import { UPLOAD_ERROR_CODE } from '@/utils/constants.js'
import { computed } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  errorCode: {
    type: [Number, String],
    default: ''
  },
  fileSizeMaxLimit: {
    type: Number
  }
})

const { t } = useI18n()

const errorMsg = computed(() => {
  const { INVALID_TYPE, EXCEED_LIMIT, TOO_SMALL } = UPLOAD_ERROR_CODE

  if (props.errorCode === INVALID_TYPE) {
    return t('RR0144')
  } else if (props.errorCode === EXCEED_LIMIT) {
    return t('RR0145') + props.fileSizeMaxLimit + 'MB'
  } else if (props.errorCode === TOO_SMALL) {
    return t('WW0018')
  } else {
    return ''
  }
})

</script>

