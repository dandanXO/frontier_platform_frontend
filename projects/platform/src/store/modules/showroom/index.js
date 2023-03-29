import showroomApi from '@/apis/showroom.js'

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
  }),
  getters: {
    isPromoting: (state) => state.isPromoting,
    announcement: (state) => state.announcement,
  },
  mutations: {
    SET_isPromoting(state, isPromoting) {
      state.isPromoting = isPromoting
    },
    SET_announcement(state, announcement) {
      state.announcement = announcement
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
  },
}
