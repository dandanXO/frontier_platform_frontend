<template lang="pug">
div(class="grid grid-rows-4 grid-cols-2 gap-x-14")
  div(
    v-for="block in structure"
    class="w-full min-w-75 max-w-115"
    :class="[block.class]"
  )
    div(class="flex justify-between pb-2 border-b-2 mb-3")
      div(class="text-body1 font-bold text-primary") {{block.title}}
      btn-functional(@click="handleEdit(block)") {{$t("UU0027")}}
    div(class="grid gap-3")
      div(v-for="(item, key) in block.column" class="text-body2 line-clamp-1" :class="{ 'text-black-700': key === 'frontierNo' }") {{item.name}}: {{item.value}}
</template>

<script>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
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
    const store = useStore()
    const { materialBasicInfo, materialInfo } = useMaterial(props.material)

    const structure = computed(() => {
      const { publicTagList, aiTagList, privateTagList } = props.material

      return [
        {
          id: 'spec',
          title: t('RR0130'),
          column: materialBasicInfo.value,
          class: 'row-span-4'
        },
        {
          id: 'inventory',
          title: t('RR0135'),
          column: [materialInfo.totalInventoryQty],
          class: 'row-span-1'
        },
        {
          id: 'price',
          title: t('RR0134'),
          column: [materialInfo.publicPrice.pricing],
          class: 'row-span-1'
        },
        {
          id: 'tag',
          title: t('RR0133'),
          column: [
            { name: t('RR0027'), value: publicTagList.join(',') },
            { name: t('RR0071'), value: aiTagList.join(',') },
            { name: t('RR0028'), value: privateTagList.join(',') }
          ],
          class: 'row-span-2'
        }
      ]
    })

    const handleEdit = (block) => {
      store.dispatch('material/setMaterial', JSON.parse(JSON.stringify(props.material)))
      store.dispatch('helper/openModal', {
        component: 'ModalEditSimpleInfo',
        header: block.title,
        properties: {
          blockId: `simple-${block.id}`
        }
      })
    }

    return {
      structure,
      handleEdit
    }
  }
}
</script>
