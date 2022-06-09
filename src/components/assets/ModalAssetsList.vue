<template lang="pug">
modal-behavior(
  :header="modalTitle"
  :primaryBtnText="actionText"
  :primaryBtnDisabled="actionButtonDisabled"
  :secondaryBtnText="$t('UU0002')"
  @click:primary="innerActionCallback"
  @click:secondary="$store.dispatch('helper/closeModalBehavior')"
) 
  template(#note)
    component(:is="noteComponent")
  div(class="w-145 h-89 flex flex-col")
    input-text(
      v-model:textValue="keyword"
      prependIcon="search"
      :placeholder="$t('FF0017')"
      :disabled="isInRoot"
      @enter="search"
    )
    div(class="flex-grow flex flex-col")
      div(class="relative z-20 flex justify-between items-center py-4")
        breadcrumb(:breadcrumbList="breadcrumbList" @click:item="goTo($event)")
        div(class="flex items-center")
          div(v-if="isMultiSelect && selectedValue.length > 0" class="flex items-center")
            svg-icon(iconName="cancel" size="14" class="text-black-400 mr-1 cursor-pointer" @click="clearSelect")
            i18n-t(keypath="RR0073" tag="div" class="mr-1.5 text-caption")
              template(#number) {{ selectedValue.length }}
          tooltip(
            v-if="!isInRoot"
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
      overlay-scrollbar-container(v-if="!isSearching || materialList.length > 0" class="h-64.5 -mx-5" @reachBottom="infiniteScroll")
        div(class="grid grid-flow-row grid-cols-5 auto-rows-auto gap-5 px-5")
          template(v-if="isInRoot")
            div(
              v-for="item in orgAndGroupList"
              class="w-25 h-25 border rounded-md relative flex justify-center items-center cursor-pointer overflow-hidden border-black-400 bg-black-100 text-primary"
              @click="goTo(item)"
            )
              p(class="text-caption text-center font-bold line-clamp-3") {{ item.name }}
          template(v-else)
            node-item-for-modal(
              v-for="material in materialList"
              class="w-25"
              v-model:selectedValue="selectedValue"
              :node="material"
              :displayName="material.materialNo"
              :isMultiSelect="isMultiSelect"
            )
        div(v-if="isSearching && materialList.length > 0" class="flex justify-center items-center")
          svg-icon(iconName="loading" size="54" class="text-brand")
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { SORT_BY, NODE_TYPE, NODE_LOCATION } from '@/utils/constants'
import NodeItemForModal from '@/components/common/NodeItemForModal.vue'
import { useStore } from 'vuex'
import useMaterial from '@/composables/useMaterial'
import { useI18n } from 'vue-i18n'

const props = defineProps({
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
  },
  noteComponent: {
    type: Object
  }
})

const { t } = useI18n()
const store = useStore()
const sortOptionList = [SORT_BY.CREATE_DATE, SORT_BY.LAST_UPDATE, SORT_BY.MATERIAL_NO_A_Z]

const keyword = ref('')
const isSearching = ref(false)
const materialList = ref([])
const queryParams = reactive({
  keyword: '',
  targetPage: 1,
  sort: sortOptionList[0].value,
  id: null,
  nodeLocation: null
})
const totalPage = ref(1)
const selectedValue = ref(props.isMultiSelect ? [] : '')
const breadcrumbList = ref([
  {
    name: t('FF0016'),
    key: 'root'
  }
])

const routeLocation = computed(() => store.getters['helper/routeLocation'])
const isInRoot = computed(() => routeLocation.value === 'group' && breadcrumbList.value.length === 1)
const actionButtonDisabled = computed(() => {
  return props.isMultiSelect ? selectedValue.value.length === 0 : !selectedValue.value
})
const orgAndGroupList = computed(() => {
  const organization = store.getters['organization/organization']
  const list = []
  list.push({
    key: `${NODE_LOCATION.ORG}-${organization.orgId}`,
    name: organization.orgName
  })
  organization.groupList.forEach((group) => {
    list.push({
      key: `${NODE_LOCATION.GROUP}-${group.groupId}`,
      name: group.groupName
    })
  })
  return list
})

const innerActionCallback = async () => {
  const tempSelectValue = props.isMultiSelect ? selectedValue.value.map((v) => JSON.parse(v)) : JSON.parse(selectedValue.value)
  await props.actionCallback(tempSelectValue)
}

const getMaterialListForModal = async () => {
  isSearching.value = true

  const { pagination, assets } = await store.dispatch('assets/getMaterialListForModal', queryParams)
  totalPage.value = pagination.totalPage

  assets.materialList.forEach((material) => {
    /**
     * 因爲 NodeItemForModal 的 img 是吃 node.coverImg，
     * 所以才在此將 currentCoverImg 覆蓋 coverImg
     */
    const { currentCoverImg } = useMaterial(material)
    material.coverImg = currentCoverImg
    material.nodeType = NODE_TYPE.MATERIAL
    materialList.value.push(material)
  })

  isSearching.value = false
}

const infiniteScroll = () => {
  if (isSearching.value) {
    return
  }

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

const goTo = (option) => {
  if (option.key === 'root') {
    breadcrumbList.value.length = 1
  } else if (!breadcrumbList.value.some((item) => item.key === option.key)) {
    breadcrumbList.value.push(option)
    const [nodeLocation, id] = option.key.split('-')
    queryParams.nodeLocation = nodeLocation
    queryParams.id = id
    reset()
    getMaterialListForModal()
  }
}

const clearSelect = () => (selectedValue.value.length = 0)

if (routeLocation.value === 'org') {
  queryParams.nodeLocation = NODE_LOCATION.ORG
  queryParams.id = store.getters['organization/organization'].orgId
  getMaterialListForModal()
}
</script>
