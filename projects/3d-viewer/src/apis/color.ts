import axios from './index'
import type { PantoneItem } from '@/composables/useColors'

export default {
  getPantoneColor: () =>
    axios.get<{
      result: {
        code: {
          pantoneList: PantoneItem[]
        }
      }
    }>('/code/pantone'),
}
