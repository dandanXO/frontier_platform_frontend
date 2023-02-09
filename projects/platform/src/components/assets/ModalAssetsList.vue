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
    f-input-text(
      v-model:textValue="keyword"
      prependIcon="search"
      :placeholder="$t('FF0017')"
      :disabled="isInRoot"
      @enter="search"
    )
    div(class="flex-grow flex flex-col")
      div(class="relative z-20 flex justify-between items-center py-4")
        f-breadcrumb(
          :breadcrumbList="breadcrumbList"
          @click:item="goTo($event)"
        )
        div(class="flex items-center")
          div(v-if="isMultiSelect && selectedValue.length > 0" class="flex items-center")
            f-svg-icon(
              iconName="cancel"
              size="14"
              class="text-grey-250 mr-1 cursor-pointer"
              @click="clearSelect"
            )
            i18n-t(
              keypath="RR0073"
              tag="div"
              class="mr-1.5 text-caption"
              scope="global"
            )
              template(#number) {{ selectedValue.length }}
          f-popper(v-if="!isInRoot" placement="bottom-end")
            template(#trigger="{ isExpand }")
              f-svg-icon(
                iconName="sortby"
                size="20"
                class="transform cursor-pointer text-grey-600 hover:text-primary-400"
                :class="{ 'text-primary-400': isExpand }"
              )
            template(#content)
              f-contextual-menu(
                :menuTree="sortMenuTree"
                v-model:inputSelectValue="queryParams.sort"
                :selectMode="CONTEXTUAL_MENU_MODE.SINGLE_NONE_CANCEL"
                @click:menu="sort"
              )
      div(
        v-show="isSearching && nodeMaterialList.length === 0"
        class="flex-grow flex items-center justify-center"
      )
        f-svg-icon(iconName="loading" size="92" class="text-primary-400")
      f-scrollbar-container(
        v-if="!isSearching || nodeMaterialList.length > 0"
        class="h-64.5 -mx-5"
        @reachBottom="infiniteScroll"
      )
        div(class="grid grid-flow-row grid-cols-5 auto-rows-auto gap-5 px-5")
          template(v-if="isInRoot")
            div(
              v-for="item in orgAndGroupList"
              class="w-25 h-25 border rounded-md relative flex justify-center items-center cursor-pointer overflow-hidden border-grey-250 bg-grey-50 text-grey-900"
              @click="goTo(item)"
            )
              p(class="text-caption text-center font-bold line-clamp-3") {{ item.name }}
          template(v-else)
            grid-item-node-for-modal(
              v-for="nodeMaterial in nodeMaterialList"
              class="w-25"
              v-model:selectedValue="selectedValue"
              :node="nodeMaterial"
              :isMultiSelect="isMultiSelect"
            )
        div(
          v-if="isSearching && nodeMaterialList.length > 0"
          class="flex justify-center items-center"
        )
          f-svg-icon(iconName="loading" size="54" class="text-primary-400")
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
  NODE_TYPE,
  NODE_LOCATION,
  useConstants,
  CONTEXTUAL_MENU_MODE,
} from '@/utils/constants'
import GridItemNodeForModal from '@/components/common/gridItem/GridItemNodeForModal.vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  modalTitle: {
    type: String,
    required: true,
  },
  actionText: {
    type: String,
    required: true,
  },
  actionCallback: {
    type: Function,
    required: true,
  },
  isMultiSelect: {
    type: Boolean,
    default: true,
  },
  noteComponent: {
    type: Object,
  },
})

const { t } = useI18n()
const store = useStore()
const { SORT_BY } = useConstants()
const sortMenuTree = computed(() => {
  const { CREATE_DATE, LAST_UPDATE, MATERIAL_NO_A_Z } = SORT_BY.value
  return {
    blockList: [
      {
        menuList: [CREATE_DATE, LAST_UPDATE, MATERIAL_NO_A_Z].map(
          ({ text, value }) => ({
            title: text,
            selectValue: value,
          })
        ),
      },
    ],
  }
})
const keyword = ref('')
const isSearching = ref(false)
const nodeMaterialList = ref([])
const queryParams = reactive({
  keyword: '',
  targetPage: 1,
  sort: SORT_BY.value.CREATE_DATE.value,
  id: null,
  nodeLocation: null,
})
const totalPage = ref(1)
const selectedValue = ref(props.isMultiSelect ? [] : '')
const breadcrumbList = ref([
  {
    name: t('FF0016'),
    key: 'root',
  },
])

const routeLocation = computed(() => store.getters['helper/routeLocation'])
const isInRoot = computed(
  () => routeLocation.value === 'group' && breadcrumbList.value.length === 1
)
const actionButtonDisabled = computed(() => {
  return props.isMultiSelect
    ? selectedValue.value.length === 0
    : !selectedValue.value
})
const orgAndGroupList = computed(() => {
  const organization = store.getters['organization/organization']
  const list = []
  list.push({
    key: `${NODE_LOCATION.ORG}-${organization.orgId}`,
    name: organization.orgName,
  })
  if (routeLocation.value === 'group') {
    const { groupId, groupName } = store.getters['group/group']
    list.push({
      key: `${NODE_LOCATION.GROUP}-${groupId}`,
      name: groupName,
    })
  }
  return list
})

const innerActionCallback = async () => {
  const tempSelectValue = props.isMultiSelect
    ? selectedValue.value.map((v) => v.properties)
    : selectedValue.value.properties
  await props.actionCallback(tempSelectValue)
}

const getMaterialListForModal = async () => {
  isSearching.value = true

  const { pagination, assets } = await store.dispatch(
    'assets/getMaterialListForModal',
    queryParams
  )
  totalPage.value = pagination.totalPage

  assets.materialList.forEach((material) => {
    nodeMaterialList.value.push({
      nodeType: NODE_TYPE.MATERIAL,
      properties: material,
    })
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
  nodeMaterialList.value.length = 0
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
