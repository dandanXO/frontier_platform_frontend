<template lang="pug">
h1 I'm {{ $route.name }} Page
btn(@click="showMessage") show message
</template>

<script>
import { useStore } from 'vuex'

export default {
  name: 'Favorite',
  setup () {
    const store = useStore()
    const showMessage = () => {
      store.commit('helper/PUSH_message', 'Notification message. Here will be information.')
    }

    return {
      showMessage
    }
  }
}
</script>
