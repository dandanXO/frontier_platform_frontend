<template lang="pug">
div(class="flex items-center w-113 h-56.5 bg-black-0 px-8 py-8")
  qr-code(class="mr-8" :value="'1234567'" :size="100")
  div(class="flex flex-col")
    span(class="mb-2 text-black-900 font-bold text-h5") Scan Back Side
    span(class="text-h6") please put this QR Code on your upper right of swatch/hanger and scan altogether for every scan file.
</template>

<script>
import QrCode from '@/components/common/QrCode'

export default {
  name: 'QrCodeBacksideGeneral',
  components: {
    QrCode
  },
  props: {
  },
  setup () {
    return {
    }
  }
}
</script>
