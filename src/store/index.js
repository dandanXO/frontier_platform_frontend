import { createStore } from 'vuex'
import user from '@/store/modules/user'
import code from '@/store/modules/code'
import organization from '@/store/modules/organization'
import group from '@/store/modules/group'
import material from '@/store/modules/material'
import helper from '@/store/modules/helper'
import assets from '@/store/modules/assets'
import workspace from '@/store/modules/workspace'

export default createStore({
  actions: {
    handleResponseData ({ dispatch }, { data }) {
      const { success, message, result } = JSON.parse(JSON.stringify(data))

      const namespacedParentModuleList = ['user', 'organization', 'code', 'group', 'material', 'assets']

      if (result !== null) {
        namespacedParentModuleList.forEach(module => {
          if (Object.prototype.hasOwnProperty.call(result, module)) {
            const capitalizedModule = module.charAt(0).toUpperCase() + module.slice(1)
            dispatch(`${module}/set${capitalizedModule}`, result[module], { root: true })
          }
        })

        if (Object.prototype.hasOwnProperty.call(result, 'orgUser')) {
          dispatch('user/orgUser/setOrgUser', result.orgUser, { root: true })
        }

        if (Object.prototype.hasOwnProperty.call(result, 'pagination')) {
          dispatch('helper/search/setPagination', result.pagination, { root: true })
        }

        if (Object.prototype.hasOwnProperty.call(result, 'workspaceCollection')) {
          dispatch('workspace/setWorkspace', result.workspaceCollection, { root: true })
        }
      }

      if (!success) {
        throw message.content
      }
    }
  },
  modules: {
    code,
    user,
    organization,
    group,
    helper,
    material,
    assets,
    workspace
  }
})
