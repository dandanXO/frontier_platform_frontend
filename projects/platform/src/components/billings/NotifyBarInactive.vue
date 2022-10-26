<template lang="pug">
div(
  v-if="isShowInactiveNotifyBar"
  class="w-full h-14 flex justify-between items-center bg-primary-400 pl-12.5 pr-7.5"
)
  div(class="flex items-center text-grey-0")
    f-svg-icon(iconName="warning_amber_round" size="24")
    i18n-t(
      v-if="planStatus.INACTIVE"
      keypath="OO0131"
      tag="h6"
      class="text-h6 ml-3"
      scope="global"
    )
      template(#OO0132)
        span(class="font-bold") {{ $t('OO0132') }}
    h6(v-else-if="planStatus.TRANSITION" class="text-h6 ml-3") {{ $t('OO0058') }}
      span(class="font-bold pl-1") {{ deactivatedDate }}
  div(class="flex items-center")
    f-tag(
      v-permission="FUNC_ID.VISIT_BILLING_PAGE"
      v-if="planStatus.INACTIVE && $route.name !== 'Billings'"
      size="lg"
      @click="goToBillings"
      class="mr-4"
    ) {{ $t('OO0130') }}
    f-svg-icon(
      iconName="clear"
      size="24"
      class="text-grey-0 cursor-pointer"
      @click="isShowInactiveNotifyBar = false"
    )
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import useNavigation from '@/composables/useNavigation.js'
import { FUNC_ID } from '@/utils/constants.js'

export default {
  name: 'NotifyBarInactive',
  setup() {
    const store = useStore()
    const { goToBillings } = useNavigation()

    const isShowInactiveNotifyBar = ref(true)
    const planStatus = computed(() => store.getters['polling/planStatus'])
    const deactivatedDate = computed(
      () => store.getters['polling/plan'].deactivatedDate
    )

    return {
      planStatus,
      deactivatedDate,
      goToBillings,
      isShowInactiveNotifyBar,
      FUNC_ID,
    }
  },
}
</script>
