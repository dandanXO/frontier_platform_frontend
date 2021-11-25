import setVuexState from '@/utils/set-vuex-state'
import assetsApi from '@/apis/assets'
import { downloadBase64File } from '@/utils/fileOperator'

const getMergeRowState = () => ({
  faceSide: {},
  backSide: {},
  detail: {}
})

const state = () => ({
  materialList: [],
  addedMaterialList: [],
  preMergeList: [],
  mergedList: [getMergeRowState()]
})

const getters = {
  materialList: state => state.materialList,
  addedMaterialList: state => state.addedMaterialList,
  formalAddedMaterialList: state => state.addedMaterialList.map((item) => JSON.parse(item)),
  preMergeList: state => state.preMergeList
    .map(material => {
      const temp = {}
      Object.keys(getMergeRowState()).forEach(key => {
        temp[key] = material
      })
      return temp
    }),
  mergedList: state => state.mergedList
}

const mutations = {
  CLEAR_addedMaterialList (state) {
    state.addedMaterialList.length = 0
  },
  SET_addedMaterialList (state, arr) {
    /**
     * addedMaterialList 是 String 組成的陣列，其中的字串是由 JSON.stringify(object) 轉型而來
     * 比對時一定要以 string 格式比對，所以下面會判斷 arr 裡面的東西是不是字串，並且進行轉換
     * 目前有 2 種來源：assets page 裡面的 handleSelectAll（object）、inputCheckbox（string）
     */
    state.addedMaterialList = arr.map(item => {
      return typeof item === 'string' || item instanceof String ? item : JSON.stringify(item)
    })
  },
  SET_preMergeList (state, preMergeList) {
    Object.assign(state.preMergeList, [...preMergeList])
  },
  RESET_mergedList (state) {
    state.mergedList.length = 0
    state.mergedList.push(getMergeRowState())
  },
  ADD_mergedList_row (state) {
    state.mergedList.push(getMergeRowState())
  },
  UPDATE_mergedList_row (state, { index, item }) {
    Object.assign(state.mergedList[index], item)
  },
  REMOVE_mergedList_row (state, index) {
    state.mergedList.splice(index, 1)
  },
  CLEAR_mergedList_row_block (state, { index, blockType }) {
    state.mergedList[index][blockType] = {}
  }
}

const actions = {
  setAssets ({ state }, data) {
    setVuexState(state, data)
  },
  async getMaterialList ({ rootGetters, dispatch }, { targetPage = 1 }) {
    const pagination = rootGetters['helper/search/pagination']
    const { perPageCount, isShowMatch, sort } = pagination
    const params = {
      pagination: {
        perPageCount: Number(perPageCount),
        isShowMatch: Boolean(isShowMatch),
        sort: Number(sort),
        targetPage: Number(targetPage)
      },
      filter: rootGetters['helper/search/filter']
    }
    const search = {
      keyword: rootGetters['helper/search/keyword'],
      selectedTagList: rootGetters['helper/search/selectedTagList']
    }

    if (!(search.keyword === '' && search.selectedTagList.length === 0)) {
      params.search = search
    }

    const { data } = rootGetters['helper/routeLocation'] === 'org'
      ? await assetsApi.org.getMaterialList({ orgId: rootGetters['organization/orgId'], ...params })
      : await assetsApi.group.getMaterialList({ groupId: rootGetters['group/groupId'], ...params })

    dispatch('handleResponseData', { data }, { root: true })
  },
  async mergeMaterial ({ rootGetters, dispatch }, { mergedList }) {
    const { data } = rootGetters['helper/routeLocation'] === 'org'
      ? await assetsApi.org.mergeMaterial({ orgId: rootGetters['organization/orgId'], mergedList })
      : await assetsApi.group.mergeMaterial({ groupId: rootGetters['group/groupId'], mergedList })

    dispatch('handleResponseData', { data }, { root: true })
  },
  async carbonCopyMaterial ({ rootGetters }, { materialId }) {
    rootGetters['helper/routeLocation'] === 'org'
      ? await assetsApi.org.carbonCopyMaterial({ orgId: rootGetters['organization/orgId'], materialId })
      : await assetsApi.group.carbonCopyMaterial({ groupId: rootGetters['group/groupId'], materialId })
  },
  async deleteMaterial ({ rootGetters }, { materialIdList }) {
    rootGetters['helper/routeLocation'] === 'org'
      ? await assetsApi.org.deleteMaterial({ orgId: rootGetters['organization/orgId'], materialIdList })
      : await assetsApi.group.deleteMaterial({ groupId: rootGetters['group/groupId'], materialIdList })
  },
  async exportMaterial ({ rootGetters }, { materialIdList }) {
    const { data } = rootGetters['helper/routeLocation'] === 'org'
      ? await assetsApi.org.exportMaterial({ orgId: rootGetters['organization/orgId'], materialIdList })
      : await assetsApi.group.exportMaterial({ groupId: rootGetters['group/groupId'], materialIdList })

    const { extension, file, fileName } = data?.result
    downloadBase64File(file, extension, fileName)
  },
  async cloneMaterial ({ rootGetters }, { targetIdList, materialIdList }) {
    rootGetters['helper/routeLocation'] === 'org'
      ? await assetsApi.org.cloneMaterial({ orgId: rootGetters['organization/orgId'], targetIdList, materialIdList })
      : await assetsApi.group.cloneMaterial({ groupId: rootGetters['group/groupId'], targetIdList, materialIdList })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
