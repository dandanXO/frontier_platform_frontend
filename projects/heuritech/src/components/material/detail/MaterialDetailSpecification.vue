<template lang="pug">
div
  h6(class="text-h6 font-bold text-grey-900 pb-3") {{ $t('RR0130') }}
  div(class="grid gap-y-2")
    template(v-for="(item, key) in materialBasicInfo" :key="key")
      p(
        class="text-body2 leading-1.6 break-words"
        :class="{ 'text-grey-600': key === 'frontierNo' }"
      ) {{ item.name }}: {{ item.value }}
</template>

<script>
import useMaterialOld from '@/composables/useMaterialOld'
export default {
  name: 'BlockMaterialSpecification',
  props: {
    material: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { materialBasicInfo } = useMaterialOld(props.material)

    return {
      materialBasicInfo,
    }
  },
}
</script>
