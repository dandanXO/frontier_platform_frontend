<template lang="pug">
modal-behavior(
  :header="mode === CREATE_EDIT.EDIT ? $t('FF0009') : $t('FF0022')"
  :primaryBtnText="mode === CREATE_EDIT.EDIT ? $t('UU0018') : $t('UU0020')"
  :primaryBtnDisabled="primaryBtnDisabled"
  @click:primary="primaryHandler"
)
  div(class="w-101 flex flex-col gap-7.5")
    f-input-text(
      ref="refInputCollectionName"
      v-model:textValue="collectionName"
      required
      :label="$t('FF0010')"
      :rules="[inputRules.required(), inputRules.maxLength(COLLECTION_NAME_MAX_LENGTH)]"
      data-cy="input-collection-name"
      :hintError="isCollectionNameExist ? $t('WW0001') : ''"
    )
    input-collection-cover(
      ref="refInputCollectionCover"
      :defaultCoverImage="defaultCoverImage"
      class="gap-2 flex flex-col"
    )
    input-trend-board-upload(
      ref="refInputTrendBoardUpload"
      :defaultTrendBoard="defaultTrendBoard"
    )
    f-input-textarea(
      ref="refInputDescription"
      v-model:textValue="collectionDescription"
      :label="$t('RR0014')"
      :rules="[inputRules.maxLength(COLLECTION_DESCRIPTION_MAX_LENGTH, $t('WW0142', { limitNumber: COLLECTION_DESCRIPTION_MAX_LENGTH }))]"
      data-cy="input-description-collection"
      minHeight="min-h-30"
    )
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import type { AxiosError } from 'axios'
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
  CollectionCoverImg,
  NodeMeta,
  TrendBoard,
  UpdateWorkspaceCollectionRequestAllOfCoverImg,
} from '@frontier/platform-web-sdk'
import InputTrendBoardUpload from '@/components/common/collection/InputTrendBoardUpload.vue'
import InputCollectionCover from '@/components/common/collection/InputCollectionCover.vue'

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
const refInputCollectionCover = ref<InstanceType<typeof InputCollectionCover>>()
const refInputTrendBoardUpload =
  ref<InstanceType<typeof InputTrendBoardUpload>>()
const defaultTrendBoard = ref<TrendBoard | null>(null)
const defaultCoverImage = ref<CollectionCoverImg | null>(null)

if (props.mode === CREATE_EDIT.EDIT) {
  const { name, description, trendBoard, coverImg } = collection.value
  collectionName.value = name
  collectionDescription.value = description
  defaultTrendBoard.value = trendBoard
  defaultCoverImage.value = coverImg
}

const removeTrendBoardHandler = async () => {
  if (props.mode === CREATE_EDIT.EDIT && collection.value.collectionId) {
    await ogBaseWorkspaceApi('removeWorkspaceCollectionTrendBoard', {
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
    refInputTrendBoardUpload.value?.errorCode ||
    refInputCollectionCover.value?.errorCode
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

    if (!trendBoard) {
      await removeTrendBoardHandler()
    }

    const coverImgS3 =
      await refInputCollectionCover.value?.getCoverImageS3Object()

    const coverImg: UpdateWorkspaceCollectionRequestAllOfCoverImg | null =
      coverImgS3
        ? {
            ...coverImgS3,
            isDeleted:
              !coverImgS3?.s3UploadId &&
              !!collection.value.coverImg.displayName,
          }
        : null

    if (props.mode === CREATE_EDIT.EDIT) {
      await ogBaseWorkspaceApi('updateWorkspaceCollection', {
        collectionId: collection.value.collectionId,
        collectionName: collectionName.value,
        description: collectionDescription.value,
        coverImg,
        trendBoard,
      })

      notify.showNotifySnackbar({ messageText: t('FF0035') })
    } else {
      await ogBaseWorkspaceApi('createWorkspaceCollection', {
        nodeId: props.nodeMeta.nodeId,
        collectionName: collectionName.value,
        description: collectionDescription.value,
        coverImg,
        trendBoard,
      })
      notify.showNotifySnackbar({ messageText: t('FF0027') })
    }

    store.dispatch('helper/reloadInnerApp')
    store.dispatch('helper/clearModalPipeline')
  } catch (error) {
    store.dispatch('helper/closeModalLoading')
    switch ((error as AxiosError).code) {
      case 'ERR0035':
        isCollectionNameExist.value = true
        break
      default:
        throw error
    }
  }
}
</script>
