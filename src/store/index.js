import { createStore } from 'vuex'
import user from '@/store/modules/user'
import code from '@/store/modules/code'
import organization from '@/store/modules/organization'

export default createStore({
  actions: {
  },
  modules: {
    code,
    user,
    organization
  }
})
