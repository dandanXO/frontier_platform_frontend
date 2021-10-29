<template lang="pug">
div(class='grid grid-rows-4 grid-cols-2 gap-x-14')
  div(
    v-for='block in structure'
    class='w-full min-w-75 max-w-115'
    :class='[block.class]'
  )
    div(class='flex justify-between pb-2 border-b-2 mb-3')
      div(class='text-body1 font-bold text-primary') {{block.title}}
      btn-functional(@click='handleEdit(block.id)') {{$t('UU0027')}}
    div(class='grid gap-4')
      div(v-for='item in block.column' class='line-clamp-1') {{item.name}} : {{item.value}}
</template>

<script>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import useMaterial from '@/composables/useMaterial'

export default {
  name: 'RowItemContentBlock',
  props: {
    material: {
      type: Object
    }
  },
  setup (props) {
    const { t } = useI18n()
    const { materialWeight } = useMaterial(props.material)

    const structure = computed(() => {
      const { content, pattern, color, width, finish, warpYarnCount, weftYarnCount, warpDensity, weftDensity, totalInventoryQty, publicPrice, publicTagList, aiTagList, privateTagList } = props.material

      return [
        {
          id: 'specification',
          title: t('EE0002'),
          column: [
            { name: t('RR0021'), value: content },
            { name: t('RR0023'), value: warpYarnCount && `${warpYarnCount}*${weftYarnCount}` },
            { name: t('RR0024'), value: warpDensity && `${warpDensity}*${weftDensity}` },
            { name: t('RR0025'), value: pattern },
            { name: t('RR0026'), value: color },
            { name: t('RR0015'), value: materialWeight.value },
            { name: t('RR0019'), value: width },
            { name: t('RR0022'), value: finish }
          ],
          class: 'row-span-4'
        },
        {
          id: 'inventory',
          title: t('EE0003'),
          column: [{ name: t('RR0034'), value: totalInventoryQty }],
          class: 'row-span-1'
        },
        {
          id: 'price',
          title: t('EE0004'),
          column: [{ name: t('RR0043'), value: publicPrice?.price && `${publicPrice?.currency} ${publicPrice?.price}/${publicPrice?.unit}` }],
          class: 'row-span-1'
        },
        {
          id: 'tag',
          title: t('EE0005'),
          column: [
            { name: t('RR0027'), value: publicTagList.join(',') },
            { name: t('RR0071'), value: aiTagList.join(',') },
            { name: t('RR0028'), value: privateTagList.join(',') }
          ],
          class: 'row-span-2'
        }
      ]
    })

    const handleEdit = (id) => {
      console.log('edit', id)
    }

    return {
      structure,
      handleEdit
    }
  }
}
</script>
