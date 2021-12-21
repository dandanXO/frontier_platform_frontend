<template lang="pug">
div
  h5(class="text-h5 font-bold text-primary pb-3") {{$t('RR0130')}}
  div(class="grid gap-y-2")
    p(v-for='item in materialBasicInfo' class='text-body2 text-primary line-clamp-1') {{item.name}}: {{item.value}}
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
