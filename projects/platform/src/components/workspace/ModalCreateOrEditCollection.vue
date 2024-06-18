<template lang="pug">
modal-behavior(
  :header="mode === CREATE_EDIT.EDIT ? $t('FF0009') : $t('FF0022')"
  :primaryBtnText="mode === CREATE_EDIT.EDIT ? $t('UU0018') : $t('UU0020')"
  :primaryBtnDisabled="primaryBtnDisabled"
  @click:primary="primaryHandler"
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
    input-trend-board-upload(
      ref="refInputTrendBoardUpload"
      :defaultTrendBoard="defaultTrendBoard"
      @remove="removeHandler"
      class="mb-7.5"
    )
    f-input-textarea(
      ref="refInputDescription"
      v-model:textValue="collectionDescription"
      :label="$t('RR0014')"
      :rules="[inputRules.maxLength(COLLECTION_DESCRIPTION_MAX_LENGTH, $t('WW0142', { limitNumber: COLLECTION_DESCRIPTION_MAX_LENGTH }))]"
      minHeight="min-h-30"
    )
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { inputRules } from '@frontier/lib'
import { useI18n } from 'vue-i18n'
import {
  CREATE_EDIT,
  COLLECTION_NAME_MAX_LENGTH,
  COLLECTION_DESCRIPTION_MAX_LENGTH,
} from '@/utils/constants'
import { FInputText } from '@frontier/ui-component'
import { useWorkspaceStore } from '@/stores/workspace'
import type {
  Collection,
  NodeMeta,
  TrendBoard,
} from '@frontier/platform-web-sdk'
import InputTrendBoardUpload from '@/components/common/collection/InputTrendBoardUpload.vue'

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

const collectionName = ref<string | null>(null)
const collectionDescription = ref<string | null>(null)
const refInputTrendBoardUpload =
  ref<InstanceType<typeof InputTrendBoardUpload>>()
const defaultTrendBoard = ref<TrendBoard | null>(null)

if (props.mode === CREATE_EDIT.EDIT) {
  const { name, description, trendBoard } = collection.value
  collectionName.value = name
  collectionDescription.value = description
  defaultTrendBoard.value = trendBoard
}

const removeHandler = () => {
  if (props.mode === CREATE_EDIT.EDIT) {
    ogBaseWorkspaceApi('removeWorkspaceCollectionTrendBoard', {
      collectionId: collection.value.collectionId,
    })
  }
}

const refInputCollectionName = ref<InstanceType<typeof FInputText>>()
const refInputDescription = ref<InstanceType<typeof FInputText>>()
const primaryBtnDisabled = computed(
  () =>
    !collectionName.value ||
    refInputCollectionName.value?.isError ||
    refInputDescription.value?.isError ||
    refInputTrendBoardUpload.value?.errorCode
)

const isCollectionNameExist = ref(false)
watch(
  () => collectionName.value,
  () => (isCollectionNameExist.value = false)
)

const primaryHandler = async () => {
  if (!collectionName.value) {
    return
  }

  try {
    store.dispatch('helper/pushModalLoading')

    const trendBoard = refInputTrendBoardUpload.value
      ? await refInputTrendBoardUpload.value.getTrendBoardS3Object()
      : null

    if (props.mode === CREATE_EDIT.EDIT) {
      await ogBaseWorkspaceApi('updateWorkspaceCollection', {
        collectionId: collection.value.collectionId,
        collectionName: collectionName.value,
        description: collectionDescription.value,
        trendBoard,
      })

      notify.showNotifySnackbar({ messageText: t('FF0035') })
    } else {
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
