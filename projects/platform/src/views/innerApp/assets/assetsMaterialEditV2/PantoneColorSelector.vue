<template>
  <f-input-container :label="t('EE0040')">
    <div class="flex flex-col gap-y-4">
      <f-select-input
        class="w-full"
        :selectValue="pantoneColor"
        @update:selectValue="handlePantoneSelection"
        :dropdownMenuTree="pantoneDropdownMenuTree"
        :placeholder="t('MI0067')"
        :canAddNew="false"
        emit-value
        map-options
        @search="handlePantoneSearch"
      />
      <div class="grid gap-y-3">
        <div
          v-for="pantone in pantoneValueDisplayList"
          :key="pantone.name"
          class="flex items-center gap-x-3"
        >
          <f-tooltip-media
            placement="right-end"
            :pantone="{
              r: pantone.r,
              g: pantone.g,
              b: pantone.b,
            }"
            :tooltipTitle="pantone.name"
            :tooltipMessage="pantone.colorName"
          >
            <template #slot:tooltip-trigger>
              <div
                class="rounded w-5.5 h-5.5"
                :style="{
                  backgroundColor: `rgb(${pantone.r}, ${pantone.g}, ${pantone.b})`,
                }"
              ></div>
            </template>
          </f-tooltip-media>
          <p class="text-body2 text-grey-900">
            {{ pantone.name }}
          </p>
          <f-svg-icon
            iconName="clear"
            size="20"
            class="text-grey-250 cursor-pointer"
            @click="removePantone(pantone.name)"
          />
        </div>
      </div>
    </div>
  </f-input-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FInputContainer from '@frontier/ui-component/src/FInput/FInputContainer/FInputContainer.vue'
import FSelectInput from '@frontier/ui-component/src/FInput/FSelectInput/FSelectInput.vue'
import FSvgIcon from '@frontier/ui-component/src/FSvgIcon/FSvgIcon.vue'
import FTooltipMedia from '@frontier/ui-component/src/FTooltip/FTooltipMedia/FTooltipMedia.vue'

interface Props {
  pantoneValueDisplayList: any[]
  pantoneDropdownMenuTree: any
  removePantone: (pantone: string) => void
  handlePantoneSelection: (value: string) => void
  handlePantoneSearch: (query: string) => void
}

defineProps<Props>()

const { t } = useI18n()

const pantoneColor = ref('')
</script>
