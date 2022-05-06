<template lang="pug">
div
  div(class="flex items-center pb-3 text-primary")
    h5(class="text-h5 font-bold") {{ $t("RR0132") }}
    tooltip(placement="top" class="pl-1" :manual="true")
      template(#trigger)
        svg-icon(iconName="info_outline" class="cursor-pointer" size="14")
      template(#content)
        div(class="p-5")
          span(class="text-body2 text-assist-blue underline leading-1.6 cursor-pointer" @click="openModalU3mInstruction") {{ $t("UU0029") }}
  p(class="inline-flex items-center text-body2 text-primary leading-1.6 mr-2.5") {{ $t("EE0017") }} : {{ u3mStatus }}
    tooltip(v-if="status === U3M_STATUS.UNQUALIFIED" placement="top" class="pl-1" :manual="true")
      template(#trigger)
        svg-icon(iconName="info_outline" class="cursor-pointer" size="14")
      template(#content)
        div( class="p-5 leading-1.6") {{ $t("EE0021") }}
    tooltip(v-if="status === U3M_STATUS.FAIL" placement="top" class="pl-1" :manual="true")
      template(#trigger)
        svg-icon(iconName="info_outline" class="cursor-pointer" size="14")
      template(#content)
        div( class="text-body2 p-5 whitespace-nowrap")
          i18n-t(keypath="EE0023" tag="p")
            template(#email)
              span(class="text-assist-blue") {{ $t("RR0139") }}
  div(v-if="status === U3M_STATUS.COMPLETED" class="inline-flex text-body2 text-assist-blue gap-2")
    span(class="inline-flex items-center underline cursor-pointer" @click="downloadU3m(zipUrl)") {{ $t("EE0081") }}
      svg-icon(iconName="u3m_download" size="20")
    span(class="inline-flex items-center underline cursor-pointer" @click="downloadU3m(u3maUrl)") {{ $t("EE0082") }}
      svg-icon(iconName="u3m_download" size="20")
  btn(size="md" class="mt-2.5" @click="handleClick") {{ $t("UU0006") }}
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed, toRefs } from 'vue'
import { U3M_STATUS } from '@/utils/constants'
import { downloadDataURLFile } from '@/utils/fileOperator'

const props = defineProps({
  material: {
    type: Object,
    required: true
  }
})

const { t } = useI18n()
const store = useStore()
const { status, zipUrl, u3maUrl, baseImgUrl, normalImgUrl, dpi } = toRefs(props.material.u3m)

const u3mStatus = computed(() => {
  const { UNQUALIFIED, INITIAL, IN_QUEUE, COMPLETED, PROCESSING, FAIL } = U3M_STATUS
  const statusTextPair = {
    [UNQUALIFIED]: t('EE0020'),
    [INITIAL]: t('EE0019'),
    [IN_QUEUE]: t('PP0004'),
    [PROCESSING]: t('PP0005'),
    [COMPLETED]: t('EE0018'),
    [FAIL]: t('EE0024')
  }

  return statusTextPair[status.value]
})

const downloadU3m = (url) => {
  const fileName = url.split('/')[url.split('/').length - 1]
  downloadDataURLFile(url, fileName)
}

const handleClick = () => {
  status.value === U3M_STATUS.COMPLETED
    ? openModalViewer()
    : store.dispatch('helper/openModalConfirm', {
      type: 1,
      header: t('EE0029'),
      content: t('EE0030'),
      primaryBtnText: t('UU0031')
    })
}

const openModalU3mInstruction = () => {
  store.dispatch('helper/openModal', {
    component: 'modal-u3m-instruction',
    properties: {
      btnText: t('UU0031')
    }
  })
}

const openModalViewer = () => {
  store.dispatch('helper/openModal', {
    component: 'modal-viewer',
    header: t('UU0006'),
    properties: {
      dpi: dpi?.value,
      baseImgUrl: baseImgUrl?.value,
      normalImgUrl: normalImgUrl?.value
    }
  })
}
</script>
