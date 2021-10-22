<template lang="pug">
div(class='grid grid-rows-4 grid-cols-2 gap-x-14')
  div(
    v-for='block in structure'
    class='w-full min-w-75 max-w-115'
    :class='[block.class]'
  )
    div(class='flex justify-between pb-2 border-b-2 mb-3')
      div(class='text-body1 font-bold text-primary') {{block.title}}
      list-item-content-edit(:blockTitle='block.title')
    div(class='grid gap-4')
      div(v-for='item in block.column') {{item.name}} :
        span(class='pl-2') {{item.useDirectly ? material[item.value] : getValue(item.value)}}
</template>

<script>
import { useI18n } from 'vue-i18n'
import ListItemContentEdit from '@/components/assets/material/list/ListItemContentEdit'

export default {
  name: 'ListItemContentBlock',
  components: { ListItemContentEdit },
  props: {
    material: {
      type: Object
    }
  },
  setup () {
    const { t } = useI18n()

    const structure = [
      {
        title: t('EE0002'),
        column: [
          { name: t('RR0021'), value: 'content', useDirectly: true },
          { name: t('RR0023'), value: 'yarnSize', useDirectly: false },
          { name: t('RR0024'), value: 'density', useDirectly: false },
          { name: t('RR0025'), value: 'pattern', useDirectly: true },
          { name: t('RR0026'), value: 'color', useDirectly: true },
          { name: t('RR0015'), value: 'weight', useDirectly: false },
          { name: t('RR0019'), value: 'width', useDirectly: true },
          { name: t('RR0022'), value: 'finish', useDirectly: true }
        ],
        class: 'row-span-4'
      },
      {
        title: t('EE0003'),
        column: [{ name: t('RR0034'), value: 'totalInventoryQty', useDirectly: true }],
        class: 'row-span-1'
      },
      {
        title: t('EE0004'),
        column: [{ name: t('RR0043'), value: 'price', useDirectly: false }],
        class: 'row-span-1'
      },
      {
        title: t('EE0005'),
        column: [
          { name: t('RR0027'), value: 'publicTagList', useDirectly: false },
          { name: t('RR0071'), value: 'aiTagList', useDirectly: false },
          { name: t('RR0028'), value: ' privateTagList', useDirectly: false }
        ],
        class: 'row-span-2'
      }
    ]

    const getValue = (colName) => {
      console.log('getValue', colName)
    }

    return {
      structure,
      getValue
    }
  }
}
</script>
