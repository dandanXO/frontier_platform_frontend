import organizationApi from '@/apis/organization'
import setVuexState from '@/utils/set-vuex-state'

const state = () => ({
  orgId: 1,
  logo: '',
  orgName: '',
  orgCategoryId: 1,
  countryCode: '',
  address: '',
  phone: '',
  phoneCountryCode: '',
  fax: '',
  faxCountryCode: '',
  inviteCode: '',
  labelColor: '',
  memberList: [
    // {
    //   orgUserId: 1,
    //   displayName: 'Mia Yang',
    //   avatar: 'https://fdkjasdjask',
    //   email: 'mia.yang@frontier.cool',
    //   roleId: 1,
    //   lastSignInTime: '8小時前',
    //   isPending: false
    // }
  ],
  groupList: [
    // {
    //   groupId: 1,
    //   groupName: 'Sales Department',
    //   labelColor: '#18AAFD'
    // }
  ]
})

const getters = {
  organization: state => state,
  memberList: state => state.memberList,
  groupList: state => state.groupList
}

const mutations = {
}

const actions = {
  setOrganization ({ state }, data) {
    setVuexState(state, data)
  },
  async createOrg (_, params) {
    const temp = {}
    Object.keys(params).forEach(key => {
      if (params[key] !== '') {
        temp[key] = params[key]
      }
    })
    if (!Object.prototype.hasOwnProperty.call(temp, 'phone')) {
      delete temp.phoneCountryCode
    }
    if (!Object.prototype.hasOwnProperty.call(temp, 'fax')) {
      delete temp.faxCountryCode
    }

    await organizationApi.createOrg(temp)
  },
  async getOrg ({ rootGetters, dispatch }, { orgName }) {
    const orgId = rootGetters['user/organizationList'].find(org => org.orgName === orgName)?.orgId || null
    const { data } = await organizationApi.getOrg({ orgId })
    dispatch('handleResponseData', { data }, { root: true })
  },
  async checkOrgNameExist (_, params) {
    const { data } = await organizationApi.checkOrgNameExist(params)
    const { result } = data

    return result.isExist
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
