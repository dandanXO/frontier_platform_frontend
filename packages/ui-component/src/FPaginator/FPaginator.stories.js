import FPaginator from './FPaginator.vue'
import { ref } from 'vue'

export default {
  title: 'FPaginator',
  component: FPaginator,
  args: {
    totalPage: 10,
  },
}

export const Default = (args) => ({
  components: { FPaginator },
  setup() {
    const currentPage = ref(1)
    return { args, currentPage }
  },
  template: `
    <f-paginator v-bind="args" v-model:currentPage="currentPage"></f-paginator>
  `,
})
