<template>
  <div
    class="tc-input-container flex flex-col justify-center items-start gap-2 min-w-[328px] max-w-512"
  >
    <label
      v-if="title"
      :class="[
        'tc-title text-black font-sans text-body2 font-bold leading-[1.7]',
        titleHeightClass,
      ]"
    >
      {{ title }}
      <span v-if="required" class="text-red-500-v1">*</span>
    </label>
    <div :class="[inputWrapperClasses, inputWrapperHeightClass]">
      <!-- Phone Number Variant -->
      <template v-if="props.variant === 'phone-number'">
        <FPopper
          class="h-full"
          placement="bottom-start"
          :offset="[0, 8]"
          @expand="isDropdownOpen = true"
          @collapse="isDropdownOpen = false"
        >
          <template #trigger>
            <div
              :class="[
                'tc-label-trigger-section',
                'flex items-center h-full',
                'px-3',
                'cursor-pointer',
                labelPartBorderClass,
              ]"
            >
              <img
                v-if="selectedFlagSrc"
                :src="selectedFlagSrc"
                alt="flag"
                class="w-6 h-4 rounded-sm mr-2"
              />
              <FSvgIcon
                iconName="chevron_down"
                class="w-6 h-6 text-grey-900-v1"
                :class="{ 'rotate-180': isDropdownOpen }"
              />
            </div>
          </template>
          <template #content="{ collapsePopper }">
            <FContextualMenu
              :menuTree="props.menuTree"
              @click:menu="handleMenuSelect($event, collapsePopper)"
              :hideLeadingVisual="false"
            />
          </template>
        </FPopper>
        <input
          :value="modelValue"
          @input="
            $emit(
              'update:modelValue',
              ($event.target as HTMLInputElement).value
            )
          "
          @focus="isFocused = true"
          @blur="isFocused = false"
          :placeholder="placeholder"
          :disabled="disabled"
          :class="[actualInputClasses, 'flex-grow px-3 h-full']"
          type="tel"
        />
      </template>

      <!-- Label Left Variant -->
      <template v-else-if="props.variant === 'Label Left'">
        <FPopper
          class="h-full"
          placement="bottom-start"
          :offset="[0, 8]"
          @expand="isDropdownOpen = true"
          @collapse="isDropdownOpen = false"
        >
          <template #trigger>
            <div
              :class="[
                'tc-label-trigger-section',
                'flex items-center h-full',
                'px-3',
                'cursor-pointer',
                labelPartBorderClass,
              ]"
            >
              <span class="tc-label-side text-grey-700 text-s font-normal">{{
                displayedLabel
              }}</span>
              <FSvgIcon
                iconName="chevron_down"
                class="w-6 h-6 ml-2 text-grey-900-v1"
                :class="{ 'rotate-180': isDropdownOpen }"
              />
            </div>
          </template>
          <template #content="{ collapsePopper }">
            <FContextualMenu
              :menuTree="props.menuTree"
              @click:menu="handleMenuSelect($event, collapsePopper)"
            />
          </template>
        </FPopper>
        <input
          :value="modelValue"
          @input="
            $emit(
              'update:modelValue',
              ($event.target as HTMLInputElement).value
            )
          "
          @focus="isFocused = true"
          @blur="isFocused = false"
          :placeholder="placeholder"
          :disabled="disabled"
          :class="[actualInputClasses, 'flex-grow px-3 h-full']"
          type="text"
        />
      </template>

      <!-- Label Right Variant -->
      <template v-else-if="props.variant === 'Label Right'">
        <input
          :value="modelValue"
          @input="
            $emit(
              'update:modelValue',
              props.inputType === 'number' &&
                !isNaN(parseFloat(($event.target as HTMLInputElement).value))
                ? ($event.target as HTMLInputElement).valueAsNumber
                : ($event.target as HTMLInputElement).value
            )
          "
          @focus="isFocused = true"
          @blur="isFocused = false"
          :placeholder="placeholder"
          :disabled="disabled"
          :class="[actualInputClasses, 'flex-grow px-3 h-full']"
          :type="props.inputType"
        />
        <FPopper
          class="h-full"
          placement="bottom-start"
          :offset="[0, 8]"
          @expand="isDropdownOpen = true"
          @collapse="isDropdownOpen = false"
        >
          <template #trigger>
            <div
              :class="[
                'tc-label-trigger-section',
                'flex items-center h-full',
                'px-3',
                'cursor-pointer',
                labelPartBorderClass,
              ]"
            >
              <span class="tc-label-side text-grey-700 text-s font-normal">{{
                displayedLabel
              }}</span>
              <FSvgIcon
                iconName="chevron_down"
                class="w-6 h-6 ml-2 text-grey-900-v1"
                :class="{ 'rotate-180': isDropdownOpen }"
              />
            </div>
          </template>
          <template #content="{ collapsePopper }">
            <FContextualMenu
              :menuTree="props.menuTree"
              @click:menu="handleMenuSelect($event, collapsePopper)"
            />
          </template>
        </FPopper>
      </template>

      <!-- Other Variants -->
      <template v-else>
        <div
          v-if="props.variant === 'default-left-icon' && props.iconLeft"
          class="icon-wrapper flex items-center h-full pl-3"
        >
          <component
            :is="FSvgIcon"
            :iconName="props.iconLeft"
            class="w-5 h-5 text-grey-900-v1"
          />
        </div>
        <input
          :value="modelValue"
          @input="
            $emit(
              'update:modelValue',
              ($event.target as HTMLInputElement).value
            )
          "
          @focus="isFocused = true"
          @blur="isFocused = false"
          :placeholder="placeholder"
          :disabled="disabled"
          :class="[actualInputClasses, 'flex-grow px-3 h-full']"
          type="text"
        />
        <div
          v-if="props.variant === 'default-right-icon' && props.iconRight"
          class="icon-wrapper flex items-center h-full pr-3"
        >
          <component
            :is="FSvgIcon"
            :iconName="props.iconRight"
            class="w-5 h-5 text-grey-900-v1"
          />
        </div>
        <FButton
          v-if="props.variant === 'default-button'"
          type="primary"
          :size="size === 'small' ? 'sm' : 'md'"
          class="tc-input-button self-center rounded h-8 mr-2"
        >
          <span class="font-bold text-s">{{ buttonText }}</span>
        </FButton>
      </template>
    </div>
    <p
      v-if="description && !negative"
      :class="[
        'tc-description text-grey-600 font-sans text-caption font-normal leading-[1.3]',
        descriptionWarningHeightClass,
      ]"
    >
      {{ description }}
    </p>
    <p
      v-if="description && negative"
      :class="[warningTextClasses, descriptionWarningHeightClass]"
    >
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import {
  FSvgIcon,
  FButton,
  FPopper,
  FContextualMenu,
} from '@frontier/ui-component'
import type { MenuTree } from '@frontier/ui-component/src/types'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  negative: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: 'Input Text',
  },
  inputType: {
    type: String,
    default: 'text', // Allows 'text', 'number', 'password', 'email', etc.
  },
  variant: {
    type: String,
    default: 'default', // 'default', 'default-left-icon', 'default-right-icon', 'default-button', 'Label Left', 'Label Right', 'phone-number'
  },
  iconLeft: {
    type: String,
    default: '',
  },
  iconRight: {
    type: String,
    default: '',
  },
  buttonText: {
    type: String,
    default: 'Button',
  },
  labelLeft: {
    type: String,
    default: 'Label',
  },
  labelRight: {
    type: String,
    default: 'Label',
  },
  menuTree: {
    type: Object as () => MenuTree,
    default: () => ({ blockList: [] } as MenuTree),
  },
  initialSelectedValue: {
    type: [String, Number, Object] as import('vue').PropType<
      string | number | Record<string, unknown> | null
    >,
    default: null,
  },
  size: {
    type: String as import('vue').PropType<'small' | 'medium'>,
    default: 'medium',
    validator: (value: string) => ['small', 'medium'].includes(value),
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'select'])

const isFocused = ref(false)
const isDropdownOpen = ref(false)
const isFilled = computed(() => props.modelValue !== '')
const displayedLabel = ref('')
const selectedFlagSrc = ref<string | null>(null)

watch(
  () => [
    props.variant,
    props.labelLeft,
    props.labelRight,
    props.menuTree,
    props.initialSelectedValue,
  ],
  () => {
    let foundInitial = false
    if (props.initialSelectedValue && props.menuTree?.blockList) {
      for (const block of props.menuTree.blockList) {
        const initialItem = block.menuList?.find(
          (item) => item.selectValue === props.initialSelectedValue
        )
        if (initialItem) {
          if (props.variant === 'phone-number' && initialItem.flag) {
            selectedFlagSrc.value = initialItem.flag
            foundInitial = true
            break
          } else if (
            props.variant === 'Label Left' ||
            props.variant === 'Label Right'
          ) {
            displayedLabel.value =
              initialItem.title || initialItem.selectValue || ''
            foundInitial = true
            break
          }
        }
      }
    }

    if (!foundInitial) {
      if (props.variant === 'Label Left') {
        displayedLabel.value = props.labelLeft
        selectedFlagSrc.value = null
      } else if (props.variant === 'Label Right') {
        displayedLabel.value = props.labelRight
        selectedFlagSrc.value = null
      } else if (props.variant === 'phone-number') {
        displayedLabel.value = ''
        if (props.menuTree?.blockList?.[0]?.menuList?.[0]?.flag) {
          selectedFlagSrc.value = props.menuTree.blockList[0].menuList[0].flag
        } else {
          selectedFlagSrc.value = null
        }
      }
    } else {
      // If initial value was found and processed, ensure other state is reset for clarity
      if (props.variant === 'Label Left' || props.variant === 'Label Right') {
        selectedFlagSrc.value = null
      } else if (props.variant === 'phone-number') {
        displayedLabel.value = ''
      }
    }

    // Default reset if not any of the label/phone variants
    if (
      props.variant !== 'Label Left' &&
      props.variant !== 'Label Right' &&
      props.variant !== 'phone-number'
    ) {
      displayedLabel.value = ''
      selectedFlagSrc.value = null
    }
  },
  { immediate: true, deep: true }
)

const isLabelVariant = computed(() => {
  return (
    props.variant === 'Label Left' ||
    props.variant === 'Label Right' ||
    props.variant === 'phone-number'
  )
})

const toggleDropdown = () => {
  if (isLabelVariant.value) {
    // FPopper handles open/close, this click is on the div
    // If we need to manually trigger, we'd call a method on FPopper ref
  }
}

const handleMenuSelect = (selectedItem: any, collapsePopper: () => void) => {
  if (props.variant === 'phone-number') {
    selectedFlagSrc.value = selectedItem.flag || null // Assuming menu item has a 'flag' property with the URL
  } else if (
    props.variant === 'Label Left' ||
    props.variant === 'Label Right'
  ) {
    displayedLabel.value = selectedItem.title || selectedItem.selectValue || ''
  }
  // Emit modelValue for the text input part if needed, or a different event for the selected label value.
  // For now, the main input's modelValue is separate for phone variant.
  emit('select', selectedItem) // Continue emitting the full selected item for parent component
  collapsePopper()
}

const inputWrapperClasses = computed(() => {
  const classes: string[] = []
  classes.push(
    'self-stretch',
    'rounded',
    'border',
    'flex',
    'items-center'
    // No direct padding (px-3, py-2) or gap here anymore for label variants. Children will handle.
    // py-2 is still needed for non-label variants if their children don't manage all padding.
    // For label variants, children (label section, input section) add py-2.
    // For other variants, the input itself or icon wrappers get padding.
  )

  // State-specific styling for the wrapper (border color, background color, focus ring)
  if (props.disabled) {
    classes.push('border-grey-400', 'cursor-not-allowed')
    classes.push('bg-grey-100-v1')
  } else if (props.negative) {
    classes.push('border-critical-solid', 'bg-white')
    classes.push(
      'focus-within:ring-2',
      'focus-within:ring-red-200',
      'focus-within:outline-none'
    )
  } else {
    classes.push('border-grey-200', 'bg-white')
    classes.push('hover:bg-grey-50-v1')
    classes.push(
      'focus-within:ring-2',
      'focus-within:ring-cyan-200',
      'focus-within:border-grey-200', // Ensure border color consistency on focus
      'focus-within:outline-none'
    )
  }
  return classes.join(' ')
})

const labelPartBorderClass = computed(() => {
  if (props.disabled) {
    return props.variant === 'Label Left' || props.variant === 'phone-number'
      ? 'border-r border-grey-400'
      : 'border-l border-grey-400'
  }
  // The separator should not turn red when in a negative state.
  // It should remain the default border color.
  // The main inputWrapperClasses handles the red outer border for the negative state.
  if (props.negative) {
    return props.variant === 'Label Left' || props.variant === 'phone-number'
      ? 'border-r border-grey-200'
      : 'border-l border-grey-200'
  } // Keep separator default color
  if (isFocused.value && !props.negative) {
    return props.variant === 'Label Left' || props.variant === 'phone-number'
      ? 'border-r border-grey-200'
      : 'border-l border-grey-200'
  }
  return props.variant === 'Label Left' || props.variant === 'phone-number'
    ? 'border-r border-grey-200'
    : 'border-l border-grey-200' // Default
})

const actualInputClasses = computed(() => {
  const classes: string[] = []
  classes.push(
    'flex-grow',
    'bg-transparent',
    'border-none',
    'outline-none',
    'truncate',
    'font-sans',
    'text-body2',
    'font-normal',
    'leading-[1.7]',
    'placeholder:text-grey-600-v1',
    'placeholder-font-normal',
    'placeholder:text-s',
    'disabled:placeholder-grey-400'
  )

  // Text color logic (moved from old inputClasses)
  if (props.disabled) {
    if (isFilled.value) {
      classes.push('text-grey-900')
    } else {
      classes.push('text-grey-400')
    }
  } else if (props.negative) {
    if (isFilled.value) {
      classes.push('text-grey-900')
    } else {
      classes.push('text-grey-600')
    }
  } else {
    // Default (Enabled, not negative, not disabled)
    if (isFocused.value || isFilled.value) {
      // Focused or Filled text should be darker
      classes.push('text-grey-900')
    } else {
      // Empty and not focused
      classes.push('text-grey-600')
    }
  }
  return classes.join(' ')
})

const warningTextClasses = computed(() => {
  return 'text-caption font-normal leading-[1.3] text-critical-text font-sans'
})

const titleHeightClass = computed(() => 'h-6') // 24px
const descriptionWarningHeightClass = computed(() => 'h-4') // 16px

const inputWrapperHeightClass = computed(() => {
  return props.size === 'small' ? 'h-10' : 'h-12' // 40px for small, 48px for medium
})
</script>

<style scoped>
/* Hide spinner/stepper for number inputs in WebKit browsers (Chrome, Safari, Edge) */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0; /* Optional: Sometimes needed to ensure full removal */
}

/* Hide spinner/stepper for number inputs in Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
