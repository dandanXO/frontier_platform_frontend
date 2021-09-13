<template lang="pug">
div(v-if="isModalOpen" class="fixed inset-0 z-index:modal w-screen h-screen bg-black-900 bg-opacity-70 flex justify-center items-center")
  div(class="w-screen h-screen" @click="close")
  div(class="absolute bg-black-0 rounded")
    div(class="h-12 pl-8 pr-3 grid grid-flow-col items-center")
      p(v-if="header !== ''" class="text-body1 text-primary") {{header}}
      svg-icon(iconName="close" size="24" class="justify-self-end cursor-pointer text-black-700" @click="close")
    component(:is="component" v-bind="properties")
</template>

<script>
import { toRefs } from 'vue'
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'
import ModalCreateGroup from '@/components/management/ModalCreateGroup.vue'
import ModalInviteToOrg from '@/components/management/ModalInviteToOrg.vue'
import ModalAddToGroup from '@/components/management/ModalAddToGroup.vue'
import ModalCreateMailGroup from '@/components/management/ModalCreateMailGroup.vue'
import ModalCreateOrg from '@/components/lobby/ModalCreateOrg.vue'
import ModalCreateMailOrg from '@/components/lobby/ModalCreateMailOrg.vue'

export default {
  name: 'Modal',
  components: {
    ModalCreateGroup,
    ModalInviteToOrg,
    ModalAddToGroup,
    ModalCreateMailGroup,
    ModalCreateOrg,
    ModalCreateMailOrg
  },
  setup () {
    const store = useStore()
    const isModalOpen = computed(() => store.getters['helper/isModalOpen'])
    const modalComponent = computed(() => store.getters['helper/modalComponent'])
    const { component, header, properties, closeHandler } = toRefs(modalComponent.value)

    const close = async () => {
      if (typeof closeHandler.value === 'function') {
        await closeHandler.value()
      }
      store.dispatch('helper/closeModal')
    }

    return {
      isModalOpen,
      header,
      component,
      properties,
      close
    }
  }
}
</script>
