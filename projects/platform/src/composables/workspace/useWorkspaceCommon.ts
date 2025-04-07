import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useCurrentUnit from '@/composables/useCurrentUnit'
import useNavigation from '@/composables/useNavigation'
import type { TabItem } from '@frontier/ui-component/src/FTabs/FTabs.vue'

export default function useWorkspaceCommon() {
  const store = useStore()
  const { t } = useI18n()
  const { ogNodeId } = useCurrentUnit()
  const planType = computed(() => store.getters['polling/planType'])
  const { goToWorkspace, goToShareWithMe, goToMetaFabric } = useNavigation()

  const tabList = ref<TabItem[]>([
    {
      name: t('FF0001'),
      id: 'workspace',
      goTo: (query?: string) => goToWorkspace({}, ogNodeId.value, query),
      icon: 'folder',
    },
    {
      name: t('RR0360'),
      id: 'meta-fabric',
      goTo: goToMetaFabric,
      icon: 'folder',
    },
    {
      name: t('RR0010'),
      id: 'share-with-me',
      goTo: goToShareWithMe,
      icon: 'folder',
    },
  ])

  return {
    tabList,
  }
}
