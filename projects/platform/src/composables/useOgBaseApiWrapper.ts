import type { AxiosRequestConfig } from 'axios'
import useNavigation from '@/composables/useNavigation'
import { computed } from 'vue'
import { useStore } from 'vuex'

type RestArgs<T extends (...args: any[]) => any> = Omit<
  Parameters<T>[0],
  'ogId' | 'ogType' | 'orgId'
>

type OgBaseApiWrapper<T extends (...args: any[]) => any> = (
  args?: RestArgs<T>
) => ReturnType<T>

const useOgBaseApiWrapper = (apiInstance: any) => {
  const store = useStore()
  const orgId = computed(
    () => store.getters['organization/organization'].orgId as number
  )
  const { ogId, ogType } = useNavigation()
  const ogBaseApiWrapper = <T extends (...args: any[]) => any>(
    func: T,
    config: AxiosRequestConfig = {}
  ): OgBaseApiWrapper<T> => {
    return (args?: RestArgs<T>) => {
      return func.bind(apiInstance)(
        {
          orgId: orgId.value,
          ogType: ogType.value,
          ogId: ogId.value,
          ...args,
        },
        config
      )
    }
  }

  return ogBaseApiWrapper
}

export default useOgBaseApiWrapper
