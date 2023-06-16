import { computed, unref } from 'vue'
import { LOCATION_TYPE } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import type { Ref } from 'vue'
import { type DigitalThread, FeatureType } from '@frontier/platform-web-sdk'

const useAddFromDisplayList = (
  digitalThread: Ref<DigitalThread> | DigitalThread
) => {
  const { t } = useI18n()
  const addFromLocationList = computed(() => {
    const list = [...unref(digitalThread).addFromLocationList]

    switch (unref(digitalThread).addFromLocationType) {
      case FeatureType.PUBLIC_LIBRARY:
      case FeatureType.SHOWROOM:
        list.unshift(t('RR0003'))
        break
      case FeatureType.ASSET:
        list.unshift(t('RR0008'))
        break
      case FeatureType.WORKSPACE:
        list.unshift(t('RR0009'))
        break
      case FeatureType.MOODBOARD:
        list.unshift(t('QQ0001'))
        break
      case FeatureType.SHARED_WITH_ME:
        list.unshift(t('RR0010'))
        break
      case FeatureType.RECEIVED_SHARE:
        list.unshift(t('RR0259'))
        break
      case FeatureType.EMBED:
        list.unshift(t('RR0261'))
        break
      case FeatureType.THREAD_BOARD:
        list.unshift(t('TT0132'))
        break
    }

    return list
  })

  return addFromLocationList
}

export default useAddFromDisplayList
