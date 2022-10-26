<template lang="pug">
div(
  class="fixed inset-0 z-modal w-screen h-screen bg-grey-900/70 flex justify-center items-center"
)
  div(
    class="flex flex-col items-center justify-center w-49 h-28 px-13 py-7 bg-grey-0 rounded card-shadow"
  )
    f-svg-icon(
      iconName="loading"
      size="92"
      class="text-primary-500"
      :style="{ minHeight: '28px' }"
    )
    p(class="text-body2 text-grey-900 pt-3.5") {{ $t('RR0162') }}
</template>

<script>
export default {
  name: 'ModalLoading',
}
</script>
