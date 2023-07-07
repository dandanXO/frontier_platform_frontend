<template lang="pug">
modal-behavior(
  :header="$t('DD0035')"
  :primaryBtnText="$t('UU0022')"
  :primaryBtnDisabled="disabledUpload"
  @click:primary="handleUpload"
)
  template(#note)
    div(
      v-if="showErrorList"
      class="text-caption text-red-400 flex items-center"
      data-cy="modal-mass-upload_failed"
    )
      f-svg-icon(iconName="warning_amber_round" size="14" class="mr-1.5")
      span(class="pr-0.5") {{ $t('WW0037') }}
      span(class="underline cursor-pointer" @click="openModalErrorList") {{ $t('UU0066') }}
    file-upload-error-note(
      v-else-if="errorCode"
      :errorCode="errorCode"
      :fileSizeMaxLimit="fileSizeMaxLimit"
      data-cy="modal-mass-upload_error"
    )
  div(class="w-94")
    f-input-file(
      class="w-full mb-12"
      :label="$t('DD0038')"
      v-model:fileName="fileName"
      :acceptType="acceptType"
      :maximumSize="fileSizeMaxLimit"
      :text="$t('UU0025')"
      @finish="onFinish"
      @error="errorCode = $event"
    )
    div(class="text-grey-900 text-caption leading-1.6")
      i18n-t(keypath="DD0036" tag="p" scope="global")
        template(#UU0065)
          a(
            target="_blank"
            class="text-cyan-400 cursor-pointer"
            :href="excelTemplateDownloadLink"
          ) {{ $t('UU0065') }}
      p {{ $t('DD0037') }}
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import { UPLOAD_ERROR_CODE } from '@/utils/constants'

const { t, locale } = useI18n()
const store = useStore()
const fileName = ref('')
const errorCode = ref('')
const showErrorList = ref(false)
const disabledUpload = computed(
  () =>
    !fileName.value.length > 0 ||
    showErrorList.value ||
    errorCode.value.length !== 0
)
const { goToProgress, goToAssets } = useNavigation()
let errorList
let binaryFile

const fileSizeMaxLimit = 20 * Math.pow(1024, 2)
const acceptType = ['xlsx']

const excelTemplateDownloadLink = computed(() => {
  const endpoint = import.meta.env.VITE_APP_WEB_URL
  const fileNameLocaleMap = {
    'zh-TW': 'MassUploadFromat(中文版)',
    'en-US': 'MassUploadFromat(英文版)',
  }
  return `${endpoint}/Resource/MaterialExportTemplate/${
    fileNameLocaleMap[locale.value]
  }.xlsx`
})

const onFinish = (file) => {
  binaryFile = file
  errorCode.value = ''
  showErrorList.value = false
}

const handleUpload = async () => {
  try {
    store.dispatch('helper/pushModalLoading')
    await store.dispatch('assets/batchUpload', { xlsxFile: binaryFile })
    store.dispatch('helper/clearModalPipeline')
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-how-to-scan',
      properties: {
        header: t('RR0164'),
        title: t('DD0109'),
        primaryBtnText: t('UU0087'),
        secondaryBtnText: t('UU0093'),
        primaryHandler: () => {
          store.dispatch('helper/closeModalBehavior')
          goToProgress('excel')
        },
        secondaryHandler: () => {
          store.dispatch('helper/closeModalBehavior')
          goToAssets()
        },
      },
    })
  } catch (error) {
    const { code, result } = error
    store.dispatch('helper/closeModalLoading')

    switch (code) {
      case 'ERR0015':
        errorCode.value = UPLOAD_ERROR_CODE.INVALID_TYPE
        break
      case 'ERR0017':
        showErrorList.value = true
        errorList = result.errorList
        break
      default:
        throw error
    }
  }
}

const openModalErrorList = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-mass-upload-error-list',
    properties: { errorList },
  })
}
</script>
