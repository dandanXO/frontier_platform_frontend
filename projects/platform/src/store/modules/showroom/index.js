import showroomApi from '@/apis/showroom.js'
import { SHOWROOM_STATUS } from '@/utils/constants'
import generateContentComponent from '@/utils/generateContentComponent'

export default {
  namespaced: true,
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
      description: {
        // follow announcement.description
        content: '',
        contentValue: [],
      },
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
  },
}
