<template>
  <div
    class="group border px-6 py-4 rounded-2xl border-grey-100-v1 hover:border-green-200-v1 hover:shadow-[0px_0px_0px_2px_var(--Color-Utility-utility-cyan-200,_#8ADDF4)] h-[118px] bg-white flex items-center gap-x-5"
    :class="{ 'opacity-50 pointer-events-none': isDisabled }"
  >
    <div
      :class="[
        'p-5 rounded-full',
        isDisabled
          ? 'bg-grey-50-v1'
          : 'bg-green-50-v1 group-hover:bg-green-100-v1',
      ]"
    >
      <f-svg-icon
        :icon-name="iconName"
        size="24"
        :class="isDisabled ? 'text-grey-400-v1' : 'text-green-500'"
      ></f-svg-icon>
    </div>
    <div class="flex flex-col justify-center min-w-0">
      <!-- Title -->
      <div
        class="text-sm font-normal leading-6 text-grey-600-v1 truncate w-full"
      >
        {{ title }}
      </div>
      <!-- Value -->
      <div class="text-black font-bold leading-[60px] text-[40px]">
        <AnimatedNumber
          v-if="value"
          :end-val="Number(value)"
          :duration="1.5"
          :options="{ separator: ',' }"
        />
        <template v-else>
          {{ formattedValue }}
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AnimatedNumber from '@/components/common/AnimatedNumber.vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number], // Allow both strings and numbers for the value
    required: true,
  },
  iconName: {
    type: String,
    default: 'more', // Default icon if none is provided
  },
})

// Determine disabled state for non-numeric or zero values
const isDisabled = computed(() => {
  const numericValue = Number(props.value)
  return isNaN(numericValue) || numericValue === 0
})

// Standard formatter (up to 1 decimal place)
const standardFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
})

// Compact formatter (for numbers exceeding the length limit)
const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const scientificFormatter = new Intl.NumberFormat('en-US', {
  notation: 'scientific',
  maximumSignificantDigits: 4, // Adjust precision as needed
})

const formattedValue = computed(() => {
  const numericValue = Number(props.value)
  if (isNaN(numericValue) || numericValue === 0) {
    return '0'
  }

  const standardFormatted = standardFormatter.format(numericValue)

  // If standard format fits, use it
  if (standardFormatted.length <= 13) {
    return standardFormatted
  }

  // Standard format is too long, try compact format
  const compactFormatted = compactFormatter.format(numericValue)
  if (compactFormatted.length <= 13) {
    return compactFormatted // Use compact format
  }

  // Compact format is too long, try scientific notation
  const scientificFormatted = scientificFormatter.format(numericValue)
  if (scientificFormatted.length <= 13) {
    return scientificFormatted // Use scientific format
  }

  // Scientific format is *still* too long, show overflow indicator
  return 'Overflow' // Or '...', etc.
})
</script>
