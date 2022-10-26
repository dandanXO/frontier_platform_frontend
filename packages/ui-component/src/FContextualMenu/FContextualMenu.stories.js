import FContextualMenu from './FContextualMenu.vue'
import { ref } from 'vue'

const menuTree = {
  blockList: [
    {
      menuList: [
        {
          title: 'Menu 1',
        },
        {
          title: 'Menu 2',
        },
        {
          title: 'Menu 3',
        },
        {
          title: 'Menu 4',
        },
      ],
    },
  ],
}

export default {
  title: 'FContextualMenu',
  component: FContextualMenu,
  args: {
    menuTree,
  },
  argTypes: {
    inputSelectValue: {
      control: { type: null },
    },
    selectMode: {
      control: { type: 'select' },
      options: [0, 1, 2, 3],
    },
  },
}

const TemplateDefault = (args) => ({
  components: { FContextualMenu },
  setup() {
    return { args }
  },
  template: '<f-contextual-menu v-bind="args"></f-contextual-menu>',
})

export const Default = TemplateDefault.bind({})
Default.args = {
  selectMode: 0,
}
export const MultipleBlock = TemplateDefault.bind({})
const menuTreeMultipleBlock = JSON.parse(JSON.stringify(menuTree))
menuTreeMultipleBlock.blockList.push(menuTreeMultipleBlock.blockList[0])
menuTreeMultipleBlock.blockList.push(menuTreeMultipleBlock.blockList[0])
MultipleBlock.args = {
  selectMode: 0,
  menuTree: menuTreeMultipleBlock,
}

export const RootTitle = TemplateDefault.bind({})
RootTitle.args = {
  selectMode: 0,
  menuTree: {
    title: 'Root Title',
    ...menuTree,
  },
}

export const BlockTitle = TemplateDefault.bind({})
const menuTreeBlockTitle = JSON.parse(JSON.stringify(menuTree))
menuTreeBlockTitle.title = 'Root Title'
menuTreeBlockTitle.blockList.push(
  JSON.parse(JSON.stringify(menuTreeBlockTitle.blockList[0]))
)
menuTreeBlockTitle.blockList.push(
  JSON.parse(JSON.stringify(menuTreeBlockTitle.blockList[0]))
)
menuTreeBlockTitle.blockList[0].blockTitle = 'Block Title'
menuTreeBlockTitle.blockList[2].blockTitle = 'Block Title'
BlockTitle.args = {
  selectMode: 0,
  menuTree: menuTreeBlockTitle,
}

export const Mode0NonSelectable = TemplateDefault.bind({})
Mode0NonSelectable.args = {
  selectMode: 0,
}

const TemplateSingleSelect = (args) => ({
  components: { FContextualMenu },
  setup() {
    const inputSelectValue = ref()
    return { args, inputSelectValue }
  },
  template: `
    <f-contextual-menu v-bind="args" v-model:inputSelectValue="inputSelectValue"></f-contextual-menu>
    <p>inputSelectValue:  {{ JSON.stringify(inputSelectValue) }} </p>
  `,
})

export const Mode1SingleSelectAndCancelable = TemplateSingleSelect.bind({})
Mode1SingleSelectAndCancelable.args = {
  selectMode: 1,
}

export const Mode2SingleSelectAndNonCancelable = TemplateSingleSelect.bind({})
Mode2SingleSelectAndNonCancelable.args = {
  selectMode: 2,
}

const TemplateMultiSelect = (args) => ({
  components: { FContextualMenu },
  setup() {
    const inputSelectValue = ref([])
    return { args, inputSelectValue }
  },
  template: `
    <f-contextual-menu v-bind="args" v-model:inputSelectValue="inputSelectValue"></f-contextual-menu>
    <p>inputSelectValue:  {{ JSON.stringify(inputSelectValue) }} </p>
  `,
})

export const Mode3MultipleSelectAndCancelable = TemplateMultiSelect.bind({})
Mode3MultipleSelectAndCancelable.args = {
  selectMode: 3,
}

const TemplateMultiLayer = (args) => ({
  components: { FContextualMenu },
  setup() {
    return { args }
  },
  template: `
    <div class="w-screen h-screen">
      <f-contextual-menu class="w-30" v-bind="args"></f-contextual-menu>
    </div>
  `,
})

const menuMultiLayer = {
  title: 'Root',
  blockList: [
    {
      menuList: [
        {
          title: 'Menu 1',
        },
        {
          title: 'Menu 2',
          blockList: [
            {
              menuList: [
                {
                  title: 'Menu 2-1',
                },
                {
                  title: 'Menu 2-2',
                },
                {
                  title: 'Menu 2-3',
                },
                {
                  title: 'Menu 2-4',
                  blockList: [
                    {
                      menuList: [
                        {
                          title: 'Menu 2-4-1',
                        },
                        {
                          title: 'Menu 2-4-2',
                        },
                        {
                          title: 'Menu 2-4-3',
                        },
                        {
                          title: 'Menu 2-4-4',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          title: 'Menu 3',
        },
        {
          title: 'Menu 4',
          blockList: [
            {
              menuList: [
                {
                  title: 'Menu 4-1',
                },
                {
                  title: 'Menu 4-2',
                },
                {
                  title: 'Menu 4-3',
                },
                {
                  title: 'Menu 4-4',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export const MultiLayerMode0 = TemplateMultiLayer.bind({})
MultiLayerMode0.args = {
  selectMode: 0,
  menuTree: menuMultiLayer,
}

const TemplateMultiLayerSingleSelect = (args) => ({
  components: { FContextualMenu },
  setup() {
    const inputSelectValue = ref()
    return { args, inputSelectValue }
  },
  template: `
    <div class="w-screen h-screen">
      <f-contextual-menu class="w-30" v-model:inputSelectValue="inputSelectValue" v-bind="args"></f-contextual-menu>
      <p>inputSelectValue:  {{ JSON.stringify(inputSelectValue) }} </p>
    </div>
  `,
})
export const MultiLayerMode1 = TemplateMultiLayerSingleSelect.bind({})
MultiLayerMode1.args = {
  selectMode: 1,
  menuTree: menuMultiLayer,
}

export const MultiLayerMode2 = TemplateMultiLayerSingleSelect.bind({})
MultiLayerMode2.args = {
  selectMode: 2,
  menuTree: menuMultiLayer,
}

const TemplateMultiLayerMultiSelect = (args) => ({
  components: { FContextualMenu },
  setup() {
    const inputSelectValue = ref([])
    return { args, inputSelectValue }
  },
  template: `
    <div class="w-screen h-screen">
      <f-contextual-menu class="w-30" v-model:inputSelectValue="inputSelectValue" v-bind="args"></f-contextual-menu>
      <p>inputSelectValue:  {{ JSON.stringify(inputSelectValue) }} </p>
    </div>
  `,
})

export const MultiLayerMode3 = TemplateMultiLayerMultiSelect.bind({})
MultiLayerMode3.args = {
  selectMode: 3,
  menuTree: menuMultiLayer,
}

const TemplateMultiLayerMultiBlock = (args) => ({
  components: { FContextualMenu },
  setup() {
    return { args }
  },
  template: `
    <div class="w-screen h-screen">
      <f-contextual-menu class="w-30" v-bind="args"></f-contextual-menu>
    </div>
  `,
})

const menuMultiLayerMultiBlock = {
  title: 'Root',
  blockList: [
    {
      menuList: [
        {
          title: 'Menu 1',
        },
        {
          title: 'Menu 2',
          blockList: [
            {
              blockTitle: 'Block',
              menuList: [
                {
                  title: 'Menu 2-1',
                },
                {
                  title: 'Menu 2-2',
                },
                {
                  title: 'Menu 2-3',
                },
                {
                  title: 'Menu 2-4',
                  blockList: [
                    {
                      menuList: [
                        {
                          title: 'Menu 2-4-1',
                        },
                        {
                          title: 'Menu 2-4-2',
                        },
                        {
                          title: 'Menu 2-4-3',
                        },
                        {
                          title: 'Menu 2-4-4',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            menuTree.blockList[0],
          ],
        },
        {
          title: 'Menu 3',
        },
        {
          title: 'Menu 4',
          blockList: [
            {
              menuList: [
                {
                  title: 'Menu 4-1',
                },
                {
                  title: 'Menu 4-2',
                },
                {
                  title: 'Menu 4-3',
                },
                {
                  title: 'Menu 4-4',
                },
              ],
            },
          ],
        },
      ],
    },
    menuTree.blockList[0],
  ],
}

export const MultiLayerMultiBlock = TemplateMultiLayerMultiBlock.bind({})
MultiLayerMultiBlock.args = {
  selectMode: 0,
  menuTree: menuMultiLayerMultiBlock,
}
