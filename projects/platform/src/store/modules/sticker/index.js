import stickerApi from '@/apis/sticker.js'
import Material from '@/store/reuseModules/material.js'
import { OG_TYPE, ROLE_ID, LOCATION_TYPE } from '@/utils/constants'
import isEqual from '@frontier/ui-component/src/isEqual.js'
import groupApi from '@/apis/group'
import i18n from '@/utils/i18n'
import { nextTick } from 'vue'

const defaultDigitalThreadBase = () => ({
  digitalThreadSideId: null,
  digitalThreadName: 'Untitled',
  isDigitalThreadNameEdited: false,
  isCreatorSide: false, // 檢視該DigitalThread的使用者是否為建立方組織的成員
  materialId: 0,
  materialNo: '',
  materialCoverImg: '',
  materialOwnerUnitName: '', // 布片擁有者的單位名稱，檢視角度為布片擁有者時為:布片擁有者的組織(+團隊)名稱，非布片擁有者為:布片擁有者的組織名稱
  materialOwnerUnitLogo: '', // 布片擁有者的單位Logo
  materialOwnerUnitLabelColor: '',
  hasMaterialDeleted: false,
  hasMaterialNoAccess: false,
  addFromLocationType: null, // 從哪個功能新增這個Digital Thread,
  addFromLocationList: [], // 從哪個功能底下的哪個路徑新增這個Digital Thread,
  creatorUnitName: '', // 建立者單位，檢視角度為建立者時為:呈現建立者的組織(+團隊)名稱，非建立者為:呈現建立者的組織名稱
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
  participantList: [], // { userId: number, name: string, avatar: string }
  unreadStickerQty: 0,
  sideOGType: 0, // 檢視該DigitalThread的使用者的side的ogType
  sideOGId: 0, // 檢視該DigitalThread的使用者的side的ogType
  isMaterialOwnerSide: false, //檢視該DigitalThread的使用者是否為布片擁有者組織的成員
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
    /**
     * 每一個有輸入內容但尚未送出的 sticker, child sticker 都會有一組 uuid 存放在此陣列，
     * 作為關閉 drawer 時是否要跳出 Modal 提醒 user 依據。
     */
    tempCreatingStickerIdList: [],
    isStickerDrawerOpen: false,
    isFetchingDigitalThread: false,
    isStickerDrawerForLoginOpen: false,
    currentMaterialId: null, // drawer 顯示的 materialId
    drawerOpenFromLocationType: null, // drawer 是從哪一個位置的 material 開啟的
    drawerOpenFromLocationList: null, // drawer 是從哪一個路徑的 material 開啟的
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
    tempCreatingStickerIdList: (state) => state.tempCreatingStickerIdList,
    currentMaterialId: (state) => state.currentMaterialId,
    drawerOpenFromLocationType: (state) => state.drawerOpenFromLocationType,
    drawerOpenFromLocationList: (state) => state.drawerOpenFromLocationList,
    isStickerDrawerOpen: (state) => state.isStickerDrawerOpen,
    isFetchingDigitalThread: (state) => state.isFetchingDigitalThread,
    isStickerDrawerForLoginOpen: (state) => state.isStickerDrawerForLoginOpen,
    digitalThread: (state) => state.digitalThread,
    digitalThreadList: (state) => state.digitalThreadList,
    tempDigitalThreadList: (state) => state.tempDigitalThreadList,
    drawerDigitalThreadList: (state, getters) =>
      getters.tempDigitalThreadList.concat(getters.digitalThreadList),
    indexOfDrawerDigitalThread: (state) => state.indexOfDrawerDigitalThread,
    sourceTagList: (state) => state.sourceTagList,
    mentionMemberList: (state) => state.mentionMemberList,
    filter: (state) => state.filter,
    isFilterDirty: (state) => !isEqual(state.filter, defaultFilter()),
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
  },
  mutations: {
    SET_isStickerDrawerOpen(state, isStickerDrawerOpen) {
      state.isStickerDrawerOpen = isStickerDrawerOpen
    },
    SET_IS_FETCHING_DIGITAL_THREAD(state, isFetchingDigitalThread) {
      state.isFetchingDigitalThread = isFetchingDigitalThread
    },
    SET_isStickerDrawerForLoginOpen(state, isStickerDrawerForLoginOpen) {
      state.isStickerDrawerForLoginOpen = isStickerDrawerForLoginOpen
    },
    SET_currentMaterialId(state, currentMaterialId) {
      state.currentMaterialId = currentMaterialId
    },
    SET_digitalThread(state, digitalThread) {
      state.digitalThread = digitalThread
    },
    UPDATE_digitalThread_digitalThreadName(state, digitalThreadName) {
      state.digitalThread.digitalThreadName = digitalThreadName
      state.digitalThread.isDigitalThreadNameEdited = true
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
    UNSHIFT_digitalThreadList(state, digitalThread) {
      state.digitalThreadList.unshift(digitalThread)
    },
    SET_drawerOpenFrom(
      state,
      { drawerOpenFromLocationType, drawerOpenFromLocationList }
    ) {
      state.drawerOpenFromLocationList = drawerOpenFromLocationList
      state.drawerOpenFromLocationType = drawerOpenFromLocationType
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
    SET_TEMP_CREATE_STICKER_ID_LIST(state, tempCreatingStickerIdList) {
      state.tempCreatingStickerIdList = tempCreatingStickerIdList
    },
  },
  actions: {
    async openStickerDrawer(
      { commit, dispatch, getters },
      {
        materialId = null,
        digitalThreadSideId = null,
        drawerOpenFromLocationType = null,
        drawerOpenFromLocationList = null,
      }
    ) {
      /**
       * A. materialId 有值，表示從布片 (digital thread entrance) 開啟 Drawer
       *    1. call getDigitalThreadMaterial 取得 unit name 與 unit logo 等相關資料
       *    2. call getDigitalThreadList，
       *       如果 list 為空，則在 state.tempDigitalThreadList 推入一個新的，並覆寫道 state.digitalThread
       *       如果 list 不為空，則取第一個 digitalThreadSideId 並 call fetchStickerDrawerData
       *
       * B. digitalThreadSideId 有值，表示從 Notification 開啟 Drawer
       *    1. 先 fetchStickerDrawerData 取得 materialId
       *    2. 再 getDigitalThreadMaterial
       */
      let currentDigitalThreadSideId = digitalThreadSideId

      await dispatch('closeStickerDrawer')
      await nextTick()

      dispatch('helper/openModalLoading', null, { root: true })
      commit('SET_drawerOpenFrom', {
        drawerOpenFromLocationType,
        drawerOpenFromLocationList,
      })

      if (materialId) {
        commit('SET_currentMaterialId', materialId)
        await Promise.all([
          dispatch('getDigitalThreadMaterial'),
          dispatch('getDigitalThreadList'),
        ])
        if (getters.digitalThreadList.length === 0) {
          dispatch('startToCreateDigitalThread')
        } else {
          currentDigitalThreadSideId =
            getters.digitalThreadList[0].digitalThreadSideId
          await dispatch('fetchStickerDrawerData', {
            digitalThreadSideId: currentDigitalThreadSideId,
          })
          const { sideOGId, sideOGType } = getters.digitalThread
          await dispatch('getMentionMemberList', {
            ogId: sideOGId,
            ogType: sideOGType,
          })
        }
      } else {
        await dispatch('fetchStickerDrawerData', {
          digitalThreadSideId: currentDigitalThreadSideId,
        })
        await dispatch('getDigitalThreadMaterial')
        const { sideOGId, sideOGType } = getters.digitalThread
        await dispatch('getMentionMemberList', {
          ogId: sideOGId,
          ogType: sideOGType,
        })
      }

      const index = getters.drawerDigitalThreadList.findIndex(
        (digitalThread) =>
          digitalThread.digitalThreadSideId === currentDigitalThreadSideId
      )
      commit('SET_indexOfDrawerDigitalThread', index)
      commit('SET_isStickerDrawerOpen', true)
      dispatch('helper/closeModalLoading', null, { root: true })
    },
    openStickerDrawerForLogin(
      { commit },
      { material, drawerOpenFromLocationType, drawerOpenFromLocationList }
    ) {
      commit('SET_drawerOpenFrom', {
        drawerOpenFromLocationType,
        drawerOpenFromLocationList,
      })
      commit('SET_material', material)
      commit('SET_isStickerDrawerForLoginOpen', true)
    },
    closeStickerDrawerForLogin({ commit, dispatch }) {
      commit('SET_isStickerDrawerForLoginOpen', false)
      dispatch('resetState')
    },
    resetState({ commit }) {
      commit('RESET_tempDigitalThreadList')
      commit('RESET_filter')
      commit('SET_currentMaterialId', null)
    },
    async closeStickerDrawer({ commit, getters, dispatch }) {
      if (!getters.isStickerDrawerOpen) {
        return
      }

      await new Promise((resolve, reject) => {
        const resolveHandler = () => {
          dispatch('resetState')
          commit('SET_isStickerDrawerOpen', false)
          resolve('confirm')
          return
        }

        const tempDigitalThreadList = getters.tempDigitalThreadList
        const tempCreatingStickerIdList = getters.tempCreatingStickerIdList

        let header, contentText
        if (tempCreatingStickerIdList.length) {
          header = i18n.global.t('TT0090')
          contentText = i18n.global.t('TT0091')
        } else if (
          tempDigitalThreadList.some(
            (thread) => thread.isDigitalThreadNameEdited
          )
        ) {
          header = i18n.global.t('TT0088')
          contentText = i18n.global.t('TT0089')
        } else {
          return resolveHandler()
        }

        dispatch(
          'helper/openModalConfirm',
          {
            type: 1,
            header,
            contentText,
            primaryBtnText: i18n.global.t('UU0128'),
            primaryBtnHandler: resolveHandler,
            secondaryBtnText: i18n.global.t('UU0002'),
            secondaryBtnHandler: reject,
          },
          { root: true }
        )
      })
    },
    async getDigitalThreadMaterial({ commit, rootGetters, getters }) {
      const { data } = await stickerApi.getDigitalThreadMaterial({
        orgId: rootGetters['organization/orgId'],
        materialId: getters.currentMaterialId,
      })
      commit('SET_material', data.result.material)
    },
    async getDigitalThreadList({ commit, rootGetters, getters }) {
      let ogType =
        rootGetters['helper/routeLocation'] === 'org'
          ? OG_TYPE.ORG
          : OG_TYPE.GROUP
      let ogId = rootGetters['helper/routeLocationId']

      // 透過 Notification 或是由 Public 頁面開啟的 drawer 將會拉取全部的資料 (org & group)
      if (
        [LOCATION_TYPE.PUBLIC, LOCATION_TYPE.NOTIFICATION].includes(
          getters.drawerOpenFromLocationType
        )
      ) {
        ogType = null
        ogId = null
      }

      const { data } = await stickerApi.getDigitalThreadList({
        orgId: rootGetters['organization/orgId'],
        materialId: getters.currentMaterialId,
        ogType,
        ogId,
      })
      commit('SET_digitalThreadList', data.result.digitalThreadList)
    },
    async getDigitalThread(
      { commit, rootGetters, getters },
      { digitalThreadSideId }
    ) {
      const { data } = await stickerApi.getDigitalThread({
        orgId: rootGetters['organization/orgId'],
        digitalThreadSideId,
        filter: getters.filter,
      })
      commit('SET_digitalThread', data.result.digitalThread)
      commit('SET_currentMaterialId', getters.digitalThread.materialId)
    },
    async fetchStickerDrawerData(
      { dispatch, getters, commit },
      { digitalThreadSideId = null, showLoading = false } = {}
    ) {
      showLoading && commit('SET_IS_FETCHING_DIGITAL_THREAD', true)

      await dispatch('getDigitalThread', {
        digitalThreadSideId: digitalThreadSideId
          ? digitalThreadSideId
          : getters.digitalThread.digitalThreadSideId,
      })
      const { sideOGType, sideOGId } = getters.digitalThread
      await Promise.all([
        dispatch('getDigitalThreadList'),
        dispatch('getStickerTagList', {
          ogId: sideOGId,
          ogType: sideOGType,
        }),
      ])

      showLoading && commit('SET_IS_FETCHING_DIGITAL_THREAD', false)
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
    async createDigitalThread({ commit, rootGetters, getters }, params) {
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
        addFromLocationType: getters.drawerOpenFromLocationType,
        addFromLocationList: getters.drawerOpenFromLocationList,
      })
      commit(
        'REMOVE_ITEM_tempDigitalThreadList',
        getters.indexOfDrawerDigitalThread
      )
      const createdDigitalThread = data.result.digitalThread
      commit('SET_digitalThread', createdDigitalThread)
      commit('UNSHIFT_digitalThreadList', createdDigitalThread)
      const index = getters.drawerDigitalThreadList.findIndex(
        ({ digitalThreadSideId }) =>
          createdDigitalThread.digitalThreadSideId === digitalThreadSideId
      )
      commit('SET_indexOfDrawerDigitalThread', index)
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
    async createSticker({ rootGetters, getters, commit, dispatch }, params) {
      const { data } = await stickerApi.createSticker({
        ...params,
        orgId: rootGetters['organization/orgId'],
        digitalThreadSideId: getters.digitalThread.digitalThreadSideId,
      })
      commit('SET_digitalThread', data.result.digitalThread)
      dispatch('fetchStickerDrawerData')
    },
    async updateDigitalThreadName(
      { rootGetters, getters, commit, dispatch },
      { isCreatingDigitalThread = false, digitalThreadName }
    ) {
      commit('UPDATE_digitalThread_digitalThreadName', digitalThreadName)
      if (!isCreatingDigitalThread) {
        await stickerApi.updateDigitalThreadName({
          orgId: rootGetters['organization/orgId'],
          digitalThreadSideId: getters.digitalThread.digitalThreadSideId,
          digitalThreadName,
        })
        dispatch('helper/pushFlashMessage', i18n.global.t('TT0122'), {
          root: true,
        })
        await dispatch('getDigitalThreadList')
      }
    },
    async createChildSticker(
      { rootGetters, getters, commit, dispatch },
      { stickerId, content, tagList }
    ) {
      const { data } = await stickerApi.createChildSticker({
        orgId: rootGetters['organization/orgId'],
        digitalThreadSideId: getters.digitalThread.digitalThreadSideId,
        stickerId,
        content,
        tagList,
      })
      commit('SET_digitalThread', data.result.digitalThread)
      dispatch('fetchStickerDrawerData')
    },
    async updateStickerTagList(
      { rootGetters, dispatch, getters },
      { stickerId, tagList }
    ) {
      await stickerApi.updateStickerTagList({
        orgId: rootGetters['organization/orgId'],
        digitalThreadSideId: getters.digitalThread.digitalThreadSideId,
        stickerId,
        tagList,
      })
      dispatch('fetchStickerDrawerData')
    },
    async starSticker({ rootGetters, getters, dispatch }, stickerId) {
      await stickerApi.starSticker({
        orgId: rootGetters['organization/orgId'],
        digitalThreadSideId: getters.digitalThread.digitalThreadSideId,
        stickerId,
      })

      dispatch('fetchStickerDrawerData')
    },
    async unstarSticker({ rootGetters, getters, dispatch }, stickerId) {
      await stickerApi.unstarSticker({
        orgId: rootGetters['organization/orgId'],
        digitalThreadSideId: getters.digitalThread.digitalThreadSideId,
        stickerId,
      })
      await dispatch('fetchStickerDrawerData')
    },
    async readChildSticker({ rootGetters, getters, dispatch }, stickerId) {
      await stickerApi.readChildSticker({
        orgId: rootGetters['organization/orgId'],
        digitalThreadSideId: getters.digitalThread.digitalThreadSideId,
        stickerId,
      })
      dispatch('fetchStickerDrawerData')
    },
    addTempCreateStickerId({ getters, commit }, tempCreatingStickerId) {
      const tempCreatingStickerIdList = getters.tempCreatingStickerIdList
      if (tempCreatingStickerIdList.includes(tempCreatingStickerId)) return
      commit('SET_TEMP_CREATE_STICKER_ID_LIST', [
        ...tempCreatingStickerIdList,
        tempCreatingStickerId,
      ])
    },
    removeTempCreateStickerId({ getters, commit }, tempCreatingStickerId) {
      const tempCreatingStickerIdList = getters.tempCreatingStickerIdList
      commit(
        'SET_TEMP_CREATE_STICKER_ID_LIST',
        tempCreatingStickerIdList.filter((id) => id !== tempCreatingStickerId)
      )
    },
  },
}
