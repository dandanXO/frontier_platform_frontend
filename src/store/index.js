import { createStore } from 'vuex'
import user from '@/store/modules/user'
import code from '@/store/modules/code'
import organization from '@/store/modules/organization'

export default createStore({
  actions: {
    handleResponseData ({ dispatch }, { data }) {
      const { success, message, result } = JSON.parse(JSON.stringify(data))

      const moduleList = ['user']

      moduleList.forEach(module => {
        if (Object.prototype.hasOwnProperty.call(result, module)) {
          const capitalizedModule = module.charAt(0).toUpperCase() + module.slice(1)
          dispatch(`${module}/set${capitalizedModule}`, result[module], { root: true })
        }
      })

      if (!success) {
        throw message.content
      }
    }
  },
  modules: {
    code,
    user,
    organization
  }
})
