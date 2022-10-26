import store from '@/store'
import { PERMISSION_MAP } from '@/utils/constants.js'

export default {
  mounted(el, binding) {
    const { value: funcId } = binding
    const roleId = store.getters['organization/orgUser/orgUser'].orgRoleId
    const permissionList = PERMISSION_MAP[roleId]
    !permissionList.includes(funcId) && el.remove()
  },
}
