import pollingApi from '@/apis/polling'
import {
  PLAN_TYPE,
  PLAN_STATUS,
  MADE2FLOW_PLAN_TYPE,
  VALUE_ADDED_SERVICE_ID,
  VALUE_ADDED_SERVICE_STATUS,
} from '@/utils/constants'
import i18n from '@frontier/i18n'
import dayjs from 'dayjs'
import generateContentComponent from '@/utils/generateContentComponent'

const state = () => ({
  worker: null,
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
        max: '',
      },
      u3m: {
        used: '',
        max: '',
      },
      member: {
        used: '',
        max: '',
      },
    },
    hideCarbonEmissionUI: true,
  },
  valueAddedService: {
    made2flow: {
      renewDate: '2022/01/31',
      status: VALUE_ADDED_SERVICE_STATUS.EXPIRED,
      planType: MADE2FLOW_PLAN_TYPE.STANDARD,
      completeQty: 2032,
      totalQty: 3481,
      unFilledCertificationQty: 1093,
      subscribeDate: 1608905630674,
    },
  },
})

const getters = {
  worker: (state) => state.worker,
  plan: (state) => state.plan,
  deactivatedDate: (state) => state.plan.deactivatedDate,
  canCancelPlan: (state) => state.plan.deactivatedDate === null,
  valueAddedService: (state) => {
    const formatServiceTable = {}
    const { STANDARD, PERSONALIZED, PERSONALIZED_PRO } = MADE2FLOW_PLAN_TYPE
    const obj = {
      [STANDARD]: i18n.global.t('M2F033'),
      [PERSONALIZED]: i18n.global.t('M2F034'),
      [PERSONALIZED_PRO]: i18n.global.t('M2F035'),
    }

    Object.keys(state.valueAddedService).forEach((serviceId) => {
      formatServiceTable[serviceId] =
        JSON.parse(JSON.stringify(state.valueAddedService[serviceId])) || {}
      const planType = state.valueAddedService[serviceId]?.planType

      if (serviceId === VALUE_ADDED_SERVICE_ID.MADE2FLOW) {
        formatServiceTable[serviceId].planType = {
          STANDARD: STANDARD === planType,
          PERSONALIZED: PERSONALIZED === planType,
          PERSONALIZED_PRO: PERSONALIZED_PRO === planType,
        }
      }

      const planStatus = {}
      Object.keys(VALUE_ADDED_SERVICE_STATUS).forEach((status) => {
        planStatus[status] =
          state.valueAddedService[serviceId]?.status ===
          VALUE_ADDED_SERVICE_STATUS[status]
      })

      formatServiceTable[serviceId].planStatus = planStatus
      formatServiceTable[serviceId].planName =
        obj[state.valueAddedService[serviceId]?.planType]
    })

    return formatServiceTable
  },
  hasNoValueAddedService: (state) => {
    return Object.keys(state.valueAddedService).findIndex(
      (key) => !state.valueAddedService[key]
    )
  },
  planName: (state, getters) => {
    const { BASIC, PRO, ENT, DESIGNER } = PLAN_TYPE
    const obj = {
      [BASIC]: i18n.global.t('OO0174'),
      [PRO]: i18n.global.t('RR0160'),
      [ENT]: i18n.global.t('RR0161'),
      [DESIGNER]: i18n.global.t('RR0349'),
    }
    return obj[getters.plan.planType]
  },
  planStatus: (state, getters) => {
    const planStatus = {}
    Object.keys(PLAN_STATUS).forEach((status) => {
      planStatus[status] = getters.plan.status === PLAN_STATUS[status]
    })

    return planStatus
  },
  planType: (state, getters) => {
    const planType = getters.plan.planType
    const { BASIC, PRO, ENT, DESIGNER } = PLAN_TYPE
    return {
      BASIC: BASIC === planType,
      PRO: PRO === planType,
      ENT: ENT === planType,
      DESIGNER: DESIGNER === planType,
    }
  },
  hasU3mQuota: (state, getters) => {
    const { max, used } = getters.plan.quota.u3m
    return max - used > 0
  },
  isProcessing: (state) => state.isProcessing,
  notificationList: (state) => {
    return state.notificationList.map(
      ({ isRead, content, contentValue, createDate }) => {
        const re = new RegExp(/\{\d+\}/, 'g')
        const matches = [...content.matchAll(re)]
        const pairIndexList = []
        let i = 0
        if (matches.length !== 0) {
          for (const match of matches) {
            const index = match.index
            pairIndexList.push([i, index])
            pairIndexList.push([index, index + 3])
            i = index + 3
          }
        }
        pairIndexList.push([i, content.length])
        const contentComponent = generateContentComponent(
          content,
          contentValue,
          ['text-caption', 'text-grey-900', 'leading-1.6', 'pb-1'],
          ['text-caption', 'text-cyan-400', 'cursor-pointer']
        )

        let formattedDate

        if (dayjs.unix(createDate).isToday()) {
          const tempCreateDate = dayjs.unix(createDate).format('hh:mm A')
          formattedDate = `${i18n.global.t('NN0002')} ${i18n.global.t(
            'NN0004'
          )} ${tempCreateDate}`
        } else if (dayjs.unix(createDate).isYesterday()) {
          const tempCreateDate = dayjs.unix(createDate).format('hh:mm A')
          formattedDate = `${i18n.global.t('NN0003')} ${i18n.global.t(
            'NN0004'
          )} ${tempCreateDate}`
        } else {
          const tempCreateDate = dayjs.unix(createDate).format('MMM DD hh:mm A')
          formattedDate =
            tempCreateDate.slice(0, 6) +
            ` ${i18n.global.t('NN0004')} ` +
            tempCreateDate.slice(7)
        }

        return {
          isRead,
          formattedDate,
          contentComponent,
        }
      }
    )
  },
}

const MUTATION = {
  SET_polling: 'SET_polling',
}

const mutations = {
  SET_worker(state, worker) {
    state.worker = worker
  },
  [MUTATION.SET_polling](state, polling) {
    const { isProcessing, notificationList, plan, valueAddedService } = polling
    state.isProcessing = isProcessing
    state.notificationList = notificationList
    state.plan = plan
    state.valueAddedService = valueAddedService
  },
}

const actions = {
  setWorker({ commit }, worker) {
    commit('SET_worker', worker)

    worker.onmessage = (e) => {
      const { mutation, data } = e.data
      const { result } = data

      switch (mutation) {
        case MUTATION.SET_polling:
          commit(mutation, result.polling)
          break
      }
    }
  },
  workerPostMessage({ getters }, { api, body }) {
    getters.worker.postMessage({
      api,
      params: {
        apiEndPoint: import.meta.env.VITE_APP_API_ENDPOINT,
        token: localStorage.getItem('accessToken'),
        body,
      },
    })
  },
  async getSidebar({ rootGetters, commit, dispatch }, needPolling = true) {
    const { data } = await pollingApi.getSidebar({
      orgId: rootGetters['organization/orgId'],
    })
    commit('SET_polling', data.result.polling)
    needPolling && dispatch('startPollingSidebar')
  },
  startPollingSidebar({ rootGetters, dispatch }) {
    dispatch('workerPostMessage', {
      api: 'getSideBar',
      body: {
        orgId: rootGetters['organization/orgId'],
      },
    })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
