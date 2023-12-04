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
      :acceptType="[EXTENSION.XLSX]"
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

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import { UPLOAD_ERROR_CODE } from '@/utils/constants'
import { useAssetsStore } from '@/stores/assets'
import { uploadFileToS3 } from '@/utils/fileUpload'
import type {
  BatchUploadAssetsMaterialList200Response,
  BatchUploadAssetsMaterialList200ResponseAllOfResultErrorListInner,
} from '@frontier/platform-web-sdk'
import { EXTENSION } from '@frontier/constants'
import { PROGRESS_TAB } from '@/utils/constants'

const { t, locale } = useI18n()
const store = useStore()
const { ogBaseAssetsApi } = useAssetsStore()
const errorCode = ref<UPLOAD_ERROR_CODE>()
const showErrorList = ref(false)
const disabledUpload = computed(
  () =>
    !uploadedFile.value || showErrorList.value || errorCode.value !== undefined
)
const { goToProgress, goToAssets } = useNavigation()
const errorList = ref<
  BatchUploadAssetsMaterialList200ResponseAllOfResultErrorListInner[]
>([])
const uploadedFile = ref<File>()

const fileSizeMaxLimit = 20 * Math.pow(1024, 2)

const excelTemplateDownloadLink = computed(() => {
  const endpoint = import.meta.env.VITE_APP_WEB_URL
  const fileNameLocaleMap = {
    'zh-TW': 'MassUploadFromat(中文版)',
    'en-US': 'MassUploadFromat(英文版)',
    'ja-JP': 'MassUploadFromat(日文版)',
  }
  const lang = locale.value as keyof typeof fileNameLocaleMap
  return `${endpoint}/Resource/MaterialExportTemplate/${fileNameLocaleMap[lang]}.xlsx`
})

const onFinish = (file: File) => {
  uploadedFile.value = file
  errorCode.value = undefined
  showErrorList.value = false
}

const handleUpload = async () => {
  try {
    if (!uploadedFile.value) {
      return
    }

    store.dispatch('helper/pushModalLoading')

    const { s3UploadId, fileName } = await uploadFileToS3(
      uploadedFile.value,
      uploadedFile.value.name
    )
    await ogBaseAssetsApi('batchUploadAssetsMaterialList', {
      s3UploadId,
      fileName,
    })
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
          goToProgress({}, PROGRESS_TAB.EXCEL)
        },
        secondaryHandler: () => {
          store.dispatch('helper/closeModalBehavior')
          goToAssets()
        },
      },
    })
  } catch (error) {
    const { code, result } = error as BatchUploadAssetsMaterialList200Response
    store.dispatch('helper/closeModalLoading')

    switch (code) {
      case 'ERR0015':
        errorCode.value = UPLOAD_ERROR_CODE.INVALID_TYPE
        break
      case 'ERR0017':
        showErrorList.value = true
        errorList.value = result?.errorList ?? []
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
