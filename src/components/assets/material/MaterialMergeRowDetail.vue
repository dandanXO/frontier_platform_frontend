<template lang="pug">
div(class='h-full pt-5 px-7.5 overflow-y-auto text-body2')
  div(class='text-black font-bold mb-3') {{material.materialNo}} {{material.description}}
  div(class='grid grid-cols-2 gap-x-5')
    div(class="grid gap-y-1")
      template(v-for="(value, name, index) in materialBasicInfo")
        div(v-if="index < 4" class="text-primary line-height-1.6") {{value.name}} : {{value.value}}
    div(class="grid gap-y-1")
      template(v-for="(value, name, index) in materialBasicInfo")
        div(v-if="index >= 4" class="text-primary line-height-1.6") {{value.name}} : {{value.value}}
</template>

<script>
import useMaterial from '@/composables/useMaterial'

export default {
  name: 'MaterialMergeRowDetail',
  props: {
    material: {
      type: Object
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
