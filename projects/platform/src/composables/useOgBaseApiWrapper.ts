import type { AxiosRequestConfig } from 'axios'
import useNavigation from '@/composables/useNavigation'
import { computed } from 'vue'
import { useStore } from 'vuex'

type RestArgs<T extends (...args: any[]) => any> = Omit<
  Parameters<T>[0],
  'ogId' | 'ogType' | 'orgId'
>

const useOgBaseApiWrapper = <Class extends Record<string, any>>(
  apiInstance: Class
) => {
  const store = useStore()
  const orgId = computed(
    () => store.getters['organization/organization'].orgId as number
  )
  const { ogId, ogType } = useNavigation()
  const ogBaseApiWrapper = <FunctionName extends keyof Class>(
    func: FunctionName,
    args?: RestArgs<Class[FunctionName]>,
    config: AxiosRequestConfig = {}
  ) => {
    return apiInstance[func](
      {
        orgId: orgId.value,
        ogType: ogType.value,
        ogId: ogId.value,
        ...args,
      },
      config
    ) as ReturnType<Class[FunctionName]>
  }

  return ogBaseApiWrapper
}

export default useOgBaseApiWrapper
