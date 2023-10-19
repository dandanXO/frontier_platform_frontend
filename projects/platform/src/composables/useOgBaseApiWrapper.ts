import useCurrentUnit from '@/composables/useCurrentUnit'

type RestArgs<T extends (...args: any[]) => any> = Omit<
  Parameters<T>[0],
  'ogId' | 'ogType' | 'orgId'
>

type OgBaseApiWrapper<T extends (...args: any[]) => any> = (
  args?: RestArgs<T>
) => ReturnType<T>

const useOgBaseApiWrapper = (apiInstance: any) => {
  const { unit } = useCurrentUnit()
  const ogBaseApiWrapper = <T extends (...args: any[]) => any>(
    func: T
  ): OgBaseApiWrapper<T> => {
    return (args?: RestArgs<T>) => {
      return func.bind(apiInstance)({
        orgId: unit.value.orgId,
        ogType: unit.value.ogType,
        ogId: unit.value.ogId,
        ...args,
      })
    }
  }

  return ogBaseApiWrapper
}

export default useOgBaseApiWrapper
