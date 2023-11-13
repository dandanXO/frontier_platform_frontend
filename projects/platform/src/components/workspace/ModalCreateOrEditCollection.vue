<template lang="pug">
modal-behavior(
  :header="mode === CREATE_EDIT.EDIT ? $t('FF0009') : $t('FF0022')"
  :primaryBtnText="mode === CREATE_EDIT.EDIT ? $t('UU0018') : $t('UU0020')"
  :primaryBtnDisabled="!isFormValid"
  @click:primary="actionHandler"
)
  template(#note)
    file-upload-error-note(
      v-if="errorCode"
      :errorCode="errorCode"
      :fileSizeMaxLimit="fileSizeMaxLimit"
      data-cy="modal-mass-upload_error"
    )
  div(class="w-101")
    p(class="text-right pb-0.5 text-caption text-grey-600") *{{ $t('RR0163') }}
    f-input-text(
      ref="refInputCollectionName"
      v-model:textValue="collectionName"
      required
      :label="$t('FF0010')"
      class="mb-7.5"
      :rules="[inputRules.required(), inputRules.maxLength(COLLECTION_NAME_MAX_LENGTH)]"
      :hintError="isCollectionNameExist ? $t('WW0001') : ''"
    )
    div(class="h-5.5 flex items-center pb-1")
      p(class="text-body2 text-grey-900 font-bold") {{ $t('RR0249') }}
      f-button-label(
        v-if="trendBoardFile"
        size="sm"
        class="ml-1.5"
        @click="previewFile(trendBoardFile)"
      ) {{ $t('UU0060') }}
    f-input-file(
      class="w-full mb-15"
      v-model:fileName="uploadTrendBoardName"
      :text="$t('UU0025')"
      :acceptType="acceptType"
      :maximumSize="fileSizeMaxLimit"
      @finish="finishUpload"
      @clear="removeTrendBoard"
      @error="errorCode = $event"
    )
    f-input-textarea(
      ref="refInputDescription"
      v-model:textValue="collectionDescription"
      :label="$t('RR0014')"
      :rules="[inputRules.maxLength(COLLECTION_DESCRIPTION_MAX_LENGTH, $t('WW0073'))]"
      minHeight="min-h-30"
    )
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { previewFile, inputRules } from '@frontier/lib'
import { useI18n } from 'vue-i18n'
import {
  CREATE_EDIT,
  COLLECTION_NAME_MAX_LENGTH,
  COLLECTION_DESCRIPTION_MAX_LENGTH,
} from '@/utils/constants'
import { type UPLOAD_ERROR_CODE, EXTENSION } from '@frontier/constants'
import { FInputText } from '@frontier/ui-component'
import { useWorkspaceStore } from '@/stores/workspace'
import type { Collection, NodeMeta } from '@frontier/platform-web-sdk'
import { uploadFileToS3 } from '@/utils/fileUpload'

export interface PropsModalCreateOrEditCollection {
  mode: CREATE_EDIT
  nodeMeta: NodeMeta
  collection: Collection
}
const props = defineProps<PropsModalCreateOrEditCollection>()

const collection = ref(props.collection)
const { t } = useI18n()
const { ogBaseWorkspaceApi } = useWorkspaceStore()
const store = useStore()
const notify = useNotifyStore()

const fileSizeMaxLimit = 20 * Math.pow(1024, 2)
const acceptType = [EXTENSION.PDF]
const errorCode = ref<UPLOAD_ERROR_CODE | null>(null)
const finishUpload = (file: File) => {
  errorCode.value = null
  trendBoardFile.value = file
}

const collectionName = ref<string | null>(null)
const collectionDescription = ref<string | null>(null)
const trendBoardFile = ref<File | string | null>(null)
const uploadTrendBoardName = ref<string | null>(null)
if (props.mode === CREATE_EDIT.EDIT) {
  const { name, description, trendBoard } = collection.value
  collectionName.value = name
  collectionDescription.value = description
  trendBoardFile.value = trendBoard?.originalUrl ?? null
  uploadTrendBoardName.value = trendBoard?.displayName ?? null
}
const removeTrendBoard = () => {
  trendBoardFile.value = null
  if (props.mode === CREATE_EDIT.EDIT) {
    ogBaseWorkspaceApi('removeWorkspaceCollectionTrendBoard', {
      collectionId: collection.value.collectionId,
    })
  }
}

const refInputCollectionName = ref<InstanceType<typeof FInputText>>()
const refInputDescription = ref<InstanceType<typeof FInputText>>()
const isFormValid = computed(
  () =>
    collectionName.value &&
    !refInputCollectionName.value?.isError &&
    !refInputDescription.value?.isError
)

const isCollectionNameExist = ref(false)
watch(
  () => collectionName.value,
  () => (isCollectionNameExist.value = false)
)

const actionHandler = async () => {
  if (!collectionName.value) {
    return
  }

  try {
    store.dispatch('helper/pushModalLoading')

    const getTrendBoard = async () => {
      if (
        typeof trendBoardFile.value === 'object' &&
        trendBoardFile.value !== null
      ) {
        const { s3UploadId, fileName } = await uploadFileToS3(
          trendBoardFile.value as File,
          uploadTrendBoardName.value as string
        )
        return {
          s3UploadId,
          fileName,
        }
      } else {
        return null
      }
    }

    if (props.mode === CREATE_EDIT.EDIT) {
      const trendBoard = await getTrendBoard()
      await ogBaseWorkspaceApi('updateWorkspaceCollection', {
        collectionId: collection.value.collectionId,
        collectionName: collectionName.value,
        description: collectionDescription.value,
        trendBoard,
      })

      notify.showNotifySnackbar({ messageText: t('FF0035') })
    } else {
      const trendBoard = await getTrendBoard()
      await ogBaseWorkspaceApi('createWorkspaceCollection', {
        nodeId: props.nodeMeta.nodeId,
        collectionName: collectionName.value,
        description: collectionDescription.value,
        trendBoard,
      })
      notify.showNotifySnackbar({ messageText: t('FF0027') })
    }

    store.dispatch('helper/reloadInnerApp')
    store.dispatch('helper/clearModalPipeline')
  } catch (error) {
    store.dispatch('helper/closeModalLoading')
    const { code } = error
    switch (code) {
      case 'ERR0035':
        isCollectionNameExist.value = true
        break
      default:
        throw error
    }
  }
}
</script>
