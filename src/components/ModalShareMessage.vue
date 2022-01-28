<template lang="pug">
div(class="w-132.5")
  div(class="border-t border-black-400 py-10 px-8 text-center text-body2 line-height-1.6 text-primary")
    p(v-if="!message") {{$t('RR0147')}}
    overlay-scrollbar-container(v-else class="max-h-116.5")
      p(class="break-words") {{message}}
</template>

<script>
export default {
  name: 'ModalReceivedShareMessage',
  props: {
    message: {
      required: true
    }
  }
}
</script>
