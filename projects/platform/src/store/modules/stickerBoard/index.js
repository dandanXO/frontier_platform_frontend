import stickerBoardApi from '@/apis/stickerBoard'

export default {
  namespaced: true,
  state: () => ({
    allHasNewUpdate: false,
    myOrgHasNewUpdate: false,
    channel: {
      opened: new Array(10).fill(0).map((_, index) => ({
        channelId: index + 1,
        orgName: `Tab${index + 1}`,
        orgLogo: 'https://picsum.photos/200',
        hasNewUpdate: false,
      })),
      pinned: [],
      inbox: [],
    },
  }),
  getters: {
    channel: (state) => state.channel,
  },
  mutations: {
    SET_channel(state, channel) {
      state.channel = channel
    },
  },
  actions: {
    async callStickerBoardApi({ rootGetters }, { func, params = {} }) {
      return await stickerBoardApi[func](
        rootGetters['helper/routeLocation'],
        rootGetters['helper/routeLocationId'],
        params
      )
    },
    async getChannelList({ dispatch, commit }) {
      const { data } = await dispatch('callStickerBoardApi', {
        func: 'getChannelList',
      })
      commit('SET_channel', data.result.channel)
    },
    async changeChannelPosition({ dispatch, commit }, params) {
      const { data } = await dispatch('callStickerBoardApi', {
        func: 'changeChannelPosition',
        params,
      })
      commit('SET_channel', data.result.channel)
    },
  },
}
