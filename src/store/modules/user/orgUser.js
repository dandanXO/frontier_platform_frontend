import userApi from '@/apis/user'
import setVuexState from '@/utils/set-vuex-state'
import i18n from '@/utils/i18n'
import dayjs from 'dayjs'

const state = () => ({
  orgUserId: 0,
  displayName: '',
  orgRoleId: 0,
  originalAvatar: '',
  avatar: '',
  lastSignInTime: '',
  email: '',
  isPending: false,
  notificationList: []
})

const getters = {
  orgUser: state => state,
  avatar: state => state.avatar ? state.avatar : require('@/assets/images/default_user.png'),
  notificationList: state => {
    return state.notificationList.map(({ isRead, content, contentValue, createDate }) => {
      const re = new RegExp(/\{\d+\}/, 'g')
      const matches = [...content.matchAll(re)]

      let replacedContent = content

      if (matches.length !== 0) {
        for (const match of matches) {
          const targetIndex = Number(match[0].slice(1, match[0].length - 1))
          const { text, url } = contentValue[targetIndex]
          const html = `<a href="${url}" target="_blank" class="text-caption text-assist-blue">${text}</a>`
          replacedContent = replacedContent.replace(match[0], html)
        }
      }

      let formattedDate

      if (dayjs.unix(createDate).isToday()) {
        const tempCreateDate = dayjs.unix(createDate).format('hh:mm A')
        formattedDate = `${i18n.global.t('NN0002')} ${i18n.global.t('NN0004')} ${tempCreateDate}`
      } else if (dayjs.unix(createDate).isYesterday()) {
        const tempCreateDate = dayjs.unix(createDate).format('hh:mm A')
        formattedDate = `${i18n.global.t('NN0003')} ${i18n.global.t('NN0004')} ${tempCreateDate}`
      } else {
        const tempCreateDate = dayjs.unix(createDate).format('MMM DD hh:mm A')
        formattedDate = tempCreateDate.slice(0, 6) + ` ${i18n.global.t('NN0004')} ` + tempCreateDate.slice(7)
      }

      return {
        isRead,
        formattedDate,
        content: replacedContent
      }
    })
  }
}

const actions = {
  setOrgUser ({ state }, data) {
    setVuexState(state, data)
  },
  async getOrgUser ({ rootGetters, dispatch }) {
    const { data } = await userApi.getOrgUser({ orgId: rootGetters['organization/orgId'] })
    dispatch('handleResponseData', { data }, { root: true })
  },
  async updateDisplayName ({ rootGetters, dispatch }, { displayName }) {
    const { data } = await userApi.updateDisplayName({ orgId: rootGetters['organization/orgId'], displayName })
    dispatch('handleResponseData', { data }, { root: true })
  },
  async updateAvatar ({ rootGetters, dispatch }, { avatar, originalAvatar }) {
    const { data } = await userApi.updateAvatar({ orgId: rootGetters['organization/orgId'], avatar, originalAvatar })
    dispatch('handleResponseData', { data }, { root: true })
  },
  async removeAvatar ({ rootGetters, dispatch }) {
    const { data } = await userApi.removeAvatar({ orgId: rootGetters['organization/orgId'] })
    dispatch('handleResponseData', { data }, { root: true })
  },
  async readNotification ({ rootGetters, dispatch }) {
    const { data } = await userApi.readNotification({ orgId: rootGetters['organization/orgId'] })
    dispatch('handleResponseData', { data }, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions
}
