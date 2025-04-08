import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useCurrentUnit from '@/composables/useCurrentUnit'
import useNavigation from '@/composables/useNavigation'
import type { TabItem } from '@frontier/ui-component/src/FTabs/FTabs.vue'
import { type Organization } from '@frontier/platform-web-sdk'
import { FEATURE_FLAG_KEY } from '@/utils/constants'

export default function useWorkspaceCommon() {
  const store = useStore()
  const { t } = useI18n()
  const { ogNodeId } = useCurrentUnit()
  const organization = computed<Organization>(
    () => store.getters['organization/organization']
  )

  const { goToWorkspace, goToShareWithMe, goToMetaFabric } = useNavigation()

  const tabList = computed(() => {
    const list: TabItem[] = [
      {
        name: t('FF0001'),
        id: 'workspace',
        goTo: (query?: string) => goToWorkspace({}, ogNodeId.value, query),
        icon: 'folder',
      },
    ]
    if (
      organization.value.featureFlagList.includes(
        FEATURE_FLAG_KEY.ENABLE_META_FABRIC
      )
    ) {
      list.push({
        name: t('RR0360'),
        id: 'meta-fabric',
        goTo: goToMetaFabric,
        icon: 'folder',
      })
    }
    list.push({
      name: t('RR0010'),
      id: 'share-with-me',
      goTo: goToShareWithMe,
      icon: 'folder',
    })
    return list
  })

  return {
    tabList,
  }
}
