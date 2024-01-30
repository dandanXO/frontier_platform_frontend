<template lang="pug">
div(class="p-4 w-100 bg-grey-100")
  f-button(type="primary" size="md" @click="handleConfirm") Confirm
  f-select-input(
    v-model:selectValue="descriptionList"
    :dropdownMenuTree="descriptionListMenu"
    :placeholder="'Select or enter keywords related to this weaving / type'"
    multiple
    class="w-full"
  )
</template>

<script lang="ts">
import { computed, ref } from 'vue'
import type { ICellEditorParams } from 'ag-grid-community'
import type { MaterialDescription } from '@frontier/platform-web-sdk'

export default {
  setup(props: { params: ICellEditorParams }) {
    let id = 0
    const generateMockDescriptionTag = (name: string): MaterialDescription => {
      id += 1
      return { descriptionId: id, name: `${name} tag ${id}` }
    }

    const generateMockDescriptionTags = (
      count: number,
      name: string
    ): MaterialDescription[] => {
      const tags = []
      for (let i = 0; i < count; i += 1) {
        tags.push(generateMockDescriptionTag(name))
      }
      return tags
    }

    const descriptionListOptions = {
      woven: {
        default: [
          {
            descriptionId: 1,
            name: 'Cambric',
          },
          {
            descriptionId: 2,
            name: 'Canvas',
          },
          {
            descriptionId: 157,
            name: '123',
          },
          {
            descriptionId: 158,
            name: '33',
          },
        ],
        // default: generateMockDescriptionTags(2, 'woven'),
        custom: generateMockDescriptionTags(2, 'woven'),
      },
      knit: {
        default: generateMockDescriptionTags(2, 'knit'),
        custom: generateMockDescriptionTags(2, 'knit'),
      },
      nonWoven: {
        default: generateMockDescriptionTags(2, 'nonWoven'),
        custom: generateMockDescriptionTags(2, 'nonWoven'),
      },
      leather: {
        default: generateMockDescriptionTags(2, 'leather'),
        custom: generateMockDescriptionTags(2, 'leather'),
      },
      trim: {
        default: generateMockDescriptionTags(2, 'trim'),
        custom: generateMockDescriptionTags(2, 'trim'),
      },
      others: {
        default: generateMockDescriptionTags(2, 'others'),
        custom: generateMockDescriptionTags(2, 'others'),
      },
    }

    const descriptionList = ref(props.params.value)

    const descriptionListMenu = computed(() => ({
      scrollAreaMaxHeight: 'max-h-72',
      blockList: [
        // { blockTitle: $t('RR0258'), menuList: descriptionMenuCustomList.value },
        {
          menuList: descriptionListOptions.woven.default.map((description) => ({
            title: description.name,
            selectValue: description,
          })),
        },
      ],
    }))

    const handleConfirm = () => {
      // props.params.api.applyTransaction({
      //   update: [
      //     {
      //       ...props.params.data,
      //       descriptionList: descriptionList.value,
      //     },
      //   ],
      // })
      props.params.api.stopEditing()
    }

    const getValue = () => {
      return descriptionList.value
    }

    return {
      getValue,
      descriptionList,
      handleConfirm,
      descriptionListMenu,
    }
  },
}
</script>

<style scoped></style>
