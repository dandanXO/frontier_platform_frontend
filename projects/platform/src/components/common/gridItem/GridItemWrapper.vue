<template lang="pug">
div(@mouseenter="isHover = true" @mouseleave="isHover = false" class="relative")
  div(class="w-full aspect-square relative")
    div(
      v-if="isSelectable && (!selectOnHover || isHover || haveSelectedMoreThanOne)"
      class="absolute z-10 top-0 left-0 w-full h-11"
    )
      div(class="bg-linear w-full h-full rounded-t-md")
      f-input-checkbox#input-checkbox(
        v-if="isMultiSelect && Array.isArray(innerSelectedValue)"
        v-model:inputValue="innerSelectedValue"
        :value="selectValue"
        iconSize="24"
        class="absolute top-3 left-3"
        iconColor="text-grey-0"
        uncheckColor="text-grey-0"
        @click.stop
      )
      f-input-radio#input-radio(
        v-else
        v-model:inputValue="innerSelectedValue"
        :value="selectValue"
        iconSize="20"
        class="absolute top-3 left-3"
        checkColor="text-grey-0"
        uncheckColor="text-grey-0"
        @click.stop
      )
    div(
      v-if="(cornerTopRightHover && isHover) || !cornerTopRightHover"
      class="absolute z-10 top-3 right-3"
      @click.stop
    )
      slot(name="corner-top-right" :isHover="isHover")
    div(v-if="isHover" class="absolute z-10 bottom-3 left-3")
      slot(name="corner-bottom-left")
    f-popper(
      v-if="optionList && optionList.length > 0 && !haveSelectedMoreThanOne"
      placement="right-start"
      class="absolute z-10 bottom-3 right-3 cursor-pointer"
      :class="[isHover ? 'visible' : 'invisible']"
      @click.stop
    )
      template(#trigger)
        f-svg-icon(
          iconName="more_vert"
          size="20"
          class="text-grey-0 hover:text-grey-100"
          :tooltipMessage="$t('RR0260')"
        )
      template(#content="{ collapsePopper }")
        f-contextual-menu(:menuTree="menuTree" @click:menu="collapsePopper")
    slot(name="content")
    div(
      v-if="isHover"
      class="absolute inset-0 w-full h-full bg-grey-900/70 rounded-md flex justify-center items-center"
    )
      slot(name="hover-content")
  div(class="text-caption font-bold mt-2 flex items-center justify-between text-grey-900")
    p(class="line-clamp-1 !break-all")
      slot(name="title" :isHover="isHover")
    slot(name="title-right-icon")
  slot(name="caption")
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FunctionOption } from '@/types'
import type { MenuTree } from '@frontier/ui-component'

const props = withDefaults(
  defineProps<{
    /**
     * false 時不用 hover 就可以選取
     */
    selectOnHover?: boolean
    isMultiSelect?: boolean
    isSelectable?: boolean
    /**
     * 選取時要儲存的值，如果 isSelectable 為 false，則為 undefined
     */
    selectValue?: any
    /**
     * 用於綁定在 input-checkbox 或 input radio 儲存 selectValue 的變數
     * isMultiSelect 為 true 時，selectValue 為 Array
     * 如果 isSelectable 為 false，則為 undefined
     */
    selectedValue?: Array<any> | any
    optionList?: Array<Array<FunctionOption<any>>>
    cornerTopRightHover?: boolean
  }>(),
  {
    isSelectable: false,
    selectOnHover: true,
    isMultiSelect: true,
    cornerTopRightHover: true,
  }
)

const emit = defineEmits<{
  (e: 'update:selectedValue', v: Array<any> | string | object): void
}>()
const isHover = ref(false)

const innerSelectedValue = computed({
  get: () => props.selectedValue,
  set: (v) => emit('update:selectedValue', v),
})

const haveSelectedMoreThanOne = computed(
  () =>
    props.isSelectable &&
    props.isMultiSelect &&
    Array.isArray(props.selectedValue) &&
    props.selectedValue.length > 0
)

const menuTree = computed<MenuTree>(() => ({
  blockList:
    props.optionList?.map((block) => ({
      menuList: block.map((option) => ({
        title: option.name(props.selectValue),
        clickHandler: () => option.func(props.selectValue),
        disabled: option.disabled ? option.disabled(props.selectValue) : false,
        testId: option.testId
      })),
    })) ?? [],
}))
</script>
