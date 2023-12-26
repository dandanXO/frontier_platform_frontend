import { defineStore } from 'pinia'
import { ref } from 'vue'
import moodboardApi from '@/apis/moodboard'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import type { Moodboard, ShareTarget } from '@frontier/platform-web-sdk'

export const useMoodboardStore = defineStore('moodboard', () => {
  const ogBaseMoodboardApi = useOgBaseApiWrapper(moodboardApi)

  const moodboard = ref<Moodboard>()

  const getMoodboard = async (moodboardId: number) => {
    const { data } = await ogBaseMoodboardApi('getMoodboard', {
      moodboardId,
    })
    moodboard.value = data.result.moodboard
    return data.result.moodboard
  }

  const addMoodboardShare = async (
    moodboardId: number,
    targetList: ShareTarget[],
    message: string
  ) => {
    const { data } = await ogBaseMoodboardApi('addMoodboardShare', {
      moodboardId,
      targetList,
      message,
    })

    moodboard.value = data.result.moodboard
  }

  const removeMoodboardShare = async (shareId: number) => {
    const { data } = await ogBaseMoodboardApi('removeMoodboardShare', {
      shareId,
    })
    moodboard.value = data.result.moodboard
  }

  return {
    ogBaseMoodboardApi,
    getMoodboard,
    moodboard,
    addMoodboardShare,
    removeMoodboardShare,
  }
})
