<template lang="pug">
modal-behavior(
  :header="$t('RR0167')"
  :primaryBtnText="$t('UU0015')"
  :primaryBtnDisabled="selectedLocationList.length <= 0 || isExceedMaterialStorage"
  @click:primary="submit"
)
  div(class="w-94 relative z-20")
    p(class="pb-3 text-grey-600 text-body2 leading-1.6") {{ $t("RR0180") }}
    f-input-select(
      v-if="crossOrg"
      v-model:selectValue="selectedOrgId"
      :optionList="orgList"
      keyOptionDisplay="orgName"
      keyOptionValue="orgId"
      :label="$t('RR0212')"
      class="mb-3"
    )
    f-input-chips(
      v-model:chips="selectedLocationList"
      :label="$t('RR0174')"
      :optionList="locationList"
      :placeholder="$t('RR0178')"
      keyOptionDisplay="name"
    )
    div(class="pt-5.5 grid gap-y-4")
      p(class="font-bold text-caption text-grey-900") {{ $t("RR0175") }}
      div(class="flex")
        p(class="w-21 pt-1 font-bold text-caption text-grey-600") {{ $t("RR0176") }}
        div(class="grid gap-y-1")
          div(class="flex items-center")
            f-svg-icon(iconName="done" size="20" class="text-primary-400")
            p(class="pl-1 text-caption text-grey-900") {{ $t("RR0185") }}
          div(class="flex items-center")
            f-svg-icon(iconName="done" size="20" class="text-primary-400")
            p(class="pl-1 text-caption text-grey-900") {{ $t("RR0184") }}
      div(class="flex")
        p(class="w-21 pt-1 font-bold text-caption text-grey-600") {{ $t("RR0177") }}
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
        p(class="text-red-400") {{ $t("WW0090") }}
        p(class="text-cyan-400" @click="goToBillings") {{ $t("RR0169") }}
    div(v-else-if="isExceedU3mStorage" class="flex items-center")
      f-svg-icon(iconName="error_outline" class="text-grey-600" size="14")
      div(class="text-caption leading-1.6 pl-1.5")
        p(class="text-grey-600") {{ $t("RR0170") }}
        p(class="text-cyan-400" @click="goToBillings") {{ $t("RR0169") }}
</template>

<script setup>
import { ref, reactive, computed, watch, shallowRef, h } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { TARGET_LOCATION } from '@/utils/constants'
import { useRouter } from 'vue-router'

const store = useStore()
const { t } = useI18n()
const router = useRouter()

const props = defineProps({
  crossOrg: {
    type: Boolean,
    default: false
  },
  checkHandler: {
    type: Function,
    required: true
  },
  cloneHandler: {
    type: Function,
    required: true
  }
})

const optional = reactive({
  u3m: false,
  attachment: false
})
const estimatedQuota = ref({
  u3m: 0,
  material: 0
})

const orgList = computed(() => store.getters['user/organizationList'])
const locationList = computed(() => {
  const organization = store.getters['organization/organization']
  return [
    {
      id: organization.orgId,
      name: organization.orgName,
      location: TARGET_LOCATION.ORG
    },
    ...organization.groupList.map(group => ({
      id: group.groupId,
      name: group.groupName,
      location: TARGET_LOCATION.GROUP
    }))
  ]
})
const remainingQuota = computed(() => store.getters['polling/plan'].quota)
const selectedOrgId = ref(props.crossOrg ? orgList.value[0]?.orgId || null : store.getters['organization/orgId'])
const selectedOrgNo = computed(() => orgList.value.find(org => org.orgId === selectedOrgId.value)?.orgNo)
const selectedLocationList = ref([])
const isExceedMaterialStorage = ref(false)
const isExceedU3mStorage = ref(false)

watch(
  () => selectedLocationList.value.length,
  () => {
    const { materialUsed, materialMax } = remainingQuota.value.material
    isExceedMaterialStorage.value = selectedLocationList.value.length * estimatedQuota.value.material > (materialMax - materialUsed)

    const { u3mUsed, u3mMax } = remainingQuota.value.u3m
    isExceedU3mStorage.value = selectedLocationList.value.length * estimatedQuota.value.u3m > (u3mMax - u3mUsed)

    isExceedU3mStorage.value && (optional.u3m = false)
  }
)


watch(
  () => selectedOrgId.value,
  async () => {
    isExceedU3mStorage.value = false
    isExceedMaterialStorage.value = false
    selectedLocationList.value.length = 0
    await store.dispatch('organization/getOrg', { orgNo: selectedOrgNo.value })
    if (1 * estimatedQuota.value.material > (remainingQuota.value.material.max - remainingQuota.value.material.used)) {
      if (props.crossOrg) {
        isExceedMaterialStorage.value = true
      } else {
        openModalConfirmReachMaterialStorage()
      }
    }
  }
)

const goToBillings = () => {
  router.push(`/${selectedOrgNo.value}/billings/plan`)
}

const openModalConfirmReachMaterialStorage = () => {
  store.dispatch('helper/openModalConfirm', {
    type: 3,
    header: t('RR0168'),
    contentText: t('RR0183', { amount: remainingQuota.value.material.max }),
    primaryBtnText: t('UU0082'),
    secondaryBtnText: t('UU0085'),
    secondaryBtnHandler: goToBillings
  })
}

const submit = async () => {
  const targetLocationList = selectedLocationList.value.map(({ id, location }) => ({ id, location }))
  try {
    store.dispatch('helper/pushModalLoading')
    await props.cloneHandler(targetLocationList, optional, selectedOrgId.value)
    store.dispatch('helper/openModalConfirm', {
      type: 0,
      header: t('RR0162'),
      contentText: t('RR0242'),
      secondaryBtnText: t('UU0094')
    })
  } catch (error) {
    const { code } = error
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

await store.dispatch('organization/getOrg', { orgNo: selectedOrgNo.value })
estimatedQuota.value = await props.checkHandler(selectedOrgId.value)
if (1 * estimatedQuota.value.material > (remainingQuota.value.material.max - remainingQuota.value.material.used)) {
  if (props.crossOrg) {
    isExceedMaterialStorage.value = true
  } else {
    openModalConfirmReachMaterialStorage()
  }
}

</script>
