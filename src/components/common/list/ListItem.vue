<template lang="pug">
div(class="flex items-center px-3 py-2.5 text-body2 text-primary hover:bg-black-200 break-words")
  slot
</template>

<script>
export default {
  name: 'ListItem'
}
</script>
