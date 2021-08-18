<template lang="pug">
div group management page {{tab}}
</template>

<script>
export default {
  name: 'ManagementGroup',
  props: {
    tab: {
      type: String,
      required: true
    }
  }
}
</script>
