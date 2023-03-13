import stickerApi from '@/apis/sticker.js'
import Material from '@/store/reuseModules/material.js'
import { OG_TYPE, ROLE_ID } from '@/utils/constants'
import isEqual from '@frontier/ui-component/src/isEqual.js'
import groupApi from '@/apis/group'

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

const defaultFilter = () => ({
  addTo: 0,
  isStarred: false,
  addedBy: {
    addedByMe: false,
    addedByInternalUnit: false,
    addedByExternalUnit: false,
  },
  createStartDate: '',
  createEndDate: '',
  tagList: [],
})

export default {
  namespaced: true,
  modules: {
    material: Material,
  },
  state: () => ({
    isStickerDrawerOpen: false,
    currentMaterialId: null, //  drawer 顯示的 materialId
    addFromLocationType: null, // drawer 是從哪一個位置的 material 開啟的
    addFromLocationList: null, // drawer 是從哪一個路徑的 material 開啟的
    digitalThread: {
      ...defaultDigitalThreadBase(),
      stickerList: [],
    },
    digitalThreadList: [],
    tempDigitalThreadList: [], // 尚未真的新增到後端時，用於前端操作的 digital thread list,
    indexOfDrawerDigitalThread: 0,
    sourceTagList: [], // 該 unit 下曾經添加過哪些 tag
    mentionMemberList: [], // 可以 mention 的 成員清單
    filter: defaultFilter(),
  }),
  getters: {
    currentMaterialId: (state) => state.currentMaterialId,
    addFromLocationType: (state) => state.addFromLocationType,
    addFromLocationList: (state) => state.addFromLocationList,
    isStickerDrawerOpen: (state) => state.isStickerDrawerOpen,
    digitalThread: (state) => state.digitalThread,
    digitalThreadList: (state) => state.digitalThreadList,
    tempDigitalThreadList: (state) => state.tempDigitalThreadList,
    drawerDigitalThreadList: (state, getters) =>
      getters.tempDigitalThreadList.concat(getters.digitalThreadList),
    indexOfDrawerDigitalThread: (state) => state.indexOfDrawerDigitalThread,
    sourceTagList: (state) => state.sourceTagList,
    mentionMemberList: (state) => state.mentionMemberList,
    filter: (state) => state.filter,
    isFilterDirty: (state) => {
      return !isEqual(
        {
          ...state.filter,
          addTo: null,
        },
        {
          ...defaultFilter(),
          addTo: null,
        }
      )
    },
    isAdvanceFilterDirty: (state) => {
      return !isEqual(
        {
          ...state.filter,
          addTo: null,
          isStarred: null,
        },
        {
          ...defaultFilter(),
          addTo: null,
          isStarred: null,
        }
      )
    },
    isFilterTagListDirty: (state) => state.filter.tagList.length !== 0,
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
    UPDATE_digitalThread_digitalThreadName(state, digitalThreadName) {
      state.digitalThread.digitalThreadName = digitalThreadName
    },
    UNSHIFT_tempDigitalThreadList(state, digitalThreadBase) {
      state.tempDigitalThreadList.unshift(digitalThreadBase)
    },
    RESET_tempDigitalThreadList(state) {
      state.tempDigitalThreadList.length = 0
    },
    REMOVE_ITEM_tempDigitalThreadList(state, index) {
      state.tempDigitalThreadList.splice(index, 1)
    },
    SET_indexOfDrawerDigitalThread(state, index) {
      state.indexOfDrawerDigitalThread = index
    },
    SET_digitalThreadList(state, digitalThreadList) {
      state.digitalThreadList = digitalThreadList
    },
    PUSH_digitalThreadList(state, digitalThread) {
      state.digitalThreadList.push(digitalThread)
    },
    SET_addFrom(state, { addFromLocationType, addFromLocationList }) {
      state.addFromLocationList = addFromLocationList
      state.addFromLocationType = addFromLocationType
    },
    SET_sourceTagList(state, tagList) {
      state.sourceTagList = tagList
    },
    SET_mentionMemberList(state, memberList) {
      state.mentionMemberList = memberList
    },
    SET_filter(state, filter) {
      state.filter = filter
    },
    RESET_filter(state) {
      state.filter = defaultFilter()
    },
    RESET_filter_createDate(state) {
      const { createStartDate, createEndDate } = defaultFilter()
      state.filter.createStartDate = createStartDate
      state.filter.createEndDate = createEndDate
    },
    RESET_filter_addedBy(state) {
      const { addedBy } = defaultFilter()
      state.filter.addedBy = addedBy
    },
    RESET_filter_tagList(state) {
      const { tagList } = defaultFilter()
      state.filter.tagList = tagList
    },
  },
  actions: {
    async openStickerDrawer(
      { commit, dispatch },
      {
        materialId = null,
        digitalThreadId = null,
        addFromLocationType,
        addFromLocationList,
      }
    ) {
      dispatch('helper/openModalLoading', null, { root: true })
      commit('SET_addFrom', { addFromLocationType, addFromLocationList })
      await dispatch('fetchStickerDrawerData', { materialId, digitalThreadId })
      commit('SET_isStickerDrawerOpen', true)
      dispatch('helper/closeModalLoading', null, { root: true })
    },
    closeStickerDrawer({ commit }) {
      commit('SET_isStickerDrawerOpen', false)
      commit('RESET_tempDigitalThreadList')
      commit('RESET_filter')
      commit('SET_currentMaterialId', null)
    },
    async getDigitalThreadList({ commit, rootGetters, getters }) {
      const { data } = await stickerApi.getDigitalThreadList({
        orgId: rootGetters['organization/orgId'],
        materialId: getters.currentMaterialId,
      })
      commit('SET_digitalThreadList', data.result.digitalThreadList)
    },
    async getDigitalThread(
      { commit, rootGetters, getters, dispatch },
      { digitalThreadId, wllGetAdditionalData = true }
    ) {
      const { data } = await stickerApi.getDigitalThread({
        orgId: rootGetters['organization/orgId'],
        digitalThreadId,
        filter: getters.filter,
      })
      commit('SET_digitalThread', data.result.digitalThread)
      // 待 API 調整後，應修改成 digital thread 中的 id & type
      if (wllGetAdditionalData) {
        dispatch('getStickerTagList', {
          addFromOGId: rootGetters['helper/routeLocationId'],
          addFromOGType:
            rootGetters['helper/routeLocation'] === 'org'
              ? OG_TYPE.ORG
              : OG_TYPE.GROUP,
        })
        dispatch('getMentionMemberList', {
          ogId: rootGetters['helper/routeLocationId'],
          ogType:
            rootGetters['helper/routeLocation'] === 'org'
              ? OG_TYPE.ORG
              : OG_TYPE.GROUP,
        })
      }
    },
    async getDigitalThreadMaterial({ commit, rootGetters, getters }) {
      const { data } = await stickerApi.getDigitalThreadMaterial({
        orgId: rootGetters['organization/orgId'],
        materialId: getters.currentMaterialId,
      })
      commit('SET_material', data.result.material)
    },
    async fetchStickerDrawerData(
      { dispatch, getters, commit },
      { materialId = null, digitalThreadId = null }
    ) {
      /**
       * A. materialId 有值，表示從布片開啟 Drawer
       *    1. call getDigitalThreadMaterial 取得 unit name 與 unit logo 等相關資料
       *    2. call getDigitalThreadList，
       *       如果 list 為空，則在 state.tempDigitalThreadList 推入一個新的，並覆寫道 state.digitalThread
       *       如果 list 不為空，則取第一個 digitalThreadId 並 call getDigitalThread。
       *
       * B. digitalThreadId 有值，表示從 Notification 開啟 Drawer
       *    1. 先 getDigitalThread 取得 materialId
       *    2. 再 getDigitalThreadMaterial & getDigitalThreadList 拿其餘資料
       */

      let currentDigitalThreadId = digitalThreadId

      if (materialId) {
        commit('SET_currentMaterialId', materialId)
        await Promise.all([
          dispatch('getDigitalThreadMaterial'),
          dispatch('getDigitalThreadList'),
        ])
        if (getters.digitalThreadList.length === 0) {
          dispatch('startToCreateDigitalThread')
        } else {
          currentDigitalThreadId = getters.digitalThreadList[0].digitalThreadId
          await dispatch('getDigitalThread', {
            digitalThreadId: currentDigitalThreadId,
          })
        }
      } else {
        await dispatch('getDigitalThread', {
          digitalThreadId: currentDigitalThreadId,
        })
        commit('SET_currentMaterialId', getters.digitalThread.materialId)
        await Promise.all([
          dispatch('getDigitalThreadMaterial'),
          dispatch('getDigitalThreadList'),
        ])
      }
      const index = getters.drawerDigitalThreadList.findIndex(
        (digitalThread) =>
          digitalThread.digitalThreadId === currentDigitalThreadId
      )
      commit('SET_indexOfDrawerDigitalThread', index)
    },
    startToCreateDigitalThread({ commit }) {
      const digitalThreadBase = defaultDigitalThreadBase()
      commit('UNSHIFT_tempDigitalThreadList', digitalThreadBase)

      const digitalThread = digitalThreadBase
      digitalThread['stickerList'] = []
      commit('SET_digitalThread', digitalThread)
      commit('SET_indexOfDrawerDigitalThread', 0)
    },
    async getStickerTagList({ commit }, params) {
      const { data } = await stickerApi.getStickerTagList(params)
      commit('SET_sourceTagList', data.result.tagList)
    },
    async getMentionMemberList({ commit, rootGetters }, { ogId, ogType }) {
      const memberList = []
      let originalMemberList

      if (ogType === OG_TYPE.ORG) {
        originalMemberList = rootGetters['organization/memberList']
      } else {
        const { data } = await groupApi.getGroup(ogId)
        originalMemberList = rootGetters['organization/memberList']
          .filter(
            (member) =>
              member.orgRoleId === ROLE_ID.OWNER ||
              member.orgRoleId === ROLE_ID.ADMIN
          )
          .concat(data.result.group.memberList)
      }

      for (const member of originalMemberList) {
        const { userId, displayName, avatar, isPending } = member
        !isPending &&
          memberList.push({
            userId,
            name: displayName,
            avatar,
          })
      }

      commit('SET_mentionMemberList', memberList)
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
      /**
       * 1. 透過 API 新增 DigitalThread
       * 2. 將其從 tempDigitalThreadList 清除
       * 3. 覆寫到 state
       * 3. 將新的 DigitalThread push 至 digitalThreadList 中
       * 4. 找出該其在 drawerDigitalThreadList (由 tempDigitalThreadList 與 digitalThreadList 組合的 List) 的 index
       * 5. 把新的 index 覆寫至 indexOfDrawerDigitalThread 讓 drawer 顯示正確的狀態
       *
       */
      const { data } = await stickerApi.createDigitalThread({
        ...params,
        orgId: rootGetters['organization/orgId'],
        materialId: getters.currentMaterialId,
        addFromLocationType: getters.addFromLocationType,
        addFromLocationList: getters.addFromLocationList,
      })
      commit(
        'REMOVE_ITEM_tempDigitalThreadList',
        getters.indexOfDrawerDigitalThread
      )
      const createdDigitalThread = data.result.digitalThread
      commit('SET_digitalThread', createdDigitalThread)
      commit('PUSH_digitalThreadList', createdDigitalThread)
      const index = getters.drawerDigitalThreadList.findIndex(
        ({ digitalThreadId }) =>
          createdDigitalThread.digitalThreadId === digitalThreadId
      )
      commit('SET_indexOfDrawerDigitalThread', index)

      // 測試用
      // const digitalThread = {
      //   digitalThreadId: 0,
      //   digitalThreadName: params.digitalThreadName,
      //   isCreatorSide: false, // 檢視該DigitalThread的使用者是否為建立方組織的成員
      //   materialId: 12234,
      //   materialNo: 'EP10456',
      //   materialCoverImg:
      //     'https://textile-dev.frontier.cool/Resource/MaterialAttachCover/F372827091637_202204231402164329.jpg',
      //   materialOwnerUnitName: 'FabricPro.Co', // 布片擁有者的單位名稱，檢視角度為布片擁有者時為:布片擁有者的組織(+團隊)名稱，非布片擁有者為:布片擁有者的組織名稱
      //   materialOwnerUnitLogo:
      //     'https://textile-dev.frontier.cool/Resource/OrgLogo/202209050034001703.jpeg', // 布片擁有者的單位Logo
      //   hasMaterialDeleted: false,
      //   hasMaterialNoAccess: false,
      //   addFromLocationType: 1, // 從哪個功能新增這個Digital Thread,
      //   addFromLocationList: ['EP10456'], // 從哪個功能底下的哪個路徑新增這個Digital Thread,
      //   creatorUnitName: 'FabricPro.Co', //  建立者單位，檢視角度為建立者時為:呈現建立者的組織(+團隊)名稱，非建立者為:呈現建立者的組織名稱
      //   creatorUnitLogo:
      //     'https://textile-dev.frontier.cool/Resource/OrgLogo/202209050034001703.jpeg', // 建立者的單位的Logo,
      //   creatorUnitLabelColor: '#57B4DF',
      //   creator: 'Mia Yang', // 建立者的使用者名稱，若isCreatorSide為false，則為null值
      //   creatorAvatar:
      //     'https://textile-dev.frontier.cool/Resource/UserAvatar/default_user.png', // 建立者的大頭貼，若isCreatorSide為false，則為null值
      //   createDate: '1662179523',
      //   stickerStatistics: {
      //     totalQty: 1,
      //     internalQty: params.addTo === 2 ? 1 : 0,
      //     externalQty: params.addTo === 1 ? 1 : 0,
      //     starredQty: 0,
      //   },
      //   tagList: [],
      //   participantList: [
      //     {
      //       name: 'Mia Yang',
      //       avatar:
      //         'https://textile-dev.frontier.cool/Resource/UserAvatar/default_user.png',
      //     },
      //   ], // { name: '', avatar: '' }
      //   unreadStickerQty: 0,
      // }
      // commit('SET_digitalThread', {
      //   ...digitalThread,
      //   stickerList: [
      //     {
      //       stickerId: 0,
      //       digitalThreadId: 0,
      //       addTo: params.addTo,
      //       type: 1,
      //       content: params.content,
      //       tagList: params.tagList,
      //       isStarred: false,
      //       creatorUnitName: 'FabricPro.Co',
      //       creatorUnitLogo:
      //         'https://textile-dev.frontier.cool/Resource/OrgLogo/202209050034001703.jpeg', // 建立者的單位的Logo,
      //       creatorUnitLabelColor: '#57B4DF',
      //       creator: 'Mia Yang', // 建立者的使用者名稱，若isCreatorSide為false，則為null值
      //       creatorAvatar:
      //         'https://textile-dev.frontier.cool/Resource/UserAvatar/default_user.png', // 建立者的大頭貼，若isCreatorSide為false，則為null值
      //       createDate: 1662179523,
      //       hasNewAddOrUpdate: true,
      //       hasChildStickerUnread: false,
      //       childStickerList: [],
      //     },
      //   ],
      // })
      // state.digitalThreadList.push(digitalThread)
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
    async createSticker({ rootGetters, getters, state, dispatch }, params) {
      await stickerApi.createSticker({
        ...params,
        orgId: rootGetters['organization/orgId'],
        digitalThreadId: getters.digitalThread.digitalThreadId,
      })

      // 暫時用
      dispatch('getDigitalThread', {
        digitalThreadId: getters.digitalThread.digitalThreadId,
      })

      // 測試用
      // state.digitalThread.stickerStatistics.totalQty++
      // params.addTo === 1
      //   ? state.digitalThread.stickerStatistics.externalQty++
      //   : state.digitalThread.stickerStatistics.internalQty++
      // state.digitalThread.stickerList.unshift({
      //   stickerId: Date.now(),
      //   digitalThreadId: 0,
      //   addTo: params.addTo,
      //   type: 1,
      //   content: params.content,
      //   tagList: params.tagList,
      //   isStarred: false,
      //   creatorUnitName: 'FabricPro.Co',
      //   creatorUnitLogo:
      //     'https://textile-dev.frontier.cool/Resource/OrgLogo/202209050034001703.jpeg', // 建立者的單位的Logo,
      //   creatorUnitLabelColor: '#57B4DF',
      //   creator: 'Mia Yang', // 建立者的使用者名稱，若isCreatorSide為false，則為null值
      //   creatorAvatar:
      //     'https://textile-dev.frontier.cool/Resource/UserAvatar/default_user.png', // 建立者的大頭貼，若isCreatorSide為false，則為null值
      //   createDate: 1662179523,
      //   hasNewAddOrUpdate: true,
      //   hasChildStickerUnread: false,
      //   childStickerList: [],
      // })
    },
    updateDigitalThreadName(
      { rootGetters, getters, commit },
      { isCreatingDigitalThread = false, digitalThreadName }
    ) {
      commit('UPDATE_digitalThread_digitalThreadName', digitalThreadName)
      !isCreatingDigitalThread &&
        stickerApi.updateDigitalThreadName({
          orgId: rootGetters['organization/orgId'],
          digitalThreadId: getters.digitalThread.digitalThreadId,
          digitalThreadName,
        })
    },
    async createChildSticker(
      { rootGetters, dispatch, getters },
      { stickerId, content }
    ) {
      await stickerApi.createChildSticker({
        orgId: rootGetters['organization/orgId'],
        stickerId,
        content,
      })

      // 暫時用
      dispatch('getDigitalThread', {
        digitalThreadId: getters.digitalThread.digitalThreadId,
      })

      // 測試用
      // const sticker = state.digitalThread.stickerList.find(
      //   (sticker) => sticker.stickerId === stickerId
      // )
      // const order = sticker.childStickerList.length + 1
      // sticker.childStickerList.push({
      //   stickerId,
      //   digitalThreadId: state.digitalThread.digitalThreadId,
      //   content,
      //   tagList: [],
      //   isStarred: false,
      //   addTo: sticker.addTo,
      //   type: sticker.type,
      //   creatorUnitName: sticker.creatorUnitName,
      //   creatorUnitLogo: sticker.creatorUnitLogo,
      //   creatorUnitLabelColor: sticker.creatorUnitLabelColor,
      //   creator: sticker.creator,
      //   creatorAvatar: sticker.creatorAvatar,
      //   createDate: Date.now(),
      //   order,
      // })
    },
    updateStickerTagList(
      { rootGetters, dispatch, getters },
      { stickerId, tagList }
    ) {
      stickerApi.updateStickerTagList({
        orgId: rootGetters['organization/orgId'],
        stickerId,
        tagList,
      })

      // 暫時用
      dispatch('getDigitalThread', {
        digitalThreadId: getters.digitalThread.digitalThreadId,
      })
    },
    starSticker({ rootGetters }, stickerId) {
      stickerApi.starSticker({
        orgId: rootGetters['organization/orgId'],
        stickerId,
      })
    },
    unstarSticker({ rootGetters }, stickerId) {
      stickerApi.unstarSticker({
        orgId: rootGetters['organization/orgId'],
        stickerId,
      })
    },
    readChildSticker({ rootGetters }, stickerId) {
      stickerApi.readChildSticker({
        orgId: rootGetters['organization/orgId'],
        stickerId,
      })
    },
    readDigitalThread({ rootGetters, getters }) {
      stickerApi.readDigitalThread({
        orgId: rootGetters['organization/orgId'],
        digitalThreadId: getters.digitalThread.digitalThreadId,
      })
    },
  },
}
