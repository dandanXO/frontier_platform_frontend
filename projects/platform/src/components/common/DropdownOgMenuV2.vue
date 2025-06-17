<template>
  <!-- <f-input-container label="Organization/Group Dropdown Menu"> -->
  <f-popper
    placement="bottom-start"
    data-cy="input-select"
    @expand="handleExpand"
    @collapse="handleCollapse"
  >
    <template #trigger>
      <div
        :class="classMain"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
      >
        <div class="text-xs font-normal text-grey-700-v1">
          {{ $t('RR0573') }}
        </div>
        <div class="text-sm font-bold text-grey-900-v1">
          {{ selectedMenu ? selectedMenu.title : 'Select Organization/Group' }}
        </div>
      </div>
    </template>
    <template #content="{ collapsePopper }">
      <f-contextual-menu
        v-model:inputSelectValue="innerSelectValue"
        :menuTree="menuOrgOrGroup"
        :selectMode="SINGLE_NONE_CANCEL"
        @click:menu="handleSelect($event, collapsePopper)"
        :hideLeadingVisual="true"
        :hideTrailingIcon="true"
      />
    </template>
  </f-popper>
  <!-- </f-input-container> -->
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { OgType, type Organization } from '@frontier/platform-web-sdk'
import { CONTEXTUAL_MENU_MODE } from '@frontier/ui-component/src/constants'

// Importing necessary components
import FPopper from '@frontier/ui-component/src/FPopper/FPopper.vue'
import FContextualMenu from '@frontier/ui-component/src/FContextualMenu/FContextualMenu.vue'
// Import useInput to achieve similar focus/hover/error states as in FSelectDropdown.vue
import useInput from '@frontier/ui-component/src/FInput/useInput'
import { ROLE_ID } from '../../utils/constants'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ selectValue: string }>()
const emit = defineEmits<{
  (e: 'update:selectValue', value: string): void
  (e: 'select', ogKey: string): void
}>()

const { SINGLE_NONE_CANCEL } = CONTEXTUAL_MENU_MODE
const { t } = useI18n()
const store = useStore()
const organization = computed(
  () =>
    store.getters['organization/organization'] as Organization & {
      orgUser?: { orgRoleId?: number }
    }
)
const user = computed(() => store.getters['user/user'])

const menuOrgOrGroup = computed(() => {
  const { orgId, orgName, labelColor, orgUser, groupList } = organization.value
  const infoText = t('RR0572')

  return {
    width: 'w-auto max-w-75',
    blockList: [
      {
        menuList: [
          {
            title: orgName,
            tooltipTitle: `${
              orgUser?.orgRoleId === ROLE_ID.GUEST ? infoText : ''
            }`,
            selectValue: `${OgType.ORG}-${orgId}`,
            labelColor,
            disabled: orgUser?.orgRoleId === ROLE_ID.GUEST,
          },
          ...groupList.map((group) => {
            const { groupId, groupName, labelColor } = group

            const roleId = user.value.organizationList
              ?.find((org: any) => org?.orgId === orgId)
              ?.groupList?.find(
                (gr: any) => gr?.groupId === groupId
              )?.groupRoleId

            return {
              title: groupName,
              tooltipTitle: `${roleId === ROLE_ID.GUEST ? infoText : ''}`,
              selectValue: `${OgType.GROUP}-${groupId}`,
              labelColor,
              disabled: roleId === ROLE_ID.GUEST,
            }
          }),
        ],
      },
    ],
  }
})

// Two‑way binding for select value
const innerSelectValue = computed({
  get: () => props.selectValue,
  set: (value: string) => {
    emit('update:selectValue', value)
    emit('select', value)
  },
})

const selectedMenu = computed(() => {
  const list = menuOrgOrGroup.value.blockList[0]?.menuList || []
  return (
    list.find((menu) => menu.selectValue === innerSelectValue.value) || null
  )
})

// Set up focus/hover state via useInput
const { isHover, isFocus, state, STATE, classTransition } = useInput({
  slots: {},
  inputValue: innerSelectValue,
})

// Create computed property that builds the class list
const classMain = computed(() => {
  const classList = [
    'flex',
    'flex-col',
    'px-3',
    'py-2',
    'border',
    'rounded',
    'cursor-pointer',
    ...(classTransition.value || []),
  ]
  switch (state.value) {
    case STATE.FOCUS:
      classList.push(
        'shadow-[0_0_0_2px_#8ADDF4]',
        'border-grey-200',
        'bg-grey-100'
      )
      break
    case STATE.HOVER:
      classList.push('border-grey-250', 'bg-grey-50')
      break
    case STATE.DISABLED:
      classList.push('border-grey-200', 'cursor-not-allowed', 'bg-grey-50')
      break
    default:
      classList.push('border-grey-200', 'bg-grey-0')
  }
  return classList
})

// Handle popper expand/collapse to update focus state
function handleExpand() {
  isFocus.value = true
}
function handleCollapse() {
  isFocus.value = false
}

function handleSelect(value: any, collapsePopper: () => void) {
  const newValue =
    typeof value === 'object' && value !== null ? value.selectValue : value
  innerSelectValue.value = newValue
  collapsePopper()
}
</script>
