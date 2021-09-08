<template lang="pug">
div(v-if="isModalOpen" class="fixed inset-0 z-index:modal  w-screen h-screen bg-black-900 bg-opacity-70 flex justify-center items-center" @click="closeModal")
  div(class="bg-black-0 rounded overflow-hidden" @click.stop)
    div(class="h-12 pl-8 pr-3 grid grid-flow-col items-center")
      p(v-if="header !== ''" class="text-body1 text-primary") {{header}}
      svg-icon(iconName="close" size="24" class="justify-self-end cursor-pointer text-black-700" @click="closeModal")
    component(:is="component" v-bind="properties")
</template>

<script>
import { toRefs } from 'vue'
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'
import ModalCreateGroup from '@/components/management/ModalCreateGroup.vue'
import ModalInviteToOrg from '@/components/management/ModalInviteToOrg.vue'
import ModalAddToGroup from '@/components/management/ModalAddToGroup.vue'

export default {
  name: 'Modal',
  components: {
    ModalCreateGroup,
    ModalInviteToOrg,
    ModalAddToGroup
  },
  setup () {
    const store = useStore()
    const isModalOpen = computed(() => store.getters['helper/isModalOpen'])
    const modalComponent = computed(() => store.getters['helper/modalComponent'])
    const { component, header, properties } = toRefs(modalComponent.value)

    const closeModal = () => store.dispatch('helper/closeModal')

    return {
      isModalOpen,
      header,
      component,
      properties,
      closeModal
    }
  }
}
</script>
