import organizationApi from '@/apis/organization'

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
    {
      orgUserId: 1,
      displayName: 'Mia Yang',
      avatar: 'https://fdkjasdjask',
      email: 'mia.yang@frontier.cool',
      roleId: 1,
      lastSignInTime: '8小時前',
      isPending: false
    },
    {
      orgUserId: 2,
      displayName: null,
      avatar: 'https://fdkjasdjask',
      email: 'mia.yang@frontier.cool',
      roleId: null,
      lastSignInTime: null,
      isPending: true
    }
  ]
})

const getters = {
}

const mutations = {
}

const actions = {
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
