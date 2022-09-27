import pollingApi from '@/apis/polling'
import { PLAN_TYPE, PLAN_STATUS, MADE2FLOW_PLAN_TYPE, VALUE_ADDED_SERVICE_ID, VALUE_ADDED_SERVICE_STATUS } from '@/utils/constants.js'
import i18n from '@/utils/i18n'
import dayjs from 'dayjs'

const state = () => ({
  timerId: null,
  isProcessing: false,
  notificationList: [],
  plan: {
    planType: PLAN_TYPE.BASIC,
    status: PLAN_STATUS.ACTIVE,
    renewDate: null,
    deactivatedDate: null,
    bufferDeactivatedDate: null,
    quota: {
      material: {
        used: 0,
        max: ''
      },
      u3m: {
        used: '',
        max: ''
      },
      member: {
        used: '',
        max: ''
      }
    },
    hideCarbonEmissionUI: true
  },
  valueAddedService: {
    made2flow: {
      renewDate: "2022/01/31",
      status: VALUE_ADDED_SERVICE_STATUS.EXPIRED,
      planType: MADE2FLOW_PLAN_TYPE.STANDARD,
      completeQty: 2032,
      totalQty: 3481,
      unFilledCertificationQty: 1093,
      subscribeDate: 1608905630674
    }
  }
})

const getters = {
  plan: state => state.plan,
  valueAddedService: state => {
    const formatServiceTable = {}
    const { STANDARD, PERSONALIZED, PERSONALIZED_PRO } = MADE2FLOW_PLAN_TYPE
    const obj = {
      [STANDARD]: i18n.global.t('M2F033'),
      [PERSONALIZED]: i18n.global.t('M2F034'),
      [PERSONALIZED_PRO]: i18n.global.t('M2F035')
    }

    Object.keys(state.valueAddedService).forEach(serviceId => {
      formatServiceTable[serviceId] = JSON.parse(JSON.stringify(state.valueAddedService[serviceId])) || {}
      const planType = state.valueAddedService[serviceId]?.planType

      if (serviceId === VALUE_ADDED_SERVICE_ID.MADE2FLOW) {
        formatServiceTable[serviceId].planType = {
          STANDARD: STANDARD === planType,
          PERSONALIZED: PERSONALIZED === planType,
          PERSONALIZED_PRO: PERSONALIZED_PRO === planType
        }
      }

      const planStatus = {}
      Object.keys(VALUE_ADDED_SERVICE_STATUS).forEach(status => {
        planStatus[status] = state.valueAddedService[serviceId]?.status === VALUE_ADDED_SERVICE_STATUS[status]
      })

      formatServiceTable[serviceId].planStatus = planStatus
      formatServiceTable[serviceId].planName = obj[state.valueAddedService[serviceId]?.planType]
    })

    return formatServiceTable
  },
  hasNoValueAddedService: state => {
    return Object.keys(state.valueAddedService).findIndex(key => !state.valueAddedService[key])
  },
  planName: (state, getters) => {
    const { BASIC, PRO, ENT } = PLAN_TYPE
    const obj = {
      [BASIC]: i18n.global.t('OO0174'),
      [PRO]: i18n.global.t('RR0160'),
      [ENT]: i18n.global.t('RR0161')
    }
    return obj[getters.plan.planType]
  },
  planStatus: (state, getters) => {
    const planStatus = {}
    Object.keys(PLAN_STATUS).forEach(status => {
      planStatus[status] = getters.plan.status === PLAN_STATUS[status]
    })

    return planStatus
  },
  planType: (state, getters) => {
    const planType = getters.plan.planType
    const { BASIC, PRO, ENT } = PLAN_TYPE
    return {
      BASIC: BASIC === planType,
      PRO: PRO === planType,
      ENT: ENT === planType
    }
  },
  isProcessing: state => state.isProcessing,
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

const mutations = {
  SET_polling (state, polling) {
    const { isProcessing, notificationList, plan, valueAddedService } = polling
    state.isProcessing = isProcessing
    state.notificationList = notificationList
    state.plan = plan
    state.valueAddedService = valueAddedService
  },
  SET_timerId (state, timerId) {
    state.timerId = timerId
  },
  CLEAR_timerId (state) {
    clearTimeout(state.timerId)
  }
}

const actions = {
  async getPollingSidebar ({ rootGetters, commit, dispatch }) {
    dispatch('stopPollingSidebar')

    const { data } = await pollingApi.getPollingSidebar({ orgId: rootGetters['organization/orgId'] })

    commit('SET_polling', data.result.polling)
    commit('SET_timerId', setTimeout(async () => {
      await dispatch('getPollingSidebar')
    }, 30000))
  },
  stopPollingSidebar ({ commit }) {
    commit('CLEAR_timerId')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
