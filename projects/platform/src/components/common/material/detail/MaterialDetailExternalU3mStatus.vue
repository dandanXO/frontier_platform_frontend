<template lang="pug">
div
  div(class="flex items-center text-grey-900 mb-6")
    h5(class="text-h5 font-bold") {{ $t('RR0132') }}
    f-popper(placement="top" class="pl-1" showArrow)
      template(#trigger)
        f-svg-icon(iconName="info_outline" class="cursor-pointer" size="14")
      template(#content="{ collapsePopper }")
        div(class="p-5 bg-grey-0 shadow-4 rounded")
          span(
            class="text-body2 text-cyan-400 underline leading-1.6 cursor-pointer"
            @click="openModalU3mInstruction(); collapsePopper()"
          ) {{ $t('UU0029') }}
  div(class="flex items-center")
    f-button(
      size="md"
      type="secondary"
      :disabled="status !== COMPLETED"
      @click="openModalModelEditor"
    ) {{ $t('UU0006') }}
    material-u3m-files(:material="material" :download-u3m="downloadU3m")
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed } from 'vue'
import MaterialU3mFiles from '@/components/common/material/u3m/MaterialU3mFiles.vue'
import useModelEditor from '@/composables/useModelEditor'
import useDashboard from '@/composables/useDashboard'
import { U3M_STATUS, NOTIFY_TYPE } from '@/utils/constants'
import { downloadDataURLFile } from '@/utils/fileOperator'

const props = defineProps({
  isEmbed: {
    type: Boolean,
    default: false,
  },
  material: {
    type: Object,
    required: true,
  },
  isCanDownloadU3M: {
    type: Boolean,
    default: false,
  },
})

const material = computed(() => props.material)
const status = computed(() => material.value.u3m.status)

const { t } = useI18n()
const store = useStore()
const { openModalModelEditor } = useModelEditor(material)
const dashboard = useDashboard()
const { COMPLETED } = U3M_STATUS

const downloadU3m = async (item) => {
  const { url, format } = item
  const needCheckTokenStatus = [
    'metafabric.design', // 青望科技
    'bluehope.4pt.tw', // 青望科技 Demo 網域
  ].some((hostname) => document.referrer.includes(hostname))

  if (!props.isEmbed) {
    await store.dispatch('user/getUser')
  } else if (needCheckTokenStatus) {
    const status = await store.dispatch('checkTokenStatus', {
      accessToken: localStorage.getItem('accessToken'),
    })

    if (status === 1) {
      parent.postMessage({ error: 'Unauthorized' }, document.referrer)
      return
    } else if (status === 2) {
      parent.postMessage({ error: 'Unverified' }, document.referrer)
      return
    }
  }

  if (!props.isCanDownloadU3M) {
    store.dispatch('helper/openModalConfirm', {
      type: NOTIFY_TYPE.WARNING,
      header: t('II0003'),
      contentText: t('II0004'),
      primaryBtnText: t('UU0031'),
    })
  } else {
    const fileName = url.split('/')[url.split('/').length - 1]
    downloadDataURLFile(url, fileName)
    dashboard.createDownloadLog(material.value.materialId, format)
  }
}

const openModalU3mInstruction = () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-u3m-instruction',
    properties: {
      primaryBtnText: t('UU0094'),
      primaryHandler: () => {
        store.dispatch('helper/closeModalBehavior')
      },
    },
  })
}
</script>
