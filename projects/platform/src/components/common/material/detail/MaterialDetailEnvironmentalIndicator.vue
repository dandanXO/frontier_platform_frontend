<template lang="pug">
div(class="flex flex-col")
  f-input-checkbox(
    v-model:inputValue="isShowGraph"
    :label="$t('RR0241')"
    iconSize="20"
    binary
    :disabled="!made2flowSubscribed"
    class="self-end"
  )
  div(class="mt-2 xl:mb-10 relative")
    div(
      class="px-2 xl:px-10 h-10 grid grid-cols-12 gap-x-6 items-center bg-grey-100 text-body2 text-grey-600"
    )
      p(class="col-start-4 col-span-3 text-caption2 xl:text-body2") {{ $t('RR0237') }}
      p(class="col-span-2 text-caption2 xl:text-body2") {{ $t('RR0238') }}
      p(class="col-span-2 text-caption2 xl:text-body2") {{ $t('RR0239') }}
      p(class="col-span-2 text-caption2 xl:text-body2") {{ $t('RR0240') }}

    //- Mask
    div(
      v-if="!isShowGraph"
      class="absolute left-0 top-12 grid grid-cols-12 w-full h-54.5 z-1 pointer-events-none"
    )
      template(v-if="planType.PERSONALIZED || planType.PERSONALIZED_PRO")
      template(v-else-if="planType.STANDARD")
        div(class="col-span-6")
        div(
          class="col-span-6 bg-contain bg-no-repeat flex items-center bg-grey-0"
          :style="{ backgroundImage: `url(${maskHalf})` }"
        )
          div(class="flex flex-col items-center justify-center w-full")
            template(v-if="isInternalMaterial")
              f-svg-icon(iconName="subscribe" size="30" class="mb-3.5 text-grey-900")
              p(class="text-body2 leading-1.6 text-grey-900") {{ $t('VV0050') }}
              p(class="mb-5 text-caption text-grey-600 leading-1.6") {{ $t('VV0051') }}
              f-button(
                size="md"
                type="secondary"
                class="pointer-events-auto"
                @click="viewTheProgram"
              ) {{ $t('UU0116') }}
            template(v-else)
              f-svg-icon(iconName="subscribe" size="30" class="mb-3.5 text-grey-900")
              i18n-t(
                keypath="VV0071"
                scope="global"
                tag="p"
                class="text-center text-body2 leading-1.6 text-grey-900"
              )
                template(#newline)
                  br
      template(v-else)
        div(
          class="col-start-4 col-span-9 bg-contain bg-no-repeat flex items-center bg-grey-0"
          :style="{ backgroundImage: `url(${maskFull})` }"
        )
          div(
            class="w-5/6 mx-auto xl:w-full flex flex-col items-center justify-center w-full"
          )
            template(v-if="isInnerApp")
              f-svg-icon(iconName="subscribe" size="30" class="mb-3.5 text-grey-900")
              p(class="text-body2 leading-1.6 text-grey-900") {{ $t('VV0048') }}
              i18n-t(
                keypath="VV0004"
                scope="global"
                tag="p"
                class="mb-5 text-caption text-grey-600 leading-1.6"
              )
                template(#providerName) {{ $t('M2F040') }}
              f-button(
                size="md"
                type="primary"
                class="pointer-events-auto"
                @click="viewTheProgram"
              ) {{ $t('UU0116') }}
            template(v-else)
              template(v-if="isReceivedShare")
                f-svg-icon(iconName="login" size="30" class="mb-3.5 text-grey-900")
                p(class="text-body2 leading-1.6 text-grey-900") {{ $t('VV0070') }}
                p(class="mb-5 text-caption2 xl:text-caption text-grey-600 leading-1.6") {{ $t('VV0069') }}
                f-button(
                  size="md"
                  type="primary"
                  class="pointer-events-auto"
                  @click="saveReceivedShare"
                ) {{ $t('UU0018') }}
              template(v-else)
                f-svg-icon(iconName="subscribe" size="30" class="mb-3.5 text-grey-900")
                i18n-t(
                  keypath="VV0071"
                  scope="global"
                  tag="p"
                  class="text-center text-body2 leading-1.6 text-grey-900"
                )
                  template(#newline)
                    br

    div(class="pt-2 grid gap-y-1 relative")
      div(
        v-for="property in carbonEmissionInfo"
        :key="property.title"
        class="px-2 xl:px-10 py-4 grid grid-cols-12 gap-x-1 xl:gap-x-6 items-start"
        :class="{ 'hover:bg-grey-100': made2flowSubscribed }"
      )
        div(
          class="col-span-3 h-9.5 flex items-center gap-x-3"
          :class="[made2flowSubscribed ? 'text-grey-900' : 'text-grey-250']"
        )
          f-svg-icon(
            :iconName="property.icon"
            size="32"
            class="!w-4 !h-4 !min-w-4 !min-h-4"
          )
          p(class="text-caption2 xl:text-body2 font-bold") {{ property.title }}
        div(class="col-span-7")
          div(class="h-9.5 grid grid-cols-7 gap-x-6")
            div(class="col-span-3 flex items-center gap-x-1 xl:gap-x-2")
              template(v-if="property.personalized != null")
                div(class="w-2 h-2 rounded-sm bg-primary-400 shrink-0")
                p(class="text-caption2 xl:text-body2 text-grey-900") {{ property.personalized }} {{ property.unitLong }}
              hr(v-else class="w-4 border-grey-250")
            div(class="col-span-2 flex items-center gap-x-2")
              hr(class="w-4 border-grey-250")
            div(class="col-span-2 flex items-center")
              hr(class="w-4 border-grey-250")
          div(v-if="isShowGraph" class="pt-2")
            div(class="relative")
              div(
                class="grid grid-cols-5 h-10 divide-x divide-grey-100 bg-grey-50 border border-grey-100 rounded mb-3.5"
              )
                div(v-for="i in 5" class="relative" :key="i")
                  span(
                    v-if="i === 1"
                    class="absolute -bottom-0.5 translate-y-full left-0 text-caption text-grey-250"
                  ) 0
                  span(
                    class="absolute -bottom-0.5 translate-y-full right-0 text-caption text-grey-250"
                  ) {{ i * 10 }}
              div(
                class="border-0 absolute z-1 left-0 top-3 bg-primary-400 h-1"
                :style="{ width: 100 * (property.personalized / 50) + '%' }"
              )
              div(
                class="border-0 absolute z-2 right-1 top-1 text-primary-500 text-caption"
              ) {{ property.personalized }}
        div(class="col-span-2 h-9.5 flex items-center gap-x-1")
          hr(class="w-4 border-grey-250")
  div(v-if="made2flowSubscribed" class="flex items-center gap-x-4")
    img(src="@/assets/images/m2f_logo.png" class="w-16 h-4.5")
    div(
      v-if="isInnerApp"
      class="flex items-center gap-x-1.5 text-grey-600 cursor-pointer"
      @click="goToAppointment"
    )
      f-svg-icon(iconName="info_outline" size="14")
      p(class="text-caption") {{ $t('UU0078') }}
    p(class="text-caption text-grey-600") {{ $t('RR0066') }}: {{ $dayjs.unix(material.carbonEmission.lastUpdateTime).format('MMM DD, YYYY [at] hh:mm:ss A') }}
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import useMaterial from '@/composables/useMaterial'
import maskFull from '@/assets/images/mask_full.png'
import maskHalf from '@/assets/images/mask_half.jpg'
import {
  VALUE_ADDED_SERVICE_ID,
  MADE2FLOW_PLAN_TYPE,
  useConstants,
} from '@/utils/constants'
import useReceivedShare from '@/composables/useReceivedShare'

const router = useRouter()
const route = useRoute()
const { saveReceivedShare } = useReceivedShare()
const { MADE2FLOW_TAG_LIST } = useConstants()
const props = defineProps({
  material: {
    type: Object,
    required: true,
  },
})

const isShowGraph = ref(false)
const { carbonEmissionInfo } = useMaterial(props.material)

const planType = computed(() => {
  const {
    carbonEmission: { materialOwnerMade2FlowPlanType, viewerMade2FlowPlanType },
  } = props.material
  const { STANDARD, PERSONALIZED, PERSONALIZED_PRO } = MADE2FLOW_PLAN_TYPE
  const maxPlanType = Math.max(
    materialOwnerMade2FlowPlanType,
    viewerMade2FlowPlanType
  )

  return {
    STANDARD: maxPlanType === STANDARD,
    PERSONALIZED: materialOwnerMade2FlowPlanType === PERSONALIZED,
    PERSONALIZED_PRO: materialOwnerMade2FlowPlanType === PERSONALIZED_PRO,
  }
})
const isInnerApp = computed(() => !!route.params.orgNo)
const isReceivedShare = computed(() => route.path.includes('received-share'))
const isInternalMaterial = computed(
  () => route.path.includes('assets') || route.path.includes('workspace')
)
const made2flowSubscribed = computed(
  () =>
    planType.value.STANDARD ||
    planType.value.PERSONALIZED ||
    planType.value.PERSONALIZED_PRO
)

const viewTheProgram = () => {
  router.push({
    name: 'Billings',
    params: { tab: 'value-added-service' },
    query: { service: VALUE_ADDED_SERVICE_ID.MADE2FLOW },
  })
}

const goToAppointment = () => {
  router.push({
    name: 'Billings',
    params: { tab: 'value-added-service' },
    query: {
      service: VALUE_ADDED_SERVICE_ID.MADE2FLOW,
      tagId: MADE2FLOW_TAG_LIST.value.APPOINTMENT.id,
    },
  })
}
</script>
