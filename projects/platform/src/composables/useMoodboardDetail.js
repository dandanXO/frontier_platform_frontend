import { watch, ref, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useStore } from "vuex"
import { MOODBOARD_TAB } from '@/utils/constants.js'

export default function useMoodboardDetail ({ defaultOfferId, defaultNodeId, selectedNodeList }) {
  const route = useRoute()
  const router = useRouter()
  const store = useStore()

  const currentTab = computed(() => route.query.tab || MOODBOARD_TAB.OFFER)
  const currentOfferId = computed(() => Number(route.query.offerId) || defaultOfferId)
  const currentNodeId = computed(() => Number(route.query.nodeId) || defaultNodeId)

  const moodboardOfferNodeCollection = computed(() => store.getters['moodboard/moodboardOfferNodeCollection'])

  const moodboard = computed(() => store.getters['moodboard/moodboard'])
  const keyword = ref('')

  const switchOffer = (offerId, nodeId) => {
    keyword.value = ''
    const query = offerId === 'all'
      ? { tab: MOODBOARD_TAB.OFFER, offerId: 'all', nodeId: null }
      : { tab: MOODBOARD_TAB.OFFER, offerId, nodeId }
    router.push({ name: route.name, query })
  }

  const switchTab = (tab) => {
    keyword.value = ''
    router.push({ name: route.name, query: { tab: tab.path, offerId: currentOfferId.value, nodeId: moodboardOfferNodeCollection.value.locationList[0].nodeId } })
  }

  const goTo = (nodeId) => {
    keyword.value = ''
    router.push({ name: route.name, query: { tab: currentTab.value, offerId: currentOfferId.value, nodeId } })
  }

  const isLoading = ref(false)
  const search = async () => {
    isLoading.value = true
    const moodboardId = moodboard.value.moodboardId
    const offerId = currentOfferId.value
    if (currentTab.value === MOODBOARD_TAB.OFFER) {
      await store.dispatch('moodboard/getMoodboardNodeCollection', {
        moodboardId,
        nodeId: currentNodeId.value,
        keyword: keyword.value || null
      })
    } else if (currentTab.value === MOODBOARD_TAB.PICKED) {
      await store.dispatch('moodboard/getPickedMoodboardNode', {
        moodboardId,
        offerId,
        keyword: keyword.value || null
      })
    } else if (currentTab.value === MOODBOARD_TAB.COMMENT) {
      await store.dispatch('moodboard/getMoodboardComment', {
        moodboardId,
        offerId
      })
    }
    isLoading.value = false
  }

  watch(
    () => currentTab.value,
    () => {
      selectedNodeList.value.length = 0
      if (route.name === 'OrgMoodboardDetail' || route.name === 'GroupMoodboardDetail') {
        search()
      }
    }
  )

  watch(
    [() => currentOfferId.value, () => currentNodeId.value],
    () => {
      if (route.name === 'OrgMoodboardDetail' || route.name === 'GroupMoodboardDetail') {
        search()
      }
    },
    {
      immediate: true
    }
  )

  return {
    keyword,
    currentTab,
    currentOfferId,
    currentNodeId,
    isLoading,
    switchOffer,
    switchTab,
    goTo,
    search
  }
}
