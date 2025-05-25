import { FUNC_ID, PERMISSION_MAP } from '@/utils/constants'
import { computed } from 'vue'
import { useStore } from 'vuex'

const useUser = () => {
  const store = useStore()

  const roleId = computed(
    () => store.getters['organization/orgUser/orgUser'].roleID
  )
  const permissionList = PERMISSION_MAP[roleId.value]
  const isInternalUser = permissionList.includes(FUNC_ID.ASSET_VIEW_INTTERNAL)

  return {
    isInternalUser,
  }
}

export default useUser
