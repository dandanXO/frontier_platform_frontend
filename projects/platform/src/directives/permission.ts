import store from '@/store'
import { PERMISSION_MAP } from '@/utils/constants'
export default {
  mounted(
    el: HTMLElement,
    binding: {
      value: { FUNC_ID: number; behavior: 'deleteElement' | 'disabled' }
    }
  ) {
    const { value: optionObj } = binding

    const roleId = store.getters['organization/orgUser/orgUser'].roleID
    const permissionList = PERMISSION_MAP[roleId]
    !permissionList.includes(optionObj.FUNC_ID) && el.remove()
  },
}
