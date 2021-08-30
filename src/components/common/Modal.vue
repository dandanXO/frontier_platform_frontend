<template lang="pug">
div
  slot(name="activator" :open="open")
  teleport(to="#app")
    div(v-if="isModalOpen" class="fixed inset-0  z-index:modal  w-screen h-screen bg-black-900 bg-opacity-70 flex justify-center items-center" @click="close")
      div(class="bg-black-0 rounded" @click.stop)
        div(class="h-12 pl-8 pr-3 grid grid-flow-col items-center")
          p(v-if="header !== ''" class="text-body1 text-primary") {{header}}
          svg-icon(iconName="close" size="24" class="justify-self-end cursor-pointer text-black-700" @click="close")
        div(class="px-8 flex flex-col items-center")
          slot
        div(class="h-25 flex justify-center items-center")
          div(v-if="hasDefineSecondaryHandler" class="grid grid-cols-2 gap-x-3")
            btn(size="md" type="secondary" class="h-10" :disabled="secondaryDisabled" @click="innerSecondaryHandler") {{secondaryText}}
            btn(size="md" class="h-10" :disabled="primaryDisabled" @click="innerPrimaryHandler") {{hasDefinePrimaryHandler ? primaryText : $t('b.cancel')}}
          btn(v-else size="md" class="h-10" :disabled="primaryDisabled" @click="innerPrimaryHandler") {{primaryText}}
</template>

<script>
import { ref } from 'vue'
import { computed } from '@vue/runtime-core'
export default {
  name: 'Modal',
  props: {
    header: {
      type: String,
      default: ''
    },
    primaryText: {
      type: String,
      default: ''
    },
    primaryHandler: {
      type: Function,
      default: null
    },
    primaryDisabled: {
      type: Boolean,
      default: false
    },
    secondaryText: {
      type: String,
      default: ''
    },
    secondaryHandler: {
      type: Function,
      default: null
    },
    secondaryDisabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup (props, { emit }) {
    const hasDefinePrimaryHandler = computed(() => typeof props.primaryHandler === 'function')
    const hasDefineSecondaryHandler = computed(() => typeof props.secondaryHandler === 'function')
    const isModalOpen = ref(false)
    const open = () => {
      isModalOpen.value = true
    }

    const close = () => {
      isModalOpen.value = false
      emit('close')
    }

    const innerPrimaryHandler = async () => {
      if (hasDefinePrimaryHandler.value) {
        await props.primaryHandler()
      }
      close()
    }

    const innerSecondaryHandler = async () => {
      if (hasDefineSecondaryHandler.value) {
        await props.secondaryHandler()
      }
      close()
    }

    return {
      isModalOpen,
      open,
      close,
      hasDefineSecondaryHandler,
      hasDefinePrimaryHandler,
      innerPrimaryHandler,
      innerSecondaryHandler
    }
  }
}
</script>
