<template lang="pug">
modal-behavior(
  :header="$t('DD0035')"
  :primaryBtnText="$t('UU0022')"
  :primaryBtnDisabled="disabledUpload"
  @click:primary="handleUpload"
)
  template(#note)
    div(v-if="showErrorList" class="text-caption text-warn flex items-center")
      svg-icon(iconName="warning_amber_round" size="14" class="mr-1.5")
      span(class="pr-0.5") {{ $t("WW0037") }}
      span(class="underline cursor-pointer" @click="openModalErrorList") {{ $t("UU0066") }}
    file-upload-error-note(v-else-if="errorCode" :errorCode="errorCode" :fileSizeMaxLimit="fileSizeMaxLimit")
  div(class="w-94")
    div(class="mb-5")
      input-text-btn(
        class="w-full mb-1.5"
        disabledInput
        :label="$t('DD0038')"
        :textValue="fileName"
        :clearable="false"
        :buttonLabel="$t('UU0025')"
        :customErrorMsg="false"
        @click:button="chooseFile"
      )
      p(class="text-black-800 text-caption mb-2") {{ $t("RR0243") }} {{acceptType.join(', ').toUpperCase()}}
      p(class="text-black-800 text-caption") {{$t("RR0145")}} {{fileSizeMaxLimit}} MB
    div(class="text-primary text-caption leading-1.6")
      i18n-t(keypath="DD0036" tag="p" scope="global")
        template(#UU0065)
          a(
            v-if="locale === 'en-US'"
            target="_blank"
            class="text-assist-blue cursor-pointer"
            href="https://textile-dev.frontier.cool/Resource/MaterialExportTemplate/MassUploadFromat(英文版).xlsx"
          )  {{ $t("UU0065") }}
          a(
            v-else
            target="_blank"
            class="text-assist-blue cursor-pointer"
            href="https://textile-dev.frontier.cool/Resource/MaterialExportTemplate/MassUploadFromat(中文版).xlsx"
          )  {{ $t("UU0065") }}
      p {{ $t("DD0037") }}
</template>

<script setup>
import { FileOperator } from '@/utils/fileOperator'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import { UPLOAD_ERROR_CODE } from '@/utils/constants.js'

const { t, locale } = useI18n()
const store = useStore()
const fileName = ref('')
const errorCode = ref('')
const showErrorList = ref(false)
const disabledUpload = computed(() => !fileName.value.length > 0 || showErrorList.value || errorCode.value.length !== 0)
const { goToProgress, goToAssets } = useNavigation()
let errorList
let binaryFile

const fileSizeMaxLimit = 20
const acceptType = ['xlsx']
const fileOperator = new FileOperator(acceptType, fileSizeMaxLimit, true)

const chooseFile = () => {
  fileOperator.upload()
}

fileOperator.on('finish', (file) => {
  binaryFile = file
  fileName.value = file.name
  errorCode.value = ''
  showErrorList.value = false
})

fileOperator.on('selfDefinedError', (code) => {
  errorCode.value = code
})

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
        }
      }
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
    properties: { errorList }
  })
}
</script>
