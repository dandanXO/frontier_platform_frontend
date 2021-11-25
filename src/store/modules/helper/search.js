import codeApi from '@/apis/code'
import { FILTER_COMPLETE } from '@/utils/constants'
import i18n from '@/utils/i18n'

const defaultFilterState = () => ({
  contentList: [],
  finishList: [],
  complete: null,
  wovenWarpYarnCount: null,
  wovenWeftYarnCount: null,
  knitYarnCount: null,
  warpDensity: null,
  weftDensity: null,
  color: null,
  pattern: null,
  category: null,
  hasPrice: null,
  width: {
    min: null,
    max: null,
    isInfinity: false
  },
  weightGsm: {
    min: null,
    max: null,
    isInfinity: false
  },
  inventory: {
    unit: null,
    quantity: {
      min: null,
      max: null,
      isInfinity: false
    }
  }
})

const state = () => ({
  filter: defaultFilterState(),
  keyword: '',
  tagList: [],
  selectedTagList: [],
  pagination: {
    isShowMatch: false,
    sort: 4,
    currentPage: 1,
    perPageCount: 40,
    totalCount: 0,
    totalMatchCount: 0,
    totalPage: 1
  }
})

const getters = {
  filter: state => state.filter,
  filterDirty: state => ({
    contentList: state.filter.contentList.length !== 0,
    finishList: state.filter.finishList.length !== 0,
    color: !!state.filter.color,
    complete: !!state.filter.complete,
    pattern: !!state.filter.pattern,
    category: !!state.filter.category,
    hasPrice: state.filter.hasPrice !== null,
    yarnAndDensity: !!state.filter.wovenWarpYarnCount || !!state.filter.wovenWeftYarnCount || !!state.filter.warpDensity || !!state.filter.weftDensity || !!state.filter.knitYarnCount,
    widthAndWeightGsm: !!state.filter.width.min || !!state.filter.width.max || !!state.filter.weightGsm.min || !!state.filter.weightGsm.max,
    inventory: !!state.filter.inventory.quantity.min || !!state.filter.inventory.quantity.max
  }),
  filterOptions: (state, getters, rootState, rootGetters) => {
    const filterOptionList = rootGetters['code/filterOptionList']
    const { categoryList, finishList } = filterOptionList
    return {
      ...filterOptionList,
      categoryList: categoryList.map(({ key, list }) => ({
        text: key,
        subList: list
          .map(({ displayName, value }) => ({
            text: displayName,
            value
          }))
      })),
      finishList: finishList.map(({ displayName, value }) => ({
        text: displayName,
        value
      })),
      completeList: Object.keys(FILTER_COMPLETE).map(key => ({ ...FILTER_COMPLETE[key] })),
      priceList: [
        {
          text: i18n.global.t('RR0096'),
          value: true
        },
        {
          text: i18n.global.t('RR0097'),
          value: false
        }
      ],
      width: { min: 0, max: 200 },
      weightGsm: { min: 0, max: 600 },
      inventory: { min: 0, max: 10000 }
    }
  },
  keyword: state => state.keyword,
  tagList: state => state.tagList,
  selectedTagList: state => state.selectedTagList,
  pagination: state => state.pagination
}

const mutations = {
  SET_filter (state, filter) {
    Object.assign(state.filter, filter)
  },
  SET_keyword (state, keyword) {
    state.keyword = keyword
  },
  SET_tagList (state, tagList) {
    Object.assign(state.tagList, tagList)
  },
  SET_selectedTagList (state, selectedTagList) {
    Object.assign(state.selectedTagList, selectedTagList)
  },
  SET_pagination (state, pagination) {
    Object.assign(state.pagination, pagination)
  }
}

const actions = {
  reset ({ dispatch }, { sort }) {
    dispatch('resetKeyword')
    dispatch('resetTagList')
    dispatch('resetFilter')
    dispatch('resetSelectedTagList')
    dispatch('setPagination', { sort })
  },
  setFilter ({ commit }, filter) {
    commit('SET_filter', filter)
  },
  resetFilter ({ commit }) {
    commit('SET_filter', defaultFilterState())
  },
  setKeyword ({ commit }, keyword) {
    commit('SET_keyword', keyword)
  },
  resetKeyword ({ commit }) {
    commit('SET_keyword', '')
  },
  setTagList ({ commit }, tagList) {
    commit('SET_tagList', tagList)
  },
  resetTagList ({ commit }) {
    commit('SET_tagList', [])
  },
  setSelectedTagList ({ commit }, selectedTagList) {
    commit('SET_selectedTagList', selectedTagList)
  },
  resetSelectedTagList ({ commit }) {
    commit('SET_selectedTagList', [])
  },
  setPagination ({ commit }, pagination) {
    commit('SET_pagination', pagination)
  },
  async getAITags ({ state, dispatch }, { searchKeyword }) {
    const { data } = await codeApi.getAITags({ searchKeyword })
    const tagList = data.result?.tagList
    const selectedTagList = state.selectedTagList.filter(selectedTag => tagList.some(tag => tag.name === selectedTag.name))
    dispatch('setTagList', tagList)
    dispatch('setSelectedTagList', selectedTagList)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
