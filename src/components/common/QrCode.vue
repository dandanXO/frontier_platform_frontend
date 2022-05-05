<template lang="pug">
qrcode-vue(:value="value" :size="size" level="H")
</template>

<script>
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'QrCode',
  components: {
    QrcodeVue
  },
  props: {
    value: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 200
    }
  }
}
</script>
