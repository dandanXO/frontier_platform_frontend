<template lang="pug">
div(v-if='addedMaterialList.length > 0' class='fixed z-100 bottom-5 inset-x-0 w-fit m-auto px-15 py-7.5 bg-black-0 rounded-full menu-shadow text-body2 text-primary flex justify-center items-center')
  svg-icon(iconName='cancel' size='24' class='text-black-400 mr-4 cursor-pointer' @click='clearList')
  i18n-t(keypath="RR0073" tag='div' class='mr-7.5')
    template(#number) {{addedMaterialList.length}}
  div(class='flex flex-col gap-5')
    div(v-for='block in options' class='flex')
      div(
        v-for='(option,index) in block'
        class='whitespace-nowrap cursor-pointer hover:text-brand'
        :class='{"border-r mr-5 pr-5": index !== block.length-1}'
        @click='handleClick(option)'
      ) {{option.name}}
</template>

<script>
import useAssets from '@/composables/useAssets'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'MultiSelectMenu',
  setup () {
    const store = useStore()
    const {
      printCard,
      downloadU3M,
      cloneTo,
      addToWorkspace,
      exportExcel,
      printQRCode,
      mergeCard,
      deleteMaterial
    } = useAssets()

    const options = [
      [
        cloneTo,
        addToWorkspace,
        printCard,
        printQRCode
      ],
      [
        downloadU3M,
        exportExcel,
        mergeCard,
        deleteMaterial
      ]
    ]

    const addedMaterialList = computed(() => store.getters['assets/addedMaterialList'])
    const clearList = () => store.commit('assets/CLEAR_addedMaterialList')
    const handleClick = (option) => option.func && option.func()

    return {
      options,
      addedMaterialList,
      clearList,
      handleClick
    }
  }
}
</script>
