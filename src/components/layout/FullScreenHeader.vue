<template lang="pug">
div(
  ref="root"
  class="fixed inset-0 z-index:header w-screen h-16 bg-black-0 px-36 flex justify-between items-center transition duration-300 ease-in"
  :class="{ 'header-shadow': isScrolling }"
)
  div(class="flex items-center")
    h5(v-if="title !== ''" class="text-h5 text-primary font-bold") {{title}}
    slot(name="left")
  div(class="flex justify-center items-center")
    div(v-if="secondaryButton" class="grid grid-cols-2 gap-x-3")
      btn(size="md" type="secondary" class="h-10" @click="innerSecondaryHandler") {{secondaryText !== '' ? secondaryText : $t('b.cancel')}}
      btn(size="md" class="h-10" @click="innerPrimaryHandler") {{primaryText}}
    btn(v-else-if="primaryButton" size="md" class="h-10" @click="innerPrimaryHandler") {{primaryText}}
</template>

<script>
import { onMounted } from '@vue/runtime-core'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'FullscreenHeader',
  props: {
    title: {
      type: String,
      default: ''
    },
    primaryButton: {
      type: Boolean,
      default: true
    },
    primaryText: {
      type: String,
      default: ''
    },
    primaryHandler: {
      type: Function
    },
    primaryCloseAfterHandle: {
      type: Boolean,
      default: true
    },
    afterPrimaryHandler: {
      type: Function
    },
    secondaryButton: {
      type: Boolean,
      default: true
    },
    secondaryText: {
      type: String,
      default: ''
    },
    secondaryHandler: {
      type: Function
    },
    afterSecondaryHandler: {
      type: Function
    },
    secondaryCloseAfterHandle: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    const store = useStore()
    const root = ref(null)
    const isScrolling = ref(false)

    const hasDefinePrimaryHandler = computed(() => typeof props.primaryHandler === 'function')
    const hasDefineAfterPrimaryHandler = computed(() => typeof props.afterPrimaryHandler === 'function')
    const hasDefineSecondaryHandler = computed(() => typeof props.secondaryHandler === 'function')
    const hasDefindAfterSecondaryHandler = computed(() => typeof props.afterSecondaryHandler === 'function')

    const closeFullscreen = () => store.dispatch('helper/closeFullscreen')

    const innerPrimaryHandler = async () => {
      if (hasDefinePrimaryHandler.value) {
        await props.primaryHandler()
      }

      props.primaryCloseAfterHandle && closeFullscreen()

      hasDefineAfterPrimaryHandler.value && props.afterPrimaryHandler()
    }

    const innerSecondaryHandler = async () => {
      if (hasDefineSecondaryHandler.value) {
        await props.secondaryHandler()
      }

      props.secondaryCloseAfterHandle && closeFullscreen()

      hasDefindAfterSecondaryHandler.value && props.afterSecondaryHandler()
    }

    onMounted(() => {
      const container = root.value.parentElement
      container.addEventListener('scroll', () => {
        isScrolling.value = container.scrollTop > 0
      })
    })

    return {
      root,
      isScrolling,
      hasDefinePrimaryHandler,
      hasDefineSecondaryHandler,
      innerPrimaryHandler,
      innerSecondaryHandler
    }
  }
}
</script>
