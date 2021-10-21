<template lang="pug">
h1 I'm {{$route.name}} Page
btn(@click="openFullscreenMergeMaterial") merge material
</template>

<script>
import { useStore } from 'vuex'
export default {
  name: 'OrgAssets',
  setup () {
    const store = useStore()
    const openFullscreenMergeMaterial = () => {
      store.dispatch('helper/openFullScreen', {
        component: 'material-merge'
      })
    }

    return {
      openFullscreenMergeMaterial
    }
  }
}
</script>
