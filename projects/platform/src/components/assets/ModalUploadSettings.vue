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
  hr(class="w-full border-grey-200 my-4")
  div(class="flex justify-start")
    div(class="flex flex-row font-bold w-1/2")
      div(class="flex items-start mr-2")
        f-svg-icon(iconName="mail" size="26" class="md:left-5 top-7 text-grey-900")
      div(class="flex flex-col items-start")
        p {{ $t('DD0086') }}
        p(class="flex cursor-pointer mt-2 text-primary-500" @click="copyEmailLink") {{ ogUploadMaterialEmail }}
          f-svg-icon(
            iconName="content_copy"
            size="24"
            class="md:left-5 text-primary-500 top-7"
          )
    div(class="w-[1px] border-r border-grey-200")
    div(class="flex flex-row font-bold w-1/2 ml-4")
      div(class="flex items-start mr-2")
        f-svg-icon(iconName="qr_code" size="26" class="md:left-5 top-7 text-grey-900")
      div(class="flex flex-col items-start")
        p(class="flex items-center") {{ $t('FF0091') }}
          f-tooltip-toggle(
            placement="bottom"
            :triggerText="''"
            triggerIcon="info_outline"
            size="20"
          )
            template(#slot:tooltip-toggle-content)
              i18n-t(
                keypath="DD0010"
                tag="div"
                class="pb-1 text-caption/1.3 text-grey-50"
                scope="global"
              )
        p(
          class="flex cursor-pointer mt-2 text-primary-500"
          @click="printBackSideLabel"
        ) {{ $t('FF0090') }}
          f-svg-icon(
            iconName="open_in_new"
            size="24"
            class="md:left-5 text-primary-500 top-7"
          )
</template>

<script setup lang="ts">
import { useAssetsStore } from '@/stores/assets'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { copyText } from '@frontier/lib'
import { useNotifyStore } from '@/stores/notify'
import useCurrentUnit from '@/composables/useCurrentUnit'
import usePrint from '@/composables/material/usePrint'

const { printBackSideLabel } = usePrint()
const notify = useNotifyStore()
const store = useStore()
const { t } = useI18n()
const { ogBaseAssetsApi } = useAssetsStore()
const isLoading = ref(true)
const isEnableOCR = ref(false)
const isViewOnly = ref(true)
const { ogUploadMaterialEmail } = useCurrentUnit()

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

const copyEmailLink = () => {
  copyText(ogUploadMaterialEmail.value || '')
  notify.showNotifySnackbar({
    messageText: t('BB0108'),
    bgColor: 'bg-grey-50',
    textColor: 'text-grey-900',
  })
}
</script>
