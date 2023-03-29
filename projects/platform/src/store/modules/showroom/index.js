import showroomApi from '@/apis/showroom.js'
import { SHOWROOM_STATUS } from '@/utils/constants'
import generateContentComponent from '@/utils/generateContentComponent'
import { PublicCollection } from '@/store/reuseModules/collection'
import Material from '@/store/reuseModules/material.js'
import NodePublishState from '@/store/reuseStates/nodePublishState.js'

export default {
  namespaced: true,
  modules: {
    collection: PublicCollection,
    material: Material,
  },
  state: () => ({
    isPromoting: false, // 用來判斷要不要跳showroom的 announcement modal
    announcement: {
      coverImg: '',
      title: '',
      subtitle: '',
      participatedOrgLogoList: [],
      description: {
        // follow notification structure
        content: '', // Don't miss out on the amazing {0}
        contentValue: [
          // {
          //   type: 1, // 1 url
          //   text: "我是連結1",
          //   value: "https://xxxxxx.xxxx"
          // }
        ],
      },
      showroomId: 0, // 導向哪一個 showroom
    },
    banner: {
      coverImg: '',
      title: '',
      description: {}, // follow announcement.description
    },
    showroomList: [
      {
        showroomId: 0,
        coverImg: '',
        status: SHOWROOM_STATUS.CLOSE,
        period: '', // 5-8 April, 2023
        title: '',
        location: '',
        subtitle: '',
        categoryList: [],
      },
    ],
    showroom: {
      showroomId: 0,
      coverImg: '',
      status: 0, // 0 close, 1 coming soon, 2 current
      period: '', // 5-8 April, 2023
      title: '',
      location: '',
      subtitle: '',
      categoryList: [],
      description: {}, // follow announcement.description
      participatedOrgList: [
        // {
        //   orgId: 0,
        //   logo: '',
        //   orgName: '',
        //   contactEmail: '',
        // },
      ],
    },
    materialBreadcrumbList: [],
    materialPublish: NodePublishState(),
  }),
  getters: {
    isPromoting: (state) => state.isPromoting,
    announcement: (state) => state.announcement,
    announcementDescriptionComponent: (state) => {
      const { content, contentValue } = state.announcement.description
      return generateContentComponent(
        content,
        contentValue,
        ['w-full', 'text-body2', 'text-grey-400', 'leading-1.6'],
        ['text-body2', 'text-blue-500', 'underline']
      )
    },
    banner: (state) => state.banner,
    bannerDescriptionComponent: (state) => {
      const { content, contentValue } = state.banner.description
      return generateContentComponent(
        content,
        contentValue,
        ['w-full', 'text-body2', 'text-grey-0'],
        ['text-body2', 'text-grey-0', 'underline']
      )
    },
    showroomList: (state) => state.showroomList,
    showroom: (state) => state.showroom,
    showroomDescriptionComponent: (state) => {
      const { content, contentValue } = state.showroom.description
      return generateContentComponent(
        content,
        contentValue,
        ['w-full', 'text-body2', 'text-grey-0'],
        ['text-body2', 'text-grey-0', 'underline']
      )
    },
    materialBreadcrumbList: (state) =>
      state.materialBreadcrumbList.map(
        ({ name, workspaceNodeId, workspaceNodeLocation }) => ({
          name,
          nodeKey: `${workspaceNodeLocation}-${workspaceNodeId}`,
        })
      ),
    materialPublish: (state) => state.materialPublish,
  },
  mutations: {
    SET_isPromoting(state, isPromoting) {
      state.isPromoting = isPromoting
    },
    SET_announcement(state, announcement) {
      state.announcement = announcement
    },
    SET_banner(state, banner) {
      state.banner = banner
    },
    SET_showroomList(state, showroomList) {
      state.showroomList = showroomList
    },
    SET_showroom(state, showroom) {
      state.showroom = showroom
    },
    SET_materialBreadcrumbList(state, materialBreadcrumbList) {
      state.materialBreadcrumbList = materialBreadcrumbList
    },
    SET_materialPublish(state, materialPublish) {
      state.materialPublish = materialPublish
    },
  },
  actions: {
    async getShowroomAnnouncement({ rootGetters, commit }) {
      const { data } = await showroomApi.getShowroomAnnouncement({
        orgId: rootGetters['organization/orgId'],
      })
      commit('SET_isPromoting', data.result.isPromoting)
      commit('SET_announcement', data.result.announcement)
    },
    async getShowroomBannerAndList({ rootGetters, commit }) {
      const { data } = await showroomApi.getShowroomBannerAndList({
        orgId: rootGetters['organization/orgId'],
      })
      commit('SET_banner', data.result.banner)
      commit('SET_showroomList', data.result.showroomList)
    },
    async getShowroom({ rootGetters, commit }, { showroomId }) {
      const { data } = await showroomApi.getShowroom({
        orgId: rootGetters['organization/orgId'],
        showroomId,
      })

      commit('SET_showroom', data.result.showroom)
    },
    async getShowroomNodeList(
      { rootGetters, dispatch, commit },
      { targetPage = 1, nodeKey, showroomId }
    ) {
      const [workspaceNodeLocation, workspaceNodeId] = nodeKey?.split('-') || [
        null,
        null,
      ]
      const searchParams =
        rootGetters['helper/search/getSearchParams'](targetPage)
      const params = {
        orgId: rootGetters['organization/orgId'],
        showroomId,
        workspaceNodeId,
        workspaceNodeLocation,
        ...searchParams,
      }

      const { data } = await showroomApi.getShowroomNodeList(params)
      const { publicCollection, pagination } = data.result

      commit('SET_collection', publicCollection)
      dispatch('helper/search/setPagination', pagination, { root: true })
    },
    async getShowroomMaterial({ rootGetters, commit }, { nodeKey, rank }) {
      const [workspaceNodeLocation, workspaceNodeId] = nodeKey?.split('-') || [
        null,
        null,
      ]
      const params = {
        orgId: rootGetters['organization/orgId'],
        workspaceNodeId,
        workspaceNodeLocation,
      }
      const keyword = rootGetters['helper/search/keyword']
      if (keyword) {
        params['keyword'] = keyword
        params['rank'] = rank
      }
      const { data } = await showroomApi.getShowroomMaterial(params)
      const { breadcrumbList, material, publish } = data.result
      commit('SET_material', material)
      commit('SET_materialBreadcrumbList', breadcrumbList)
      commit('SET_materialPublish', publish)
    },
    async contactShowroomOrg(_, params) {
      await showroomApi.contactShowroomOrg(params)
    },
  },
}
