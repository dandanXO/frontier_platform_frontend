<template>
  <div class="flex flex-col gap-4 w-full">
    <f-alert type="info" v-if="isLimitedContent">
      <template #content>
        <div class="flex flex-col gap-2 text-caption">
          <p class="text-primary-inverse text-xs">
            {{ $t('RR0480') }}
          </p>
          <div>
            <f-button
              size="xsm"
              type="text"
              class="!p-0 underline"
              @click="openModalSendFeedback"
            >
              {{ $t('RR0481') }}
            </f-button>
          </div>
        </div>
      </template>
    </f-alert>
    <div :class="classContainer">
      <div
        v-for="(model, index) in models"
        :key="model.id"
        class="border border-grey-700 rounded shrink-0 bg-cover bg-center transition-opacity duration-200"
        :class="getClassModelsContainer(model)"
        @click="model.isLocked ? noop : $emit('modelClick', index)"
        :style="`background-image: url(${model.thumbnail});`"
      >
        <div
          v-if="model.isLocked"
          class="inset-0 h-full flex items-center justify-center bg-[rgba(66,67,67,0.8)] text-secondary-text"
        >
          <f-svg-icon iconName="lock" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { noop } from '@vueuse/core'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import type { Material3DViewerOrgGetAllModels200ResponseAllOfResultModelListInner } from '@frontier/platform-web-sdk'
import { useConstants } from '@/utils/constants'

const { t } = useI18n()
const props = withDefaults(
  defineProps<{
    models: Material3DViewerOrgGetAllModels200ResponseAllOfResultModelListInner[]
    currentModel: Material3DViewerOrgGetAllModels200ResponseAllOfResultModelListInner
    itemSize?: number
    classContainer?: string
  }>(),
  {
    itemSize: 15,
  }
)
const { FEEDBACK_CATEGORY } = useConstants()
const store = useStore()

const isLimitedContent = computed(() =>
  props.models.find((model) => model.isLocked)
)

const getClassModelsContainer = (
  model: Material3DViewerOrgGetAllModels200ResponseAllOfResultModelListInner
) => {
  const result = [`h-${props.itemSize} w-${props.itemSize} `]

  result.push(
    props.currentModel.id === model.id
      ? 'border-brand-solid'
      : 'border-grey-700'
  )

  if (!model.isLocked) {
    result.push('hover:opacity-70 cursor-pointer')
  }
  return result
}
defineEmits<{
  (e: 'modelClick', modelIndex: number): void
}>()

const openModalSendFeedback = () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-send-feedback',
    properties: {
      title: t('RW0003'),
      category: FEEDBACK_CATEGORY.value.PAYMENT.value,
    },
  })
}
</script>
