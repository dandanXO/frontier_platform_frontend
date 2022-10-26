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
    div(class="max-w-286 pl-17 pr-7 mx-auto mt-13")
      div(class="mb-10")
        div(class="text-grey-900 font-bold text-h5 mb-5") {{ $t('EE0010') }}
        div(class="text-grey-900 text-body2 leading-1.6") {{ $t('EE0011') }}
      div(v-if="nonEmptyRowList.length < 1") {{ $t('EE0013') }}
      div(v-else)
        div(class="text-grey-900 font-bold text-body1 mb-5") {{ nonEmptyRowList.length }} {{ $t('EE0012') }}
        div(v-for="row in nonEmptyRowList" :key="row.id" class="flex my-7.5")
          div(class="relative mr-11")
            div(
              class="w-47.5 h-47.5 rounded border-2 border-solid border-grey-200 bg-cover"
              :class="{ 'border-none': row.faceSide.exist }"
              :style="getBgImg(row, 'faceSide')"
            )
          div(class="relative mr-11")
            div(
              class="w-47.5 h-47.5 rounded border-2 border-solid border-grey-200 bg-cover"
              :class="{ 'border-none': row.backSide.exist }"
              :style="getBgImg(row, 'backSide')"
            )
          div(class="relative w-full")
            div(class="h-47.5 rounded" class="border-2 border-solid border-grey-200")
              material-merge-row-detail(
                v-if="row.detail.exist"
                :material="row.detail"
              )
</template>

<script>
import FullscreenHeader from '@/components/common/FullScreenHeader.vue'
import MaterialMergeRowDetail from '@/components/assets/merge/MaterialMergeRowDetail.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default {
  name: 'ModalMaterialMergePreview',
  components: {
    FullscreenHeader,
    MaterialMergeRowDetail,
  },
  props: {
    mergedList: {
      type: Array,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const store = useStore()

    const primaryHandler = async () => {
      const apiInput = nonEmptyRowList.value.map((row) => {
        return {
          faceSideMaterialId: row.faceSide.materialId || null,
          backSideMaterialId: row.backSide.materialId || null,
          detailMaterialId: row.detail.materialId || null,
        }
      })
      store.dispatch('helper/pushModalLoading')
      await store.dispatch('assets/mergeMaterial', { mergedList: apiInput })
      store.dispatch('helper/closeModalLoading')
      store.dispatch('helper/clearModalPipeline')
      store.dispatch('helper/reloadInnerApp')
      store.dispatch('helper/pushFlashMessage', t('EE0077'))
    }

    const getBgImg = (target, blockType) => {
      if (target[blockType]?.materialId) {
        const path = target[blockType].imageInfo.crop
        return { 'background-image': `url(${path})` }
      }
    }

    const nonEmptyRowList = computed(() => {
      return props.mergedList.filter(
        (row) => row.faceSide?.exist || row.backSide?.exist || row.detail?.exist
      )
    })

    const closeModal = () => {
      store.dispatch('helper/closeModal')
    }

    return {
      primaryHandler,
      getBgImg,
      nonEmptyRowList,
      closeModal,
    }
  },
}
</script>
