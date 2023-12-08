<template lang="pug">
fullscreen-header
  template(#left)
    h5(class="text-h5 text-grey-900 font-bold") {{ $t('EE0006') }}
  template(#right)
    btn-group(
      :primaryText="$t('UU0001')"
      @click:primary="primaryHandler"
      :secondaryText="$t('UU0004')"
      @click:secondary="closeModal"
    )
  template(#content)
    div(class="pt-12.5 pb-2.5 max-w-280 mx-auto pr-3")
      div(class="mb-10")
        div(class="text-grey-900 font-bold text-h5 mb-5") {{ $t('EE0010') }}
        div(class="text-grey-900 text-body2 leading-1.6") {{ $t('EE0011') }}
      div(class="grid gap-y-5")
        div(class="text-grey-900 font-bold text-body1") {{ mergedList.length }} {{ $t('EE0012') }}
        div(v-for="(row, index) in mergedList" :key="index" class="flex gap-x-11 h-47.5")
          div(
            class="w-47.5 h-full rounded border-2 border-solid border-grey-250 bg-cover flex-shrink-0"
            :class="{ 'border-none': row.block.faceSide !== null }"
            :style="{ 'background-image': `url(${row.block.faceSide?.sideImage?.thumbnailUrl})` }"
          )
            div(
              v-if="!row.block.faceSide?.sideImage?.thumbnailUrl"
              class="flex justify-center items-center h-full"
            )
              span(class="text-h5 font-bold text-grey-250") {{ $t('RR0103') }}
          div(
            class="w-47.5 h-full rounded border-2 border-solid border-grey-250 bg-cover flex-shrink-0"
            :class="{ 'border-none': row.block.backSide !== null }"
            :style="{ 'background-image': `url(${row.block.backSide?.sideImage?.thumbnailUrl})` }"
          )
            div(
              v-if="!row.block.backSide?.sideImage?.thumbnailUrl"
              class="flex justify-center items-center h-full"
            )
              span(class="text-h5 font-bold text-grey-250") {{ $t('RR0103') }}
          div(class="flex-grow h-full rounded border-2 border-solid border-grey-250")
            material-merge-row-detail(
              v-if="row.block.detail"
              :material="row.block.detail.material"
            )
            div(v-else class="flex justify-center items-center h-full")
              span(class="text-h5 font-bold text-grey-250") No fabric specifications
</template>

<script setup lang="ts">
import FullscreenHeader from '@/components/common/FullScreenHeader.vue'
import MaterialMergeRowDetail from '@/components/assets/merge/MaterialMergeRowDetail.vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useNotifyStore } from '@/stores/notify'
import type { MergeRow } from '@/components/assets/merge/ModalMaterialMerge.vue'
import { useAssetsStore } from '@/stores/assets'

const props = defineProps<{
  mergedList: MergeRow[]
}>()

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()
const { ogBaseAssetsApi } = useAssetsStore()

const primaryHandler = async () => {
  store.dispatch('helper/pushModalLoading')
  await ogBaseAssetsApi('mergeAssetsMaterialList', {
    mergedList: props.mergedList.map((item) => ({
      isComposite: item.isComposite,
      faceSideMaterialSideId: item.block.faceSide?.materialSideId ?? null,
      backSideMaterialSideId: item.block.backSide?.materialSideId ?? null,
      detailMaterialSideId: item.block.detail?.materialSideId ?? null,
    })),
  })
  store.dispatch('helper/clearModalPipeline')
  store.dispatch('helper/reloadInnerApp')
  notify.showNotifySnackbar({ messageText: t('EE0077') })
}

const closeModal = () => {
  store.dispatch('helper/closeModal')
}
</script>
