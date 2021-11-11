<template lang="pug">
h1 I'm {{$route.name}} Page
router-link-extending(tag="h1" to="/") Back To Lobby Page
</template>

<script>

export default {
  name: 'PublicLibrary'
}
</script>
