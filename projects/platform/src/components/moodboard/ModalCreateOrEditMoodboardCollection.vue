<template lang="pug">
modal-behavior(
  :header="mode === CREATE_EDIT.EDIT ? $t('FF0009') : $t('QQ0056')"
  :primaryBtnText="mode === CREATE_EDIT.CREATE ? $t('UU0020') : $t('UU0018')"
  :primaryBtnDisabled="!isFormValid"
  @click:primary="primaryHandler"
)
  template(#note)
    file-upload-error-note(
      v-if="refInputTrendBoardUpload && refInputTrendBoardUpload.errorCode"
      :errorCode="refInputTrendBoardUpload.errorCode"
      :fileSizeMaxLimit="refInputTrendBoardUpload.fileSizeMaxLimit"
      data-cy="modal-mass-upload_error"
    )
    div(v-else-if="mode === CREATE_EDIT.CREATE" class="flex items-center text-grey-600")
      f-svg-icon(iconName="info_outline" size="20")
      p(class="text-caption leading-1.6 pl-1.5") {{ $t('QQ0060') }}
  div(class="w-95")
    f-input-text(
      ref="refInputCollectionName"
      v-model:textValue="collectionName"
      required
      :rules="[inputRules.required(), inputRules.maxLength(COLLECTION_NAME_MAX_LENGTH)]"
      :label="$t('FF0010')"
      :placeholder="$t('QQ0058')"
      class="mb-7.5"
    )
    input-trend-board-upload(
      ref="refInputTrendBoardUpload"
      :defaultTrendBoard="defaultTrendBoard"
      class="mb-7.5"
    )
    f-input-textarea(
      ref="refInputDescription"
      v-model:textValue="collectionDescription"
      :label="$t('RR0014')"
      :placeholder="$t('QQ0059')"
      :rules="[inputRules.maxLength(COLLECTION_DESCRIPTION_MAX_LENGTH, $t('WW0073'))]"
      minHeight="min-h-30"
    )
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { useI18n } from 'vue-i18n'
import { inputRules } from '@frontier/lib'
import {
  CREATE_EDIT,
  COLLECTION_NAME_MAX_LENGTH,
  COLLECTION_DESCRIPTION_MAX_LENGTH,
} from '@/utils/constants'
import { FInputText } from '@frontier/ui-component'
import type { Collection, TrendBoard } from '@frontier/platform-web-sdk'
import InputTrendBoardUpload from '@/components/common/collection/InputTrendBoardUpload.vue'
import { useMoodboardStore } from '@/stores/moodboard'

export interface PropsModalCreateOrEditMoodboardCollection {
  mode: CREATE_EDIT
  nodeId: number
  collection?: Collection
}
const props = defineProps<PropsModalCreateOrEditMoodboardCollection>()

const collection = ref(props.collection)
const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()
const { ogBaseMoodboardApi } = useMoodboardStore()

const collectionName = ref<string | null>(null)
const collectionDescription = ref<string | null>(null)
const refInputTrendBoardUpload =
  ref<InstanceType<typeof InputTrendBoardUpload>>()
const defaultTrendBoard = ref<TrendBoard | null>(null)

if (props.mode === CREATE_EDIT.EDIT && collection.value) {
  const { name, description, trendBoard } = collection.value
  collectionName.value = name
  collectionDescription.value = description
  defaultTrendBoard.value = trendBoard
}

const refInputCollectionName = ref<InstanceType<typeof FInputText>>()
const refInputDescription = ref<InstanceType<typeof FInputText>>()
const isFormValid = computed(
  () =>
    collectionName.value &&
    !refInputCollectionName.value?.isError &&
    !refInputDescription.value?.isError
)

const primaryHandler = async () => {
  if (!collectionName.value) {
    return
  }

  store.dispatch('helper/pushModalLoading')

  const trendBoard = refInputTrendBoardUpload.value
    ? await refInputTrendBoardUpload.value.getTrendBoardS3Object()
    : null

  if (props.mode === CREATE_EDIT.EDIT) {
    await ogBaseMoodboardApi('updateMoodboardOfferNodeCollection', {
      nodeId: props.nodeId,
      name: collectionName.value,
      description: collectionDescription.value,
      newTrendBoard: trendBoard,
      isDeleteTrendBoard:
        refInputTrendBoardUpload.value?.isDeleteTrendBoard ?? false,
    })

    notify.showNotifySnackbar({ messageText: t('FF0035') })
  } else {
    await ogBaseMoodboardApi('createMoodboardOfferNodeCollection', {
      nodeId: props.nodeId,
      name: collectionName.value,
      description: collectionDescription.value,
      trendBoard,
    })
    notify.showNotifySnackbar({ messageText: t('FF0027') })
  }

  store.dispatch('helper/reloadInnerApp')
  store.dispatch('helper/clearModalPipeline')
}
</script>
