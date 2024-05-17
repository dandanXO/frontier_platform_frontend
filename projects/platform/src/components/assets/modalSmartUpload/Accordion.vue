<template lang="pug">
div(
  v-if="items.length > 0"
  class="border border-grey-150 rounded-lg p-4 mb-5 w-full flex flex-col"
)
  div(class="flex w-full content-center justify-between")
    p(class="font-bold" :class="titleClass") {{ title }}
    f-svg-icon(
      :iconName="isExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_up'"
      @click="isExpanded = !isExpanded"
      size="24"
    )
  div(class="flex flex-col w-full mt-4" v-if="isExpanded")
    div(class="flex flex-col")
      div(v-for="(item, index) in items" :key="item.file.name") 
        div(class="flex flex-col space-y-2 text-grey-900 font-semibold text-sm mb-2")
          div {{ item.file.name }}
          div(class="flex mb-2")
            div(class="text-grey-600 text-xs") {{ (item.size / 1048576).toFixed(2) }} MB
            div(v-if="item.invalidCode" class="flex items-center justify-center p-2")
              div(class="w-0.5 h-0.5 bg-grey-600 rounded-full") 
            div(v-if="item.invalidCode" class="text-red-600 text-xs") {{ getErrorMessage(item.invalidCode) }}
        hr(v-if="index < items.length - 1" class="border border-grey-150 mt-0.25 mb-2")
</template>

<script setup lang="ts">
import { INVALID_IMAGE_CODE } from '@/utils/constants'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  titleClass: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    required: true,
  },
  isExpanded: {
    type: Boolean,
    default: false,
  },
})

function getErrorMessage(invalidCode: number) {
  switch (invalidCode) {
    case INVALID_IMAGE_CODE.INVALID_RESOLUTION:
      return t('WW0170')
    case INVALID_IMAGE_CODE.INVALID_DIMENSION:
      return t('WW0171')
    case INVALID_IMAGE_CODE.INVALID_FILE_SIZE:
      return t('WW0169')
    default:
      return t('WW0168')
  }
}

const isExpanded = ref(props.isExpanded)
</script>
