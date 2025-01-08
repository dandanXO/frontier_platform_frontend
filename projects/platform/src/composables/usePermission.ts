import store from '@/store'
import { PERMISSION_MAP } from '@/utils/constants'
import { computed } from 'vue'

const usePermission = () => {
  const roleId = computed(
    () => store.getters['organization/orgUser/orgUser'].roleID as number
  )
  const permissionList = computed(() => PERMISSION_MAP[roleId.value])

  return permissionList
}

export default usePermission
