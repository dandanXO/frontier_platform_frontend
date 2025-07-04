<template>
  <div class="flex items-center justify-between">
    <!-- BreadCrumb -->
    <global-breadcrumb-list
      :breadcrumbList="breadcrumbList"
      @click:item="$event?.goTo?.()"
      fontSize="text-h6"
    >
    </global-breadcrumb-list>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import GlobalBreadcrumbList from '@/components/global/GlobalBreadcrumbList.vue' // Assuming path

interface BreadcrumbItem {
  name: string
  path?: string
  goTo?: () => void
  [key: string]: any
}

const props = defineProps<{
  materialItemNo: string | undefined | null
  materialId: number
}>()

const { t } = useI18n()
const { goToAssets, goToAssetMaterialDetail } = useNavigation()

const breadcrumbList = computed<BreadcrumbItem[]>(() => {
  return [
    {
      name: t('RR0008'), // Example key, confirm if this is the correct one
      goTo: () => goToAssets({}, ''),
    },
    {
      name: props.materialItemNo || '',
      goTo: () => goToAssetMaterialDetail({}, props.materialId),
    },
  ]
})
</script>

<style scoped>
/* Styles will be added here if needed */
</style>
