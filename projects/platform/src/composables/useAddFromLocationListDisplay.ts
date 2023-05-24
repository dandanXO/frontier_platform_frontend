import { computed, unref } from 'vue'
import { LOCATION_TYPE } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import type { Ref } from 'vue'
import type { DigitalThread } from '@frontier/platform-web-sdk'

const useAddFromDisplayList = (
  digitalThread: Ref<DigitalThread> | DigitalThread
) => {
  const { t } = useI18n()
  const addFromLocationList = computed(() => {
    const list = [...unref(digitalThread).addFromLocationList]

    switch (unref(digitalThread).addFromLocationType) {
      case LOCATION_TYPE.PUBLIC:
      case LOCATION_TYPE.SHOWROOM:
        list.unshift(t('RR0003'))
        break
      case LOCATION_TYPE.ASSETS:
        list.unshift(t('RR0008'))
        break
      case LOCATION_TYPE.WORKSPACE:
        list.unshift(t('RR0009'))
        break
      case LOCATION_TYPE.MOODBOARD:
        list.unshift(t('QQ0001'))
        break
      case LOCATION_TYPE.SHARE_TO_ME:
        list.unshift(t('RR0010'))
        break
      case LOCATION_TYPE.RECEIVED_SHARE:
        list.unshift(t('RR0259'))
        break
      case LOCATION_TYPE.EMBED:
        list.unshift(t('RR0261'))
        break
    }

    return list
  })

  return addFromLocationList
}

export default useAddFromDisplayList
