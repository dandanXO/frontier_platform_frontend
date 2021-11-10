<template lang="pug">
div(class="pt-28.5 h-screen")
  fullscreen-header(
    :title="$t('EE0006')"
    :primaryText="$t('UU0001')"
    :primaryHandler="primaryHandler"
    :primaryCloseAfterHandle='false'
    :secondaryText="$t('UU0004')"
  )
  div(class='max-w-286 pl-17 pr-7 mx-auto')
    div(class='mb-10')
      div(class='text-primary font-bold text-h5 mb-5') {{$t('EE0010')}}
      div(class='text-primary text-body2 line-height-1.6') {{$t('EE0011')}}
    div(v-if="notEmptyList.length < 1") {{$t('EE0013')}}
    div(v-else)
      div(class='text-primary font-bold text-body1 mb-5') {{notEmptyList.length}} {{$t('EE0012')}}
      div(v-for="item in notEmptyList" :key="item.id" class="flex my-7.5")
        div(class="relative mr-11")
          div(class="w-47.5 h-47.5 rounded border-2 border-solid border-black-400 bg-cover" :class="{'border-none': item.faceSide.exist}" :style="getBgImg(item, 'faceSide')")
        div(class="relative mr-11")
          div(class="w-47.5 h-47.5 rounded border-2 border-solid border-black-400 bg-cover" :class="{'border-none': item.backSide.exist}" :style="getBgImg(item, 'backSide')")
        div(class="relative w-full")
          div(class="h-47.5 rounded" class="border-2 border-solid border-black-400")
            material-merge-row-detail(v-if='item.detail.exist' :material='item.detail')
</template>

<script>
import FullscreenHeader from '@/components/layout/FullScreenHeader.vue'
import MaterialMergeRowDetail from '@/components/assets/material/MaterialMergeRowDetail'
import { computed } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default {
  name: 'MaterialMergePreview',
  components: {
    FullscreenHeader,
    MaterialMergeRowDetail
  },
  props: {
    mergedList: {
      type: Array
    }
  },
  setup (props) {
    const { t } = useI18n()
    const store = useStore()
    const clearModalPipeline = () => store.dispatch('helper/clearModalPipeline')

    const primaryHandler = async () => {
      const apiInput = notEmptyList.value.map(item => {
        return {
          faceSideMaterialId: item.faceSide.materialId || null,
          backSideMaterialId: item.backSide.materialId || null,
          detailMaterialId: item.detail.materialId || null
        }
      })

      await store.dispatch('assets/mergeMaterial', { mergedList: apiInput })
      store.commit('assets/CLEAR_addedMaterialList')
      clearModalPipeline()
      store.commit('helper/PUSH_message', t('Merge Material successfully!'))
    }

    const getBgImg = (target, blockType) => {
      const fromType = target[blockType].fromType
      if (fromType) {
        const path = target[blockType][`${fromType}Img`].crop
        return { 'background-image': `url(${path})` }
      }
    }

    const notEmptyList = computed(() => {
      return props.mergedList.filter(item =>
        item.faceSide.exist ||
        item.backSide.exist ||
        item.detail.exist
      )
    })

    return {
      primaryHandler,
      getBgImg,
      notEmptyList
    }
  }
}
</script>
