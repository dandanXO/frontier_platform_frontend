<template>
  <thead>
    <tr>
      <th
        v-if="isListPage"
        class="h-12 bg-grey-50 p-3 text-center rounded-tl-md"
      >
        <f-svg-icon class="mx-auto" iconName="drag_indicator" size="20" />
      </th>
      <th
        class="h-12 bg-grey-50 p-3 text-center truncate w-1/12"
        :class="[isListPage ? '' : 'rounded-tl-md']"
      >
        {{ $t('RR0521') }}
      </th>
      <th class="h-12 bg-grey-50 p-3 text-left w-3/12">{{ $t('RR0522') }}</th>
      <th class="h-12 bg-grey-50 p-3 text-left w-4/12">
        {{ isListPage ? $t('RR0523') : $t('RR0542') }}
      </th>
      <th
        class="h-12 bg-grey-50 p-3 text-left w-3/12"
        :class="[isListPage ? '' : 'rounded-tr-md']"
      >
        {{ $t('RR0525') }}
      </th>
      <th
        v-if="isListPage"
        class="h-12 bg-grey-50 p-1 text-left rounded-tr-md w-1/12"
      >
        {{ $t('RR0526') }}
      </th>
    </tr>
  </thead>
</template>

<script lang="ts" setup>
defineProps<{
  isListPage?: boolean
}>()
</script>

<style></style>
