import store from '@/store'
import { PERMISSION_MAP } from '@/utils/constants'
export default {
  mounted(
    el: HTMLElement,
    binding: {
      value: {
        FUNC_ID: number
        behavior: 'deleteElement' | 'disabled' | 'displayNone'
      }
    }
  ) {
    const { value: optionObj } = binding

    const roleId = store.getters['organization/orgUser/orgUser'].roleID
    const permissionList = PERMISSION_MAP[roleId]
    if (optionObj.behavior === 'disabled') {
      !permissionList.includes(optionObj.FUNC_ID) &&
        el.setAttribute('disabled', 'true')
    } else if (optionObj.behavior === 'displayNone') {
      if (!permissionList.includes(optionObj.FUNC_ID)) {
        el.style.display = 'none'
      }
    } else {
      !permissionList.includes(optionObj.FUNC_ID) && el.remove()
    }
  },
}
