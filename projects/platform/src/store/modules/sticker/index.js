import stickerApi from '@/apis/sticker.js'
import Material from '@/store/reuseModules/material.js'

const defaultDigitalThreadBase = () => ({
  digitalThreadId: null,
  digitalThreadName: 'Untitled',
  isCreatorSide: false, // 檢視該DigitalThread的使用者是否為建立方組織的成員
  materialId: 0,
  materialNo: '',
  materialCoverImg: '',
  materialOwnerUnitName: '', // 布片擁有者的單位名稱，檢視角度為布片擁有者時為:布片擁有者的組織(+團隊)名稱，非布片擁有者為:布片擁有者的組織名稱
  materialOwnerUnitLogo: '', // 布片擁有者的單位Logo
  hasMaterialDeleted: false,
  hasMaterialNoAccess: false,
  addFromLocationType: 1, // 從哪個功能新增這個Digital Thread,
  addFromLocationList: [], // 從哪個功能底下的哪個路徑新增這個Digital Thread,
  creatorUnitName: '', //  建立者單位，檢視角度為建立者時為:呈現建立者的組織(+團隊)名稱，非建立者為:呈現建立者的組織名稱
  creatorUnitLogo: '', // 建立者的單位的Logo,
  creatorUnitLabelColor: '',
  creator: '', // 建立者的使用者名稱，若isCreatorSide為false，則為null值
  creatorAvatar: '', // 建立者的大頭貼，若isCreatorSide為false，則為null值
  createDate: '',
  stickerStatistics: {
    totalQty: 0,
    internalQty: 0,
    externalQty: 0,
    starredQty: 0,
  },
  tagList: [],
  participantList: [], // { name: '', avatar: '' }
  unreadStickerQty: 0,
})

export default {
  namespaced: true,
  modules: {
    material: Material,
  },
  state: () => ({
    isStickerDrawerOpen: false,
    currentMaterialId: null,
    addFromLocationType: null,
    addFromLocationList: null,
    digitalThread: {
      ...defaultDigitalThreadBase(),
      stickerList: [],
    },
    digitalThreadList: [],
    tempDigitalThreadList: [], // 尚未真的新增到後端時，用於前端操作的 digital thread list,
    sticker: {},
  }),
  getters: {
    currentMaterialId: (state) => state.currentMaterialId,
    addFromLocationType: (state) => state.addFromLocationType,
    addFromLocationList: (state) => state.addFromLocationList,
    isStickerDrawerOpen: (state) => state.isStickerDrawerOpen,
    digitalThread: (state) => state.digitalThread,
    digitalThreadList: (state) => state.digitalThreadList,
    tempDigitalThreadList: (state) => state.tempDigitalThreadList,
  },
  mutations: {
    SET_isStickerDrawerOpen(state, isStickerDrawerOpen) {
      state.isStickerDrawerOpen = isStickerDrawerOpen
    },
    SET_currentMaterialId(state, currentMaterialId) {
      state.currentMaterialId = currentMaterialId
    },
    SET_digitalThread(state, digitalThread) {
      state.digitalThread = digitalThread
    },
    UPDATE_digitalThread(state, digitalThread) {
      Object.assign(state.digitalThread, digitalThread)
    },
    UNSHIFT_tempDigitalThreadList(state, digitalThreadBase) {
      state.tempDigitalThreadList.unshift(digitalThreadBase)
    },
    RESET_tempDigitalThreadList(state) {
      state.tempDigitalThreadList.length = 0
    },
    SET_digitalThreadList(state, digitalThreadList) {
      state.digitalThreadList = digitalThreadList
    },
    SET_addFrom(state, { addFromLocationType, addFromLocationList }) {
      state.addFromLocationList = addFromLocationList
      state.addFromLocationType = addFromLocationType
    },
  },
  actions: {
    openStickerDrawer(
      { commit },
      { materialId, addFromLocationType, addFromLocationList }
    ) {
      commit('SET_isStickerDrawerOpen', true)
      commit('SET_currentMaterialId', materialId)
      commit('SET_addFrom', { addFromLocationType, addFromLocationList })
    },
    closeStickerDrawer({ commit }) {
      commit('SET_isStickerDrawerOpen', false)
      commit('RESET_tempDigitalThreadList')
    },
    async getDigitalThreadList({ commit, rootGetters, getters }) {
      // const { data } = await stickerApi.getDigitalThreadList({
      //   orgId: rootGetters['organization/orgId'],
      //   materialId: getters.currentMaterialId,
      // })
      // commit('SET_digitalThreadList', data.result.digitalThreadList)
    },
    async getDigitalThread(
      { commit, rootGetters },
      { digitalThreadId, filter }
    ) {
      // const { data } = await stickerApi.getDigitalThread({
      //   orgId: rootGetters['organization/orgId'],
      //   digitalThreadId,
      //   filter,
      // })
      // commit('SET_digitalThread', data.result.digitalThread)
    },
    async getDigitalThreadMaterial({ commit, rootGetters, getters }) {
      const { data } = await stickerApi.getDigitalThreadMaterial({
        orgId: rootGetters['organization/orgId'],
        materialId: getters.currentMaterialId,
      })
      commit('SET_material', data.result.material)
    },
    async fetchStickerDrawerData({ dispatch, getters }) {
      /**
       * 1. call digital-thread/get-material 取得 unit name 與 unit logo 等相關資料
       * 2. call digital-thread/get-list，
       *    如果 list 為空，則在 state.tempDigitalThreadList 推入一個新的，並覆寫道 state.digitalThread
       *    如果 list 不為空，則取第一個 digitalThreadId 並 call digital-thread/get。
       */
      await Promise.all([
        dispatch('getDigitalThreadMaterial'),
        dispatch('getDigitalThreadList'),
      ])

      if (getters.digitalThreadList.length === 0) {
        dispatch('startToCreateDigitalThread')
      } else {
        await dispatch('getDigitalThread', {
          digitalThreadId: getters.digitalThreadList[0].digitalThreadId,
          filter: null,
        })
      }
    },
    startToCreateDigitalThread({ commit }) {
      const digitalThreadBase = defaultDigitalThreadBase()
      commit('UNSHIFT_tempDigitalThreadList', digitalThreadBase)

      const digitalThread = digitalThreadBase
      digitalThread['stickerList'] = []
      commit('SET_digitalThread', digitalThread)
    },
    async getStickerTagList(_, params) {
      const { data } = await stickerApi.getStickerTagList(params)
      return data.result.tagList
    },
    /**
     *
     * @param {object} context
     * @param {object} params
     * @param {string} params.digitalThreadName
     * @param {number} params.addFromOGId
     * @param {number} params.addFromOGType
     * @param {number} params.addTo
     * @param {number} params.type
     * @param {string} params.content
     * @param {string[]} params.tagList
     */
    async createDigitalThread({ state, commit, rootGetters, getters }, params) {
      // const { data } = await stickerApi.createDigitalThread({
      //   orgId: rootGetters['organization/orgId'],
      //   materialId: getters.currentMaterialId,
      //   addFromLocationType: getters.addFromLocationType,
      //   addFromLocationList: getters.addFromLocationList,
      //   ...params,
      // })
      // commit('SET_digitalThread', data.result.digitalThread)
      const digitalThread = {
        digitalThreadId: 0,
        digitalThreadName: params.digitalThreadName,
        isCreatorSide: false, // 檢視該DigitalThread的使用者是否為建立方組織的成員
        materialId: 12234,
        materialNo: 'EP10456',
        materialCoverImg:
          'https://textile-dev.frontier.cool/Resource/MaterialAttachCover/F372827091637_202204231402164329.jpg',
        materialOwnerUnitName: 'FabricPro.Co', // 布片擁有者的單位名稱，檢視角度為布片擁有者時為:布片擁有者的組織(+團隊)名稱，非布片擁有者為:布片擁有者的組織名稱
        materialOwnerUnitLogo:
          'https://textile-dev.frontier.cool/Resource/OrgLogo/202209050034001703.jpeg', // 布片擁有者的單位Logo
        hasMaterialDeleted: false,
        hasMaterialNoAccess: false,
        addFromLocationType: 1, // 從哪個功能新增這個Digital Thread,
        addFromLocationList: ['EP10456'], // 從哪個功能底下的哪個路徑新增這個Digital Thread,
        creatorUnitName: 'FabricPro.Co', //  建立者單位，檢視角度為建立者時為:呈現建立者的組織(+團隊)名稱，非建立者為:呈現建立者的組織名稱
        creatorUnitLogo:
          'https://textile-dev.frontier.cool/Resource/OrgLogo/202209050034001703.jpeg', // 建立者的單位的Logo,
        creatorUnitLabelColor: '#57B4DF',
        creator: 'Mia Yang', // 建立者的使用者名稱，若isCreatorSide為false，則為null值
        creatorAvatar:
          'https://textile-dev.frontier.cool/Resource/UserAvatar/default_user.png', // 建立者的大頭貼，若isCreatorSide為false，則為null值
        createDate: '1662179523',
        stickerStatistics: {
          totalQty: 1,
          internalQty: params.addTo === 2 ? 1 : 0,
          externalQty: params.addTo === 1 ? 1 : 0,
          starredQty: 0,
        },
        tagList: [],
        participantList: [
          {
            name: 'Mia Yang',
            avatar:
              'https://textile-dev.frontier.cool/Resource/UserAvatar/default_user.png',
          },
        ], // { name: '', avatar: '' }
        unreadStickerQty: 0,
      }
      commit('SET_digitalThread', {
        ...digitalThread,
        stickerList: [
          {
            stickerId: 0,
            digitalThreadId: 0,
            addTo: params.addTo,
            type: 1,
            content: params.content,
            tagList: params.tagList,
            isStarred: false,
            creatorUnitName: 'FabricPro.Co',
            creatorUnitLogo:
              'https://textile-dev.frontier.cool/Resource/OrgLogo/202209050034001703.jpeg', // 建立者的單位的Logo,
            creatorUnitLabelColor: '#57B4DF',
            creator: 'Mia Yang', // 建立者的使用者名稱，若isCreatorSide為false，則為null值
            creatorAvatar:
              'https://textile-dev.frontier.cool/Resource/UserAvatar/default_user.png', // 建立者的大頭貼，若isCreatorSide為false，則為null值
            createDate: 1662179523,
            hasNewAddOrUpdate: true,
            hasChildStickerUnread: false,
            childStickerList: [],
          },
        ],
      })
      state.digitalThreadList.push(digitalThread)
    },
    /**
     *
     * @param {object} context
     * @param {object} params
     * @param {number} params.addTo
     * @param {number} params.type
     * @param {string} params.content
     * @param {string[]} params.tagList
     */
    async createSticker({ rootGetters, getters, state }, params) {
      // await stickerApi.createSticker({
      //   orgId: rootGetters['organization/orgId'],
      //   digitalThreadId: getters.digitalThread.digitalThreadId,
      //   ...params,
      // })
      state.digitalThread.stickerStatistics.totalQty++
      params.addTo === 1
        ? state.digitalThread.stickerStatistics.externalQty++
        : state.digitalThread.stickerStatistics.internalQty++
      state.digitalThread.stickerList.unshift({
        stickerId: Date.now(),
        digitalThreadId: 0,
        addTo: params.addTo,
        type: 1,
        content: params.content,
        tagList: params.tagList,
        isStarred: false,
        creatorUnitName: 'FabricPro.Co',
        creatorUnitLogo:
          'https://textile-dev.frontier.cool/Resource/OrgLogo/202209050034001703.jpeg', // 建立者的單位的Logo,
        creatorUnitLabelColor: '#57B4DF',
        creator: 'Mia Yang', // 建立者的使用者名稱，若isCreatorSide為false，則為null值
        creatorAvatar:
          'https://textile-dev.frontier.cool/Resource/UserAvatar/default_user.png', // 建立者的大頭貼，若isCreatorSide為false，則為null值
        createDate: 1662179523,
        hasNewAddOrUpdate: true,
        hasChildStickerUnread: false,
        childStickerList: [],
      })
    },
    updateDigitalThreadName({ rootGetters, getters }, digitalThreadName) {
      stickerApi.updateDigitalThreadName({
        orgId: rootGetters['organization/orgId'],
        digitalThreadId: getters.digitalThread.digitalThreadId,
        digitalThreadName,
      })
    },
  },
}
