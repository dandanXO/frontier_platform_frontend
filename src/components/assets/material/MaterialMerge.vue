<template lang="pug">
div(class="pt-16 h-screen")
  fullscreen-header(
    :title="$t('EE0006')"
    :primaryText="$t('UU0003')"
    :primaryHandler="primaryHandler"
    :primaryCloseAfterHandle="false"
  )
  div(class="flex flex-col h-full")
    div(class="min-h-71.5 bg-black-0")
      overlay-scrollbar-container(class="h-full")
        material-merge-row(
            v-for="(material, index) in mergedList"
            :material="material"
            droppable
            :length="mergedList.length"
            @deleteRow="deleteRow(index)"
            @setRow="setRow(index, $event)"
            @clearBlock="clearBlock(index, $event)"
          )
        div(class="flex items-center justify-center pb-5")
          div(class="inline-block flex items-center justify-center text-body2 text-primary cursor-pointer" @click="addNewRow")
            svg-icon(iconName="add_box" size="24" class="text-black-700")
            span(class="pl-2") {{$t('EE0010')}}
    overlay-scrollbar-container(class="h-full bg-black-200")
      material-merge-row(
        v-for="material in materialList"
        :material="material"
      )
</template>

<script>
import { useStore } from 'vuex'
import { reactive } from 'vue'
import FullscreenHeader from '@/components/layout/FullScreenHeader.vue'
import MaterialMergeRow from '@/components/assets/material/MaterialMergeRow'

const mergedRow = {
  faceSide: {},
  backSide: {},
  detail: {}
}

export default {
  name: 'MaterialMerge',
  components: {
    FullscreenHeader,
    MaterialMergeRow
  },
  props: {
    materialListData: {
      type: Array
    }
  },
  setup (props) {
    const store = useStore()
    const materialList = reactive(
      props.materialListData.map(material => {
        const temp = {}
        Object.keys(mergedRow).forEach(key => {
          temp[key] = material
        })
        return temp
      })
    )
    const mergedList = reactive([{ ...mergedRow }])

    const primaryHandler = () => {
      store.dispatch('helper/pushFullScreen', {
        component: 'material-merge-preview',
        properties: {
          mergedList
        }
      })
    }

    const addNewRow = () => {
      mergedList.push({ ...JSON.parse(JSON.stringify(mergedRow)) })
    }

    const setRow = (index, row) => {
      mergedList[index] = row
    }

    const deleteRow = (index) => {
      mergedList.splice(index, 1)
    }

    const clearBlock = (index, blockType) => {
      mergedList[index][blockType] = {}
    }

    return {
      primaryHandler,
      materialList,
      mergedList,
      addNewRow,
      deleteRow,
      setRow,
      clearBlock
    }
  }
}
</script>
