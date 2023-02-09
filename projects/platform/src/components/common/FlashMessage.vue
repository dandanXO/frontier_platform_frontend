<style lang="scss" scoped>
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

<template lang="pug">
transition(name="slide-fade")
  div(
    v-if="message"
    class="fixed z-flash-msg bottom-5 left-0 right-0 ml-auto mr-auto flash-message rounded p-4 flex justify-center items-center w-min whitespace-nowrap"
  )
    f-svg-icon(
      iconName="check_circle_outline"
      size="24"
      class="text-primary-400 mr-2.5"
    )
    div(class="text-grey-900") {{ message }}
    f-svg-icon(
      iconName="clear"
      size="24"
      class="text-grey-250 ml-2.5 cursor-pointer"
      @click="close"
    )
</template>

<script>
export default {
  name: 'FlashMessage',
}
</script>

<script setup>
import { useStore } from 'vuex'
import { computed, watch } from 'vue'

const store = useStore()
const message = computed(() => store.getters['helper/message'])
let timeoutID

const close = () => {
  clearTimeout(timeoutID)
  timeoutID = undefined
  store.dispatch('helper/removeFlashMessage')
}

const setTimer = () => {
  timeoutID = setTimeout(() => {
    close()
  }, 2000)
}

watch(
  () => message.value,
  () => {
    !!message.value && setTimer()
  }
)
</script>
