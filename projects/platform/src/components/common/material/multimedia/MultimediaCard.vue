<template lang="pug">
material-file-card(
  :thumbnailUrl="props.thumbnailUrl"
  :originalUrl="props.originalUrl"
  :extension="props.extension"
  :displayFileName="props.displayFileName"
  :menuTree="props.menuTree"
)
  div(class="flex flex-row gap-x-1 p-1 ml-1 mb-1" :class="[props.canStar && imageFileType.includes(props.extension) ? 'rounded-md bg-grey-100/40: hover:bg-primary-100/40' : '']")
    f-svg-icon(
      v-if="props.canStar && imageFileType.includes(props.extension) && props.isCover"
      class="text-primary-400 cursor-pointer"
      iconName="star_solid"
      size="18"
      :tooltipMessage="$t('MI0115')"
      @click.stop="emits('setCover')"
    )
    f-svg-icon(
      v-if="props.canStar && imageFileType.includes(props.extension) && !props.isCover"
      class="text-grey-400 cursor-pointer hover:text-primary-400"
      iconName="star"
      size="18"
      :tooltipMessage="$t('MI0115')"
      @click.stop="emits('setCover')"
    )
</template>

<script setup lang="ts">
import MaterialFileCard from '../file/MaterialFileCard.vue'
import type { MenuTree } from '@frontier/ui-component'
import { Extension } from '@frontier/platform-web-sdk'

const props = withDefaults(
  defineProps<{
    isCover: boolean
    thumbnailUrl: string | null
    originalUrl: string | null
    extension: Extension
    displayFileName: string
    menuTree: MenuTree
    canStar?: boolean
  }>(), 
  {
    canStar: true
  }
)

const emits = defineEmits<{
  (e: 'setCover'): void
  (e: 'edit'): void
}>()

const { PNG, JPEG, JPG } = Extension
const imageFileType = [PNG, JPEG, JPG] as Extension[]
</script>
