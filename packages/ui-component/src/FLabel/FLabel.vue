<template lang="pug">
div(
  class="w-fit px-3 py-2.5 h-8.5 box-border flex items-center bg-grey-100 rounded text-body2 text-grey-900"
)
  slot
</template>

<script>
export default {
  name: 'FLabel',
}
</script>
