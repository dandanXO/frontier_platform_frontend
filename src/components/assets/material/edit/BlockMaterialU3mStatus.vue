<template lang="pug">
div
  div(class="flex items-center pb-3 text-primary")
    h5(class="text-h5 font-bold") {{ $t('RR0132') }}
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
  btn(size="md" class="mt-2.5" :disabled="disabledCreate" @click="handleClick") {{ btnText }}
</template>

<script>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed, toRefs } from 'vue'
import { U3M_STATUS } from '@/utils/constants'
import useAssets from '@/composables/useAssets'
import { downloadDataURLFile } from '@/utils/fileOperator'

export default {
  name: 'BlockMaterialInternalU3mStatus',
  props: {
    material: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const { t } = useI18n()
    const store = useStore()
    const { create3DMaterial } = useAssets()
    const { status, zipUrl, u3maUrl } = toRefs(props.material.u3m)
    const { UNQUALIFIED, INITIAL, PROCESSING, COMPLETED, FAIL } = U3M_STATUS

    const u3mStatus = computed(() => {
      const statusTextPair = {
        [UNQUALIFIED]: t('EE0020'),
        [INITIAL]: t('EE0019'),
        [PROCESSING]: t('EE0022'),
        [COMPLETED]: t('EE0018'),
        [FAIL]: t('EE0024')
      }

      return statusTextPair[status.value]
    })

    const btnText = computed(() => [COMPLETED, FAIL].includes(status.value) ? t('UU0030') : t('UU0020'))
    const disabledCreate = computed(() => [UNQUALIFIED, PROCESSING, FAIL].includes(status.value))

    const downloadU3m = async (url) => {
      const fileName = url.split('/')[url.split('/').length - 1]
      downloadDataURLFile(url, fileName)
    }

    const handleClick = () => {
      create3DMaterial.func(props.material)
    }

    const openModalU3mInstruction = () => {
      const status = props.material.u3m.status
      let btnText = t('UU0031')
      let btnClickHandler
      if (status === U3M_STATUS.UNQUALIFIED) {
        btnText = t('UU0032')
        btnClickHandler = () => {
          store.dispatch('helper/replaceModal', {
            component: 'modal-how-to-scan',
            header: t('DD0043'),
            properties: {
              materialList: [props.material]
            }
          })
        }
      } else if (status === U3M_STATUS.INITIAL) {
        btnText = t('UU0020')
        btnClickHandler = () => {
          store.dispatch('helper/replaceModal', {
            component: 'modal-u3m-preview',
            header: t('EE0067')
          })
        }
      }

      store.dispatch('helper/openModal', {
        component: 'modal-u3m-instruction',
        properties: {
          btnText,
          btnClickHandler
        }
      })
    }

    return {
      status,
      U3M_STATUS,
      btnText,
      u3mStatus,
      zipUrl,
      u3maUrl,
      disabledCreate,
      downloadU3m,
      handleClick,
      openModalU3mInstruction
    }
  }
}
</script>
