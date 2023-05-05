<template lang="pug">
h1 I'm {{ $route.name }} Page
f-button(@click="showMessage") show message
</template>

<script>
import { useNotifyStore } from '@/stores/notify'

export default {
  name: 'Favorite',
  setup() {
    const notify = useNotifyStore()
    const showMessage = () => {
      notify.showNotifySnackbar({
        messageText: 'Notification message. Here will be information.',
      })
    }

    return {
      showMessage,
    }
  },
}
</script>
