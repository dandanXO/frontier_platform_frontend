<template lang="pug">
modal-behavior(
  :header="$t('RR0167')"
  :primaryBtnText="$t('UU0015')"
  :primaryBtnDisabled="targetOgList.length <= 0 || isExceedMaterialStorage"
  @click:primary="submit"
)
  div(class="w-94 relative z-20")
    p(class="pb-3 text-grey-600 text-body2 leading-1.6") {{ $t('RR0180') }}
    f-select-dropdown(
      v-if="crossOrg"
      v-model:selectValue="selectedOrgId"
      :dropdownMenuTree="orgIdMenuTree"
      :label="$t('RR0212')"
      class="mb-3"
    )
    f-select-input(
      v-model:selectValue="targetOgList"
      :label="$t('RR0174')"
      :dropdownMenuTree="ogMenuTree"
      :placeholder="$t('RR0178')"
      :canAddNew="false"
      multiple
    )
    div(class="pt-5.5 grid gap-y-4")
      p(class="font-bold text-caption text-grey-900") {{ $t('RR0175') }}
      div(class="flex")
        p(class="w-21 pt-1 font-bold text-caption text-grey-600") {{ $t('RR0176') }}
        div(class="grid gap-y-1")
          div(class="flex items-center")
            f-svg-icon(iconName="done" size="20" class="text-primary-400")
            p(class="pl-1 text-caption text-grey-900") {{ $t('RR0185') }}
          div(class="flex items-center")
            f-svg-icon(iconName="done" size="20" class="text-primary-400")
            p(class="pl-1 text-caption text-grey-900") {{ $t('RR0184') }}
      div(class="flex")
        p(class="w-21 pt-1 font-bold text-caption text-grey-600") {{ $t('RR0177') }}
        div(class="grid gap-y-1")
          f-input-checkbox(
            binary
            v-model:inputValue="optional.attachment"
            :label="$t('RR0136')"
            iconSize="20"
          )
          f-input-checkbox(
            binary
            v-model:inputValue="optional.u3m"
            :label="$t('RR0132')"
            iconSize="20"
            :disabled="isExceedU3mStorage"
          )
  template(#note)
    div(v-if="isExceedMaterialStorage" class="flex items-center")
      f-svg-icon(iconName="warning_amber_round" class="text-red-400" size="14")
      div(class="text-caption leading-1.6 pl-1.5")
        p(class="text-red-400") {{ $t('WW0090') }}
        p(class="text-cyan-400" @click="goToBillings({ orgNo: selectedOrgNo })") {{ $t('RR0169') }}
    div(v-else-if="isExceedU3mStorage" class="flex items-center")
      f-svg-icon(iconName="error_outline" class="text-grey-600" size="14")
      div(class="text-caption leading-1.6 pl-1.5")
        p(class="text-grey-600") {{ $t('RR0170') }}
        p(class="text-cyan-400" @click="goToBillings({ orgNo: selectedOrgNo })") {{ $t('RR0169') }}
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { NOTIFY_TYPE } from '@/utils/constants'
import type {
  CloneEstimateQuota,
  CloneOption,
  Organization,
  PlanQuota,
  ResSuccessTrue,
  TargetOg,
} from '@frontier/platform-web-sdk'
import { OgType } from '@frontier/platform-web-sdk'
import useNavigation from '@/composables/useNavigation'

export interface PropsModalCloneTo {
  crossOrg?: boolean
  checkHandler: (orgId: number) => Promise<CloneEstimateQuota>
  cloneHandler: (
    targetOgList: TargetOg[],
    optional: CloneOption,
    orgId: number
  ) => Promise<void>
}

const store = useStore()
const { t } = useI18n()
const { goToBillings } = useNavigation()

const props = withDefaults(defineProps<PropsModalCloneTo>(), {
  crossOrg: false,
})

const optional = reactive<CloneOption>({
  u3m: false,
  attachment: false,
})
const estimatedQuota = ref<CloneEstimateQuota>({
  u3m: 0,
  material: 0,
})

const orgList = computed<Organization[]>(
  () => store.getters['user/organizationList']
)
const orgIdMenuTree = computed(() => ({
  width: 'w-94',
  blockList: [
    {
      menuList: orgList.value.map(({ orgName, orgId }) => ({
        title: orgName,
        selectValue: orgId,
      })),
    },
  ],
}))
const ogMenuTree = computed(() => {
  const organization = store.getters[
    'organization/organization'
  ] as Organization
  return {
    blockList: [
      {
        menuList: [
          {
            title: organization.orgName,
            selectValue: {
              ogId: organization.orgId,
              ogType: OgType.ORG,
            },
          },
          ...organization.groupList.map((group) => ({
            title: group.groupName,
            selectValue: {
              ogId: group.groupId,
              ogType: OgType.GROUP,
            },
          })),
        ],
      },
    ],
  }
})
const remainingQuota = computed<PlanQuota>(
  () => store.getters['organization/organization'].plan.quota
)
const selectedOrgId = ref<Organization['orgId']>(
  props.crossOrg ? orgList.value[0]?.orgId : store.getters['organization/orgId']
)
const selectedOrgNo = computed(
  () => orgList.value.find((org) => org.orgId === selectedOrgId.value)?.orgNo
)
const targetOgList = ref<TargetOg[]>([])
const isExceedMaterialStorage = ref(false)
const isExceedU3mStorage = ref(false)

watch(
  () => targetOgList.value.length,
  () => {
    const { used: materialUsed, max: materialMax } =
      remainingQuota.value.material
    isExceedMaterialStorage.value =
      targetOgList.value.length * estimatedQuota.value.material >
      materialMax - materialUsed

    const { used: u3mUsed, max: u3mMax } = remainingQuota.value.u3m
    isExceedU3mStorage.value =
      targetOgList.value.length * estimatedQuota.value.u3m > u3mMax - u3mUsed

    isExceedU3mStorage.value && (optional.u3m = false)
  }
)

watch(
  () => selectedOrgId.value,
  async () => {
    isExceedU3mStorage.value = false
    isExceedMaterialStorage.value = false
    targetOgList.value.length = 0
    await store.dispatch('organization/getOrg', { orgNo: selectedOrgNo.value })
    estimatedQuota.value = await props.checkHandler(selectedOrgId.value)
    if (
      estimatedQuota.value.material >
      remainingQuota.value.material.max - remainingQuota.value.material.used
    ) {
      if (props.crossOrg) {
        isExceedMaterialStorage.value = true
      } else {
        openModalConfirmReachMaterialStorage()
      }
    }
  },
  { immediate: true }
)

const openModalConfirmReachMaterialStorage = () => {
  store.dispatch('helper/openModalConfirm', {
    type: NOTIFY_TYPE.ALERT,
    header: t('RR0168'),
    contentText: t('RR0183', { amount: remainingQuota.value.material.max }),
    primaryBtnText: t('UU0082'),
    secondaryBtnText: t('UU0085'),
    secondaryBtnHandler: () => goToBillings({ orgNo: selectedOrgNo.value }),
  })
}

const submit = async () => {
  try {
    store.dispatch('helper/pushModalLoading')
    await props.cloneHandler(targetOgList.value, optional, selectedOrgId.value)
    store.dispatch('helper/openModalConfirm', {
      type: NOTIFY_TYPE.INFO,
      header: t('RR0162'),
      contentText: t('RR0242'),
      secondaryBtnText: t('UU0094'),
    })
  } catch (error) {
    const code = (error as ResSuccessTrue).code
    store.dispatch('helper/closeModalLoading')

    switch (code) {
      case 'ERR0001':
      case 'ERR0018':
        openModalConfirmReachMaterialStorage()
        break
      case 'ERR0003':
      case 'ERR0021':
        isExceedU3mStorage.value = true
        optional.u3m = false
        break
      default:
        throw error
    }
  }
}
</script>
