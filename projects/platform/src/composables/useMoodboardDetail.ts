import { watch, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { MOODBOARD_TAB, MOODBOARD_OFFER_ID_ALL } from '@/utils/constants'
import type { MoodboardNodeCollection } from '@frontier/platform-web-sdk'
import useNavigation from '@/composables/useNavigation'
import { useMoodboardStore } from '@/stores/moodboard'

export default function useMoodboardDetail(
  moodboardId: number,
  defaultOfferId: number,
  defaultNodeId: number | null
) {
  const route = useRoute()
  const { ogBaseMoodboardApi } = useMoodboardStore()
  const { goToMoodboardDetail } = useNavigation()

  const currentTab = computed<MOODBOARD_TAB>(
    () => (route.params.tab as MOODBOARD_TAB) || MOODBOARD_TAB.OFFER
  )
  const currentOfferId = computed(
    () => Number(route.query.offerId) || defaultOfferId
  )
  const currentNodeId = computed(
    () => Number(route.query.nodeId) || defaultNodeId
  )

  const selectedNodeList = ref<MoodboardNodeCollection['childNodeList']>([])
  const moodboardNodeCollection = ref<MoodboardNodeCollection>()

  const keyword = ref<string | null>(null)

  const switchOffer = (offerId: number, nodeId: number | null) => {
    keyword.value = null
    goToMoodboardDetail({}, moodboardId, MOODBOARD_TAB.OFFER, {
      offerId,
      nodeId,
    })
  }

  const switchTab = (tab: MOODBOARD_TAB) => {
    keyword.value = null
    goToMoodboardDetail({}, moodboardId, tab, {
      offerId: currentOfferId.value,
      nodeId: currentNodeId.value,
    })
  }

  const goTo = (nodeId: number | null) => {
    keyword.value = null
    goToMoodboardDetail({}, moodboardId, currentTab.value, {
      offerId: currentOfferId.value,
      nodeId,
    })
  }

  const isLoading = ref(false)
  const search = async () => {
    isLoading.value = true

    const getMoodboardOfferPickedList = async () => {
      const { data } = await ogBaseMoodboardApi('getMoodboardOfferPickedList', {
        moodboardId,
        offerId:
          currentOfferId.value === MOODBOARD_OFFER_ID_ALL
            ? null
            : currentOfferId.value,
        keyword: keyword.value,
      })
      moodboardNodeCollection.value = data.result.moodboardNodeCollection
    }

    if (route.name === 'MoodboardPickedList') {
      await getMoodboardOfferPickedList()
    } else if (route.name === 'MoodboardDetail') {
      if (currentTab.value === MOODBOARD_TAB.OFFER) {
        const { data } = await ogBaseMoodboardApi(
          'getMoodboardOfferNodeCollection',
          {
            moodboardId,
            nodeId:
              currentOfferId.value === MOODBOARD_OFFER_ID_ALL
                ? null
                : currentNodeId.value,
            keyword: keyword.value,
          }
        )
        moodboardNodeCollection.value = data.result.moodboardNodeCollection
      } else if (currentTab.value === MOODBOARD_TAB.PICKED) {
        await getMoodboardOfferPickedList()
      }
    }

    isLoading.value = false
  }

  const selectAll = () => {
    if (!moodboardNodeCollection.value) {
      return
    }

    const stringifyNodeList = moodboardNodeCollection.value.childNodeList.map(
      (node) => JSON.stringify(node)
    )
    const stringifySelectedNodeList = selectedNodeList.value.map((node) =>
      JSON.stringify(node)
    )
    selectedNodeList.value = [
      ...new Set(stringifySelectedNodeList.concat(stringifyNodeList)),
    ].map((node) => JSON.parse(node))
  }

  watch(
    () => currentTab.value,
    () => {
      selectedNodeList.value.length = 0
      search()
    }
  )

  watch(
    [() => currentOfferId.value, () => currentNodeId.value],
    () => {
      search()
    },
    {
      immediate: true,
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
    search,
    moodboardNodeCollection,
    selectedNodeList,
    selectAll,
  }
}
