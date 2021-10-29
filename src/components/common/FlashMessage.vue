<style lang='scss' scoped>
.flash-message {
  background-color: #f1fff4;
  border: 1px solid #c0ecd4;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-from {
  transform: translateY(20px);
  opacity: 0;
}
</style>

<template lang='pug'>
transition(name='slide-fade')
  div(v-if='message' class='fixed bottom-5 left-0 right-0 ml-auto mr-auto flash-message rounded p-4 flex justify-center items-center w-min whitespace-nowrap')
    svg-icon(iconName='check_circle_outline' size='24' class='text-brand mr-2.5')
    div(class='text-primary') {{message}}
    svg-icon(iconName='clear' size='24' class='text-black-500 ml-2.5 cursor-pointer' @click='close')
</template>

<script>
import { useStore } from 'vuex'
import { computed, watch } from 'vue'

export default {
  name: 'FlashMessage',
  setup () {
    const store = useStore()
    const message = computed(() => store.getters['helper/message'])
    let timeoutID

    const close = () => {
      clearTimeout(timeoutID)
      timeoutID = undefined
      store.commit('helper/REMOVE_message')
    }

    const setTimer = () => {
      timeoutID = setTimeout(() => { close() }, 1000)
    }

    watch(
      () => message.value,
      () => {
        !!message.value && setTimer()
      }
    )

    return {
      message,
      close
    }
  }
}
</script>
