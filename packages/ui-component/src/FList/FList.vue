<style lang="scss" scoped>
.card-shadow {
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15);
}
</style>

<template lang="pug">
div(class="bg-black-0 py-2 rounded card-shadow")
  slot
</template>

<script>
export default {
  name: 'FList'
}
</script>
