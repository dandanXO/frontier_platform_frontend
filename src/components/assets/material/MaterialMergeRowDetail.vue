<template lang="pug">
div(class='h-full pt-5 px-7.5 overflow-y-auto text-body2')
  div(class='text-black font-bold mb-3') {{material.materialNo}} {{material.description}}
  div(class='grid grid-cols-2 gap-10')
    div(v-for='block in columns')
      div(v-for='col in block' class='text-primary line-height-1.6 mb-1') {{col.name}} : {{col.value}}
</template>

<script>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import useMaterial from '@/composables/useMaterial'

export default {
  name: 'MaterialMergeRowDetail',
  props: {
    material: {
      type: Object
    }
  },
  setup (props) {
    const { t } = useI18n()

    const { materialWeight } = useMaterial(props.material)
    const columns = computed(() => {
      const { content, pattern, color, width, finish, warpYarnCount, weftYarnCount, warpDensity, weftDensity } = props.material

      return [
        [
          { name: t('RR0021'), value: content },
          { name: t('RR0023'), value: warpYarnCount && `${warpYarnCount}*${weftYarnCount}` },
          { name: t('RR0024'), value: warpDensity && `${warpDensity}*${weftDensity}` },
          { name: t('RR0025'), value: pattern }
        ], [
          { name: t('RR0026'), value: color },
          { name: t('RR0015'), value: materialWeight.value },
          { name: t('RR0019'), value: width },
          { name: t('RR0022'), value: finish }
        ]
      ]
    })

    return {
      columns
    }
  }
}
</script>
