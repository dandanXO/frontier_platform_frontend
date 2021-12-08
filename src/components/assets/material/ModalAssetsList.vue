<template lang="pug">
div(class="w-161 h-131 px-8 flex flex-col")
  div
    h6(class="text-h6 font-bold text-primary text-center pb-7.5") {{modalTitle}}
    input-text(
      v-model:textValue="keyword"
      prependIcon="search"
      :placeholder="$t('FF0017')"
      @enter="search"
    )
  div(class="flex-grow flex flex-col")
    div(class="w-full py-4 flex items-center justify-end")
      tooltip(
        placement="bottom-end"
        :manual="true"
        :showArrow="false"
        :offset="[0, 8]"
      )
        template(#trigger="{ isActive }")
          svg-icon(
            iconName="swap_horiz"
            size="20"
            class="transform rotate-90 cursor-pointer text-black-700 hover:text-brand"
            :class="{ 'text-brand': isActive }"
          )
        template(#content)
          contextual-menu(v-model:selectValue="queryParams.sort" :optionList="sortOptionList" @update:selectValue="sort")
    div(v-show="isSearching && materialList.length === 0" class="flex-grow flex items-center justify-center")
      svg-icon(iconName="loading" size="92" class="text-brand")
    overlay-scrollbar-container(class="flex-grow -mx-8" @reachBottom="infiniteScroll")
      div(class="grid grid-flow-row grid-cols-5 auto-rows-auto gap-5 px-8")
        template(v-for="material in materialList")
          node-item-for-modal(
            class="w-25"
            v-model:selectedValue="selectedValue"
            :nodeType="NODE_TYPE.MATERIAL"
            :nodeKey="material.materialId"
            :node="material"
            :displayName="material.materialNo"
            :isMultiSelect="isMultiSelect"
          )
      div(v-if="isSearching && materialList.length > 0" class="flex justify-center items-center")
        svg-icon(iconName="loading" size="54" class="text-brand")
  btn-group(
    class="h-25"
    :primaryText="actionText"
    :primaryButtonDisabled="actionButtonDisabled"
    @click:primary="innerActionCallback"
    :secondaryButton="false"
  )
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { SORT_BY, NODE_TYPE } from '@/utils/constants'
import NodeItemForModal from '@/components/layout/NodeItemForModal.vue'
import { useStore } from 'vuex'
import useMaterial from '@/composables/useMaterial'

export default {
  name: 'ModalAssetsList',
  components: {
    NodeItemForModal
  },
  props: {
    modalTitle: {
      type: String,
      required: true
    },
    actionText: {
      type: String,
      required: true
    },
    actionCallback: {
      type: Function,
      required: true
    },
    isMultiSelect: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    const store = useStore()
    const sortOptionList = [
      SORT_BY.CREATE_DATE,
      SORT_BY.LAST_UPDATE,
      SORT_BY.MATERIAL_NO_A_Z
    ]

    const keyword = ref('')
    const isSearching = ref(false)
    const materialList = ref([])
    const queryParams = reactive({
      keyword: '',
      targetPage: 1,
      sort: sortOptionList[0].value
    })
    const totalPage = ref(1)
    const selectedValue = ref(props.isMultiSelect ? [] : '')

    const actionButtonDisabled = computed(() => {
      return props.isMultiSelect
        ? selectedValue.value.length === 0
        : !selectedValue.value
    })

    const innerActionCallback = async () => {
      await props.actionCallback(selectedValue.value)
    }

    const getMaterialListForModal = async () => {
      isSearching.value = true

      const { pagination, assets } = await store.dispatch('assets/getMaterialListForModal', queryParams)
      totalPage.value = pagination.totalPage

      assets.materialList.forEach(material => {
        /**
         * 因爲 NodeItemForModal 的 img 是吃 node.coverImg，
         * 所以才在此將 currentCoverImg 覆蓋 coverImg
         */
        const { currentCoverImg } = useMaterial(material)
        material.coverImg = currentCoverImg
        materialList.value.push(material)
      })

      isSearching.value = false
    }

    const infiniteScroll = () => {
      if (isSearching.value) { return }

      const currentPage = queryParams.targetPage
      if (currentPage !== totalPage.value) {
        queryParams.targetPage = Math.min(currentPage + 1, totalPage.value)
        getMaterialListForModal()
      }
    }

    const reset = () => {
      materialList.value.length = 0
      queryParams.targetPage = 1
    }

    const sort = () => {
      reset()
      getMaterialListForModal()
    }

    const search = () => {
      queryParams.keyword = keyword.value
      reset()
      getMaterialListForModal()
    }

    getMaterialListForModal()

    return {
      keyword,
      queryParams,
      sortOptionList,
      innerActionCallback,
      getMaterialListForModal,
      infiniteScroll,
      materialList,
      NODE_TYPE,
      isSearching,
      sort,
      search,
      selectedValue,
      actionButtonDisabled
    }
  }
}
</script>
