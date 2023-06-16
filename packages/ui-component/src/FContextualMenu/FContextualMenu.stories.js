import FContextualMenu from './FContextualMenu.vue'
import { CONTEXTUAL_MENU_MODE, SIZE } from '../constants'
import { ref } from 'vue'

const { NONE_SELECT, SINGLE_CANCEL, SINGLE_NONE_CANCEL, MULTIPLE } =
  CONTEXTUAL_MENU_MODE

const menuTree = {
  width: 'w-60',
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
  template: `
  <div style="margin: 100px">
    <f-contextual-menu v-bind="args"></f-contextual-menu>
  </div>
  `,
})

export const Default = TemplateDefault.bind({})
Default.args = {
  selectMode: NONE_SELECT,
}

export const LeadingVisual = TemplateDefault.bind({})
const menuTreeLeadingVisual = JSON.parse(JSON.stringify(menuTree))
menuTreeLeadingVisual.blockList[0].menuList[0].icon = 'create'
menuTreeLeadingVisual.blockList[0].menuList[1].labelColor = '#0F7F73'
menuTreeLeadingVisual.blockList[0].menuList[2].thumbnail =
  'https://picsum.photos/50'
menuTreeLeadingVisual.blockList[0].menuList.push(
  JSON.parse(JSON.stringify(menuTreeLeadingVisual.blockList[0].menuList[2]))
)
menuTreeLeadingVisual.blockList[0].menuList[4].thumbnailSize = SIZE.MD
LeadingVisual.args = {
  selectMode: NONE_SELECT,
  menuTree: menuTreeLeadingVisual,
}

export const RootTitle = TemplateDefault.bind({})
RootTitle.args = {
  selectMode: NONE_SELECT,
  menuTree: {
    ...menuTree,
    rootTitle: 'Root Title',
  },
}

export const MultipleBlock = TemplateDefault.bind({})
const menuTreeMultipleBlock = JSON.parse(JSON.stringify(menuTree))
menuTreeMultipleBlock.blockList.push(menuTreeMultipleBlock.blockList[0])
menuTreeMultipleBlock.blockList.push(menuTreeMultipleBlock.blockList[0])
MultipleBlock.args = {
  selectMode: NONE_SELECT,
  menuTree: menuTreeMultipleBlock,
}

export const BlockTitle = TemplateDefault.bind({})
const menuTreeBlockTitle = JSON.parse(JSON.stringify(menuTree))
menuTreeBlockTitle.rootTitle = 'Root Title'
menuTreeBlockTitle.blockList.push(
  JSON.parse(JSON.stringify(menuTreeBlockTitle.blockList[0]))
)
menuTreeBlockTitle.blockList.push(
  JSON.parse(JSON.stringify(menuTreeBlockTitle.blockList[0]))
)
menuTreeBlockTitle.blockList[0].blockTitle = 'Block Title'
menuTreeBlockTitle.blockList[2].blockTitle = 'Block Title'
BlockTitle.args = {
  selectMode: NONE_SELECT,
  menuTree: menuTreeBlockTitle,
}

export const SearchInput = TemplateDefault.bind({})
SearchInput.args = {
  selectMode: NONE_SELECT,
  menuTree: {
    searchEnable: true,
    ...menuTree,
  },
}

export const ButtonTop = TemplateDefault.bind({})
ButtonTop.args = {
  selectMode: NONE_SELECT,
  menuTree: {
    ...menuTree,
    button: {
      position: 'top',
      icon: 'create',
      text: 'button',
    },
  },
}

export const ButtonBottom = TemplateDefault.bind({})
ButtonBottom.args = {
  selectMode: NONE_SELECT,
  menuTree: {
    ...menuTree,
    button: {
      position: 'bottom',
      icon: 'create',
      text: 'button',
    },
  },
}

export const Description = TemplateDefault.bind({})
const menuTreeDescription = JSON.parse(JSON.stringify(menuTree))
menuTreeDescription.blockList[0].menuList[0].description = 'description'
menuTreeDescription.blockList[0].menuList[1].display = 'block'
menuTreeDescription.blockList[0].menuList[1].description = 'description'
menuTreeDescription.blockList[0].menuList[2].description =
  'looooooooooooooooooooooooooooooooooooooooong description'
menuTreeDescription.blockList[0].menuList[3].display = 'block'
menuTreeDescription.blockList[0].menuList[3].description =
  'looooooooooooooooooooooooooooooooooooooooong description'
menuTreeDescription.blockList[0].menuList.push(
  JSON.parse(JSON.stringify(menuTreeDescription.blockList[0].menuList[3]))
)
menuTreeDescription.blockList[0].menuList[4].descriptionLineClamp = 2
Description.args = {
  menuTree: menuTreeDescription,
}

export const Mode0NonSelectable = TemplateDefault.bind({})
Mode0NonSelectable.args = {
  selectMode: NONE_SELECT,
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

const menuTreeCannotSelect = {
  blockList: [
    {
      menuList: [
        {
          title: 'Menu 1',
        },
        {
          title: 'Menu 2 (Disabled)',
          disabled: true,
        },
        {
          title: 'Menu 3 (Can not Select)',
          selectable: false,
        },
        {
          title: 'Menu 4',
        },
      ],
    },
  ],
}

export const Mode1SingleSelectAndCancelable = TemplateSingleSelect.bind({})
Mode1SingleSelectAndCancelable.args = {
  selectMode: SINGLE_CANCEL,
  menuTree: menuTreeCannotSelect,
}

export const Mode2SingleSelectAndNonCancelable = TemplateSingleSelect.bind({})
Mode2SingleSelectAndNonCancelable.args = {
  selectMode: SINGLE_NONE_CANCEL,
  menuTree: menuTreeCannotSelect,
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
  selectMode: MULTIPLE,
  menuTree: menuTreeCannotSelect,
}

const TemplateMultiLayer = (args) => ({
  components: { FContextualMenu },
  setup() {
    return { args }
  },
  template: `
    <div class="w-screen h-screen">
      <f-contextual-menu v-bind="args"></f-contextual-menu>
    </div>
  `,
})

const menuMultiLayer = {
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
                  clickHandler: () => {
                    console.log('click handler')
                  },
                  mouseEnterHandler: () => {
                    console.log('mouseEnterHandler handler')
                  },
                  mouseLeaveHandler: () => {
                    console.log('mouseLeaveHandler handler')
                  },
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
  selectMode: NONE_SELECT,
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
      <f-contextual-menu v-model:inputSelectValue="inputSelectValue" v-bind="args"></f-contextual-menu>
      <p>inputSelectValue:  {{ JSON.stringify(inputSelectValue) }} </p>
    </div>
  `,
})

export const MultiLayerMode1 = TemplateMultiLayerSingleSelect.bind({})
MultiLayerMode1.args = {
  selectMode: SINGLE_CANCEL,
  menuTree: menuMultiLayer,
}

export const MultiLayerMode2 = TemplateMultiLayerSingleSelect.bind({})
MultiLayerMode2.args = {
  selectMode: SINGLE_NONE_CANCEL,
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
      <f-contextual-menu v-model:inputSelectValue="inputSelectValue" v-bind="args"></f-contextual-menu>
      <p>inputSelectValue:  {{ JSON.stringify(inputSelectValue) }} </p>
    </div>
  `,
})

export const MultiLayerMode3 = TemplateMultiLayerMultiSelect.bind({})
MultiLayerMode3.args = {
  selectMode: MULTIPLE,
  menuTree: menuMultiLayer,
}

const menuCombination = {
  rootTitle: 'Root',
  searchEnable: true,
  button: {
    position: 'top', // top or bottom
    icon: 'create',
    text: 'button',
    clickHandler: null,
    disabled: false,
  },
  width: 'w-60',
  scrollAreaMaxHeight: 'max-h-40',
  blockList: [
    {
      menuList: [
        {
          title: 'Menu 1',
          description: 'description',
          thumbnail: 'https://picsum.photos/50',
        },
        {
          title: 'Menu 2~~~~~~',
          description: 'min-w-40',
          searchEnable: true,
          icon: 'create',
          button: {
            position: 'bottom', // top or bottom
            icon: 'create',
            text: 'button',
            clickHandler: null,
            disabled: false,
          },
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
          title: 'Menu 3~~~~~~~~~~~~~~~~',
          titleLineClamp: 2,
          description: 'min-w-40',
        },
        {
          title: 'Menu 4~~~~~~~~~~~~~~~~',
          titleLineClamp: 2,
          description: 'min-w-40 ~~~~~~~~~~~~~',
          descriptionLineClamp: 2,
          labelColor: '#0F7F73',
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
    {
      menuList: [
        {
          title: 'Menu 5',
          description: 'description',
          display: 'block',
          selectable: false,
        },
        {
          title: 'Menu 6~~~~~~~~~~~~~~~~~~~~',
          description: 'description~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
          display: 'block',
        },
        {
          title: 'Menu 7~~~~~~~~~~~~~~~~',
          titleLineClamp: 2,
          display: 'block',
          description: 'description~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
          selectable: false,
          labelColor: '#0F7F73',
        },
        {
          title: 'Menu 8~~~~~~~~~~~~~~~~',
          titleLineClamp: 2,
          display: 'block',
          description: 'description~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
          descriptionLineClamp: 2,
          labelColor: '#0F7F73',
        },
      ],
    },
  ],
}

export const Combination = TemplateMultiLayerMultiSelect.bind({})
Combination.args = {
  selectMode: MULTIPLE,
  menuTree: menuCombination,
}

export const Disabled = TemplateMultiLayerMultiSelect.bind({})
const menuTreeDisabled = {
  width: 'w-60',
  scrollAreaMaxHeight: 'max-h-100',
  blockList: [
    {
      menuList: [
        {
          title: 'Menu 1',
          disabled: true,
          description: 'description',
        },
        {
          title: 'Menu 2',
          disabled: true,
          display: 'block',
          description: 'description',
        },
        {
          title: 'Menu 3',
          disabled: true,
          description:
            'looooooooooooooooooooooooooooooooooooooooong description',
        },
        {
          title: 'Menu 4',
          disabled: true,
          display: 'block',
          description:
            'looooooooooooooooooooooooooooooooooooooooong description',
        },
        {
          title: 'Menu 5',
          disabled: true,
          icon: 'create',
        },
        {
          title: 'Menu 6',
          disabled: true,
          labelColor: '#0F7F73',
        },
        {
          title: 'Menu 7',
          disabled: true,
          thumbnail: 'https://picsum.photos/50',
        },
        {
          title: 'Menu ',
          disabled: true,
          thumbnail: 'https://picsum.photos/50',
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
                  clickHandler: () => {
                    console.log('click handler')
                  },
                  mouseEnterHandler: () => {
                    console.log('mouseEnterHandler handler')
                  },
                  mouseLeaveHandler: () => {
                    console.log('mouseLeaveHandler handler')
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

Disabled.args = {
  selectMode: MULTIPLE,
  menuTree: menuTreeDisabled,
}
