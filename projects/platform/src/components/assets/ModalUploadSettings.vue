<template lang="pug">
modal-behavior(
  :header="$t('DD0135')"
  :primaryBtnText="$t('UU0042')"
  :primaryBtnDisabled="primaryBtnDisabled"
  :secondaryBtnText="$t('UU0002')"
  @click:primary="primaryBtnHandler"
  @click:secondary="closeModal"
) 
  div(class="w-160")
    div(
      v-if="isLoading"
      class="w-full h-full flex justify-center items-center"
      data-cy="loading-indicator"
    )
      f-svg-icon(iconName="loading" size="92" class="text-primary-400")
    div(v-else)
      div(class="flex justify-between content-center text-center")
        div(
          class="flex justify-between content-center text-center align-middle flex-wrap gap-2"
        )
          p(class="font-bold") {{ $t('DD0136') }}
        f-input-switch(
          @update:inputValue="onSwitchOCRConfig"
          :inputValue="isEnableOCR"
          iconSize="40"
        )
      div
        p {{ $t('DD0137') }}
</template>

<script setup lang="ts">
import { useAssetsStore } from '@/stores/assets'
import { TOOLTIP_PLACEMENT } from '@frontier/constants'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const { ogBaseAssetsApi } = useAssetsStore()
const isLoading = ref(true)
const isEnableOCR = ref(false)
const isViewOnly = ref(true)

const closeModal = () => store.dispatch('helper/closeModalBehavior')

onMounted(async () => {
  try {
    const { data } = await ogBaseAssetsApi('smartUploadAssetsGetConfig')
    isEnableOCR.value = !!data.result?.isEnableOCR
  } catch (error) {
    console.error('Error message:', error)
  } finally {
    isLoading.value = false
  }
})

const primaryBtnDisabled = computed(() => isLoading.value || isViewOnly.value)

const primaryBtnHandler = async () => {
  isLoading.value = true
  try {
    await ogBaseAssetsApi('smartUploadAssetsUpdateConfig', {
      isEnableOCR: isEnableOCR.value,
    })
  } catch (error) {
    console.error('Error message:', error)
    isEnableOCR.value = false
  } finally {
    isLoading.value = false
    closeModal()
  }
}

const onSwitchOCRConfig = (value: boolean) => {
  isEnableOCR.value = value
  isViewOnly.value = false
}
</script>
