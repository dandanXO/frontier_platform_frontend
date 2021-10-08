<template lang="pug">
qrcode-vue(:value="value" :size="size" level="H")
</template>

<script>
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'SvgIcon',
  components: {
    QrcodeVue
  },
  props: {
    value: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: '200'
    }
  },
  setup (props) {
    return {
    }
  }
}
</script>
