<template lang="pug">
div
  h5(class="text-h5 font-bold text-grey-900 pb-3") {{ $t("RR0130") }}
  div(class="grid gap-y-2")
    p(v-for="(item, key) in materialBasicInfo" class="text-body2 leading-1.6 break-words" :class="{ 'text-grey-600': key === 'frontierNo' }") {{ item.name }}: {{ item.value }}
</template>

<script>
import useMaterial from '@/composables/useMaterial'
export default {
  name: 'BlockMaterialSpecification',
  props: {
    material: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const { materialBasicInfo } = useMaterial(props.material)

    return {
      materialBasicInfo
    }
  }
}
</script>
