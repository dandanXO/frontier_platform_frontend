import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useCurrentUnit from '@/composables/useCurrentUnit'
import useNavigation from '@/composables/useNavigation'

export default function useWorkspaceCommon() {
  const store = useStore()
  const { t } = useI18n()
  const { ogNodeId } = useCurrentUnit()
  const planType = computed(() => store.getters['polling/planType'])
  const { goToWorkspace, goToShareWithMe, goToMetaFabric } = useNavigation()

  const tabList = computed(() => {
    const list = [
      {
        name: t('FF0001'),
        id: 'workspace',
        goTo: goToWorkspace.bind(null, {}, ogNodeId.value),
      },
    ]
    if (planType.value.DESIGNER) {
      list.push({
        name: t('RR0360'),
        id: 'meta-fabric',
        goTo: goToMetaFabric,
      })
    }
    list.push({
      name: t('RR0010'),
      id: 'share-with-me',
      goTo: goToShareWithMe,
    })
    return list
  })

  return {
    tabList,
  }
}
