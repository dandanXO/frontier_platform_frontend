<template lang="pug">
div(class="flex flex-col items-center justify-center w-50 h-30 p-20")
  span(class="text-h5 text-primary") Loading...
  svg-icon(iconName="loading" size="100" class="text-brand-dark")
</template>

<script>
export default {
  name: 'ModalLoading',
  setup (props) {
    return {
    }
  }
}
</script>
