<template lang="pug">
div(class="w-116")
  div(class="px-8 relative")
    div(class="text-primary text-h6 font-bold mb-7.5 text-center") {{ $t("DD0035") }}
    i18n-t(keypath="DD0036" tag="p" class="text-center text-black-900 text-body2 line-height-1.6")
      template(#UU0065)
        a(
          v-if="locale === 'en-US'"
          target="_blank"
          class='text-assist-blue cursor-pointer'
          href="https://textile-dev.frontier.cool/Resource/MaterialExportTemplate/MassUploadFromat(英文版).xlsx"
        )  {{ $t("UU0065") }}
        a(
          v-else
          target="_blank"
          class='text-assist-blue cursor-pointer'
          href="https://textile-dev.frontier.cool/Resource/MaterialExportTemplate/MassUploadFromat(中文版).xlsx"
        )  {{ $t("UU0065") }}
    div(class="text-center text-primary text-body2 line-height-1.6") {{ $t("DD0037") }}
    input-text-btn(
      class="w-full mt-7.5"
      disabledInput
      :label="$t('DD0038')"
      :textValue="fileName"
      :clearable="false"
      :buttonLabel="$t('UU0025')"
      :customErrorMsg="false"
      @click:button="chooseFile"
      required
    )
      template(#errorMsg v-if="showErrorList")
        p(class="absolute pt-11 text-caption text-warn")
          span(class="pr-0.5") {{ $t("WW0037") }}
          span(class="underline cursor-pointer" @click="openModalErrorList") {{ $t("UU0066") }}
      template(#errorMsg v-else)
        p(class="absolute pt-11 text-caption text-warn") {{errorMsg}}
    p(class="text-primary text-caption line-height-1.6") {{ $t("DD0071") }}
    p(class="text-primary text-caption line-height-1.6") {{ $t("DD0056") }}
  btn-group(
    class="h-25 mt-5"
    :secondaryButton="false"
    :primaryText="$t('UU0022')"
    :primaryButtonDisabled="fileName === ''"
    @click:primary="handleUpload"
  )
</template>

<script>
import { FileOperator } from '@/utils/fileOperator'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'

export default {
  name: 'ModalMassUpload',
  setup () {
    const { t, locale } = useI18n()
    const store = useStore()
    const fileName = ref('')
    const errorMsg = ref('')
    const showErrorList = ref(false)
    const { goToAssets } = useNavigation()
    let errorList
    let binaryFile

    const fileOperator = new FileOperator(['xlsx'], 20)

    const chooseFile = () => {
      fileOperator.upload()
    }

    fileOperator.on('finish', (file) => {
      binaryFile = file
      fileName.value = file.name
      errorMsg.value = ''
      showErrorList.value = false
    })

    const handleUpload = async () => {
      try {
        store.dispatch('helper/pushModalLoading')

        const { message, result, success } = await store.dispatch('assets/batchUpload', { xlsxFile: binaryFile })

        store.dispatch('helper/closeModalLoading')

        if (success) {
          store.commit('helper/PUSH_message', t('DD0041', { number: result.successAmount }))
          store.dispatch('helper/replaceModal', {
            header: t('DD0043'),
            component: 'modal-how-to-scan',
            properties: {
              btnText: t('UU0023'),
              clickHandler: () => {
                closeModal()
                goToAssets()
              },
              materialList: result.materialList
            }
          })
        } else {
          if (result.errorList?.length > 0) {
            showErrorList.value = true
            errorList = result.errorList
          } else {
            store.dispatch('helper/pushModalConfirm', {
              title: message.title,
              content: message.content,
              primaryText: t('UU0031'),
            })
          }
        }
      } catch (error) {
        errorMsg.value = error
        store.dispatch('helper/closeModalLoading')
      }
    }

    const openModalErrorList = () => {
      store.dispatch('helper/pushModal', {
        component: 'modal-mass-upload-error-list',
        properties: { errorList }
      })
    }

    const closeModal = () => { store.dispatch('helper/closeModal') }

    return {
      locale,
      errorMsg,
      fileName,
      showErrorList,
      chooseFile,
      handleUpload,
      openModalErrorList
    }
  }
}
</script>
