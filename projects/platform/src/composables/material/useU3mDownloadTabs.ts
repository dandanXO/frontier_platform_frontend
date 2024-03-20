import { U3M_DOWNLOAD_PROP, U3M_PROVIDER, U3M_STATUS } from '@/utils/constants'
import type { Material } from '@frontier/platform-web-sdk'
import type { FTabs } from '@frontier/ui-component'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const useU3mDownloadTabs = () => {
  const { t } = useI18n()

  const refTab = ref<InstanceType<typeof FTabs>>()
  const tabList = ref([
    {
      id: U3M_PROVIDER.FRONTIER,
      name: t('EE0174'),
    },
    {
      id: U3M_PROVIDER.CUSTOMER,
      name: t('EE0175'),
    },
  ])
  const currentTab = computed<U3M_PROVIDER>(
    () => refTab.value?.currentTab || tabList.value[0].id
  )

  const defaultTab = (material: Material) => {
    if (material.u3m.status === U3M_STATUS.COMPLETED) {
      return U3M_PROVIDER.FRONTIER
    }

    if (material.customU3m.status === U3M_STATUS.COMPLETED) {
      return U3M_PROVIDER.CUSTOMER
    }

    return U3M_PROVIDER.FRONTIER
  }

  const u3mDownloadOptionList = computed(() => [
    {
      title: t('UU0005'),
      format: U3M_DOWNLOAD_PROP.U3M,
      tooltipMessage: t('MI0134'),
    },
    {
      title: t('UU0058'),
      format: U3M_DOWNLOAD_PROP.U3MA,
      tooltipMessage: t('MI0134'),
    },
    {
      title: t('UU0129'),
      format: U3M_DOWNLOAD_PROP.GLTF,
      tooltipMessage: t('MI0135'),
    },
  ])

  return {
    refTab,
    tabList,
    currentTab,
    defaultTab,
    u3mDownloadOptionList,
  }
}

export default useU3mDownloadTabs
