<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(class="w-full h-full flex flex-col px-5 pb-2")
    div(class="pt-4 pb-2 flex justify-between")
      global-breadcrumb-list(
        :breadcrumbList="breadcrumbList"
        @click:item="$event.goTo?.()"
      )
    spreadsheet(
      :materialList="spreadsheetInitialMaterial"
      :materialRowList="materialRowList"
      @submit="handleSubmit"
    )
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave } from 'vue-router'
import { useAssetsStore } from '@/stores/assets'
import Spreadsheet from '@/components/assets/spreadsheet/Spreadsheet.vue'
import type {
  MassCreateUpdateDeleteAssetsMaterialList200Response,
  MassCreateUpdateDeleteAssetsMaterialListRequest,
} from '@frontier/platform-web-sdk'
import { uploadFileToS3 } from '@/utils/fileUpload'
import type { MaterialRow, SubmitPayload } from '@/types'
import useNavigation from '@/composables/useNavigation'
import { NOTIFY_TYPE, PROGRESS_TAB } from '@/utils/constants'
import { mapMaterialToMaterialRow } from '@/utils/material'
import {
  TRACKER_POSTFIX,
  TRACKER_PREFIX,
  TRACKER_ADDITIONAL_PROPERTIES,
  TRACKER_ERROR_LOCATION,
  track,
} from '@frontier/lib'

const TRACKER_ID = 'Mass Upload'

const store = useStore()
const { t } = useI18n()
const {
  ogBaseAssetsApi,
  spreadsheetInitialMaterial,
  cleanUpSpreadSheet,
  addSpreadsheetInputFile,
} = useAssetsStore()
const { goToAssets, goToProgress, goToAssetMaterialSpreadSheet } =
  useNavigation()

const materialRowList: MaterialRow[] = spreadsheetInitialMaterial.map(
  mapMaterialToMaterialRow(true)
)

const isConfirmedToLeave = ref(false)

const breadcrumbList = computed(() => {
  return [
    {
      name: t('RR0008'),
      goTo: goToAssets,
    },
    {
      name: t('MI0143'),
      goTo: goToAssetMaterialSpreadSheet,
    },
  ]
})

const handleSubmit = async (payload: SubmitPayload) => {
  const result = await new Promise<'confirm' | 'cancel'>((resolve) => {
    store.dispatch('helper/openModalConfirm', {
      type: NOTIFY_TYPE.WARNING,
      header: t('MI0147'),
      contentText: t('MI0148'),
      primaryBtnText: t('UU0001'),
      primaryBtnHandler: () => resolve('confirm'),
      closeAfterPrimaryBtnHandler: false,
      secondaryBtnText: t('UU0002'),
      secondaryBtnHandler: () => resolve('cancel'),
    })
  })

  if (result !== 'confirm') {
    return
  }
  isConfirmedToLeave.value = true

  store.dispatch('helper/pushModalLoading')

  const payloadStr = JSON.stringify(payload)
  const originFileName = 'spreadsheet-update.json'
  const blob = new Blob([payloadStr], { type: 'application/json' })
  const file = new File([blob], originFileName, { type: 'application/json' })
  const { fileName, s3UploadId } = await uploadFileToS3(file, originFileName)

  const req: Omit<
    MassCreateUpdateDeleteAssetsMaterialListRequest,
    'ogType' | 'orgId' | 'ogId'
  > = { s3UploadId, fileName }
  try {
    await ogBaseAssetsApi('massCreateUpdateDeleteAssetsMaterialList', req)
    track({
      eventName: [
        TRACKER_PREFIX.SUBMIT_DATA,
        TRACKER_ID,
        TRACKER_POSTFIX.SUCCESS,
      ].join(' '),
    })
    goToProgress({}, PROGRESS_TAB.SPREADSHEET)
  } catch (error) {
    const { code, message, result } =
      error as MassCreateUpdateDeleteAssetsMaterialList200Response
    const errorList = result!.errorList

    track({
      eventName: [
        TRACKER_PREFIX.SUBMIT_DATA,
        TRACKER_ID,
        TRACKER_POSTFIX.ERROR,
      ].join(' '),
      properties: {
        error: { message },
        [TRACKER_ADDITIONAL_PROPERTIES.ERROR_LOCATION]:
          TRACKER_ERROR_LOCATION.BE,
      },
    })
    // switch (code) {
    //   case 'ERR0036': {
    //     store.dispatch('helper/openModalBehavior', {
    //       component: 'modal-workflow-stage-delete-error-list',
    //       properties: {
    //         title: message.title,
    //         workflowStageName,
    //         errorList: result.errorList,
    //       },
    //     })
    //     return
    //   }
    //   default:
    //     throw error
    // }
  } finally {
    store.dispatch('helper/clearModalPipeline')
  }
}

onBeforeRouteLeave(async () => {
  if (isConfirmedToLeave.value) {
    return true
  }

  const result = await new Promise<'confirm' | 'cancel'>((resolve) => {
    store.dispatch('helper/openModalConfirm', {
      type: NOTIFY_TYPE.WARNING,
      header: t('RR0305'),
      contentText: t('RR0306'),
      primaryBtnText: t('UU0001'),
      primaryBtnHandler: () => {
        addSpreadsheetInputFile(null)
        return resolve('confirm')
      },
      secondaryBtnText: t('UU0002'),
      secondaryBtnHandler: () => resolve('cancel'),
    })
  })

  return result === 'confirm'
})

onUnmounted(cleanUpSpreadSheet)
</script>

<style scoped></style>
