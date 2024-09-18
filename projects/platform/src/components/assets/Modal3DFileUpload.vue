<template lang="pug">
modal-behavior(
  :header="$t('DD0123')"
  :secondaryBtnText="secondaryBtnText"
  @click:secondary="closeModalBehavior"
)
  template(#note)
    file-upload-error-note(
      v-if="errorCode"
      :errorCode="errorCode"
      :fileSizeMaxLimit="fileSizeMaxLimit"
    )
    div(v-else-if="isUploading" class="flex items-center text-grey-600 leading-1.6")
      f-svg-icon(iconName="info_outline" size="14" class="mr-1.5")
      div(class="w-62.5") {{ $t('DD0106') }}
    div(
      v-if="customizedErrorMsg !== ''"
      class="flex items-center text-red-400 leading-1.6"
    )
      f-svg-icon(iconName="info_outline" size="14" class="mr-1.5")
      div
        p {{ customizedErrorMsg }}
        p {{ $t('WW0139') }}
  div(class="w-94 flex flex-col gap-y-2")
    h6(v-if="isShimaseiki" class="text-h6 text-grey-900 font-bold pb-3") {{ $t('DD0124') }}
    div(class="flex justify-center flex-col items-center" v-if="isLoading")
      div(class="text-body2 pt-3.5" :class="['text-grey-900']") {{ $t('RR0162') }}
      div
        f-svg-icon(iconName="loading" size="64" class="text-primary-400 mr-3")
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useAssetsStore } from '@/stores/assets'
import useNavigation from '@/composables/useNavigation'
import {
  FileOperator,
  TRACKER_ADDITIONAL_PROPERTIES,
  TRACKER_POSTFIX,
  TRACKER_PREFIX,
  track,
  unzip,
} from '@frontier/lib'
import type { UnzippedFile } from '@frontier/lib'
import type { UPLOAD_ERROR_CODE } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import { Extension } from '@frontier/platform-web-sdk'

const TRACKER_ID = 'Advanced View Upload 3D Material'

const props = defineProps<{
  isShimaseiki: boolean
  uploadedHandler: (payload: {
    u3mFile: File
    hasPhysicalData: boolean
  }) => void
  u3mFile: any[]
}>()
const { t } = useI18n()
const store = useStore()
const { goToAssetMaterialEdit, ogType } = useNavigation()

const { uploadCustomU3mV2, viewMode } = useAssetsStore()
const errorCode = ref<UPLOAD_ERROR_CODE | string>('')
const fileSizeMaxLimit = computed(
  () => store.getters['organization/materialAttachmentUploadSizeLimit']
)
const acceptType = [Extension.ZIP]
const fileOperator = new FileOperator(acceptType, fileSizeMaxLimit.value)
const customizedErrorMsg = ref('')
const isLoading = ref(true)
const isUploading = ref(false)
fileOperator.on('error', (code: UPLOAD_ERROR_CODE) => {
  errorCode.value = code
})

const secondaryBtnText = computed(() => (isUploading.value ? t('UU0002') : ''))
onMounted(async () => {
  isUploading.value = true
  errorCode.value = ''
  customizedErrorMsg.value = ''

  try {
    const payload = await Promise.all(
      props.u3mFile.map(async (file) => {
        let hasPhysicalData = false
        const unzippedU3mFileList: UnzippedFile[] = []
        try {
          unzippedU3mFileList.push(...(await unzip(file, [Extension.U3M])))
        } catch (error) {
          throw t('WW0173')
        }

        const u3m = unzippedU3mFileList.find(
          (item) => item.extension === Extension.U3M
        )

        // 1. check if it's valid JSON format
        if (!u3m) {
          isLoading.value = false
          throw t('WW0135')
        }

        let u3mJSON
        try {
          u3mJSON = JSON.parse(u3m.content)
        } catch (e) {
          isLoading.value = false
          throw t('WW0135')
        }

        const loopObject = (obj: any) => {
          Object.keys(obj).forEach((key: string) => {
            const value = obj[key]
            if (
              typeof value === 'object' &&
              !Array.isArray(value) &&
              value !== null
            ) {
              return loopObject(value)
            }
            // 2. check if basecolor exists
            if (key === 'basecolor' && value === null) {
              isLoading.value = false
              throw t('WW0136')
            }

            // 3. check if it can find image file  by corresponding URI path
            if (key === 'path') {
              const isMatched = unzippedU3mFileList.some((item) =>
                item.file.name.includes(value)
              )
              hasPhysicalData = true
              if (!isMatched) {
                isLoading.value = false
                throw t('WW0137')
              }
            }

            // 4. check if fab has value and can find the JSON file by corresponding URI path
            if (key === 'fab' && value !== null) {
              const isMatched = unzippedU3mFileList.some((item) =>
                item.file.name.includes(value)
              )
              if (!isMatched) {
                isLoading.value = false
                throw t('WW0138')
              }
            }
          })
        }
        loopObject(u3mJSON.material)

        return {
          u3mFile: file as File,
          needToGeneratePhysical: hasPhysicalData,
        }
      })
    )

    const {
      data: { result },
    } = await uploadCustomU3mV2(payload)
    closeModalBehavior()
    track({
      eventName: [
        TRACKER_PREFIX.SUBMIT_DATA,
        TRACKER_ID,
        TRACKER_POSTFIX.SUCCESS,
      ].join(' '),
      properties: {
        [TRACKER_ADDITIONAL_PROPERTIES.CREATE_MATERIAL_MODE]: viewMode,
      },
    })
    result?.find(
      ({ materialId }) =>
        materialId && goToAssetMaterialEdit(materialId, ogType.value)
    )
  } catch (e) {
    const errorMessage = e?.message?.content || (e as string) || t('WW0173')
    customizedErrorMsg.value = errorMessage
    store.dispatch('helper/openModalConfirm', {
      type: 3,
      header: t('WW0122'),
      contentText: errorMessage,
      primaryBtnText: t('UU0031'),
      primaryBtnHandler: closeModalBehavior,
      testId: 'modal-confirm-crash',
    })
    track({
      eventName: [
        TRACKER_PREFIX.SUBMIT_DATA,
        TRACKER_ID,
        TRACKER_POSTFIX.ERROR,
      ].join(' '),
      properties: {
        error: errorMessage,
        [TRACKER_ADDITIONAL_PROPERTIES.CREATE_MATERIAL_MODE]: viewMode,
      },
    })
  } finally {
    isLoading.value = false
    isUploading.value = false
  }
})
const closeModalBehavior = () => {
  store.dispatch('helper/closeModalBehavior')
}
</script>
