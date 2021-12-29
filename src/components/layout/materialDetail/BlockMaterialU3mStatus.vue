<template lang="pug">
div
  div(class="flex items-center pb-3 text-primary")
    h5(class="text-h5 font-bold") {{$t('RR0132')}}
    tooltip(v-if="!isExternal" placement="top" class="pl-1" :manual='true')
      template(#trigger)
        svg-icon(iconName="info_outline" class='cursor-pointer' size="14")
      template(#content)
        div(class="p-5")
          span(class="text-body2 text-assist-blue underline line-height-1.6 cursor-pointer" @click="openModalU3mInstruction") {{$t('UU0029')}}
  p(v-if="!isExternal" class="inline-flex items-center text-body2 text-primary line-height-1.6 mr-2.5") {{$t('EE0017')}} : {{u3mStatus}}
    tooltip(v-if="status === U3M_STATUS.UNQUALIFIED" placement="top" class="pl-1" :manual='true')
      template(#trigger)
        svg-icon(iconName="info_outline" class='cursor-pointer' size="14")
      template(#content)
        div( class="p-5 line-height-1.6") {{$t('EE0021')}}
    tooltip(v-if="status === U3M_STATUS.FAIL" placement="top" class="pl-1" :manual='true')
      template(#trigger)
        svg-icon(iconName="info_outline" class='cursor-pointer' size="14")
      template(#content)
        div( class="text-body2 p-5 whitespace-nowrap")
          i18n-t(keypath="EE0023" tag="p")
            template(#email)
              span(class="text-assist-blue") {{$t("RR0139")}}
  div(v-if="status === U3M_STATUS.COMPLETED" class="inline-flex text-body2 text-assist-blue gap-2")
    span(class="inline-flex items-center underline cursor-pointer" @click="downloadU3m(zipUrl)") {{$t('EE0081')}}
      svg-icon(iconName="u3m_download" size="20")
    span(class="inline-flex items-center underline cursor-pointer" @click="downloadU3m(u3maUrl)") {{$t('EE0082')}}
      svg-icon(iconName="u3m_download" size="20")
  btn(size="md" class="mt-2.5" :disabled="disabledCreate" @click="handleClick") {{btnText}}
</template>

<script>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed, toRefs } from 'vue'
import { U3M_STATUS } from '@/utils/constants'
import useAssets from '@/composables/useAssets'
import { downloadDataURLFile } from '@/utils/fileOperator'

export default {
  name: 'BlockMaterialU3mStatus',
  props: {
    locationId: {
      type: String,
      validator: (value) => {
        return [
          'MaterialDetailInternal',
          'MaterialDetailExternal',
          'AssetsMaterialEdit'
        ].includes(value)
      },
      required: true
    },
    material: {
      type: Object,
      required: true
    },
    isCanDownloadU3M: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const { t } = useI18n()
    const store = useStore()
    const { create3DMaterial } = useAssets()
    const { status, zipUrl, u3maUrl, baseImgUrl, normalImgUrl } = toRefs(props.material.u3m)
    const { UNQUALIFIED, INITIAL, PROCESSING, COMPLETED, FAIL } = U3M_STATUS
    const showCreateBtn = props.locationId === 'AssetsMaterialEdit'
    const isExternal = props.locationId === 'MaterialDetailExternal'

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

    const btnText = computed(() => {
      const reCreateList = [COMPLETED, FAIL]
      if (showCreateBtn) {
        return reCreateList.includes(status.value) ? t('UU0030') : t('UU0020')
      } else {
        return t('UU0006')
      }
    })

    const disabledCreate = computed(() => {
      const disableCreateList = [UNQUALIFIED, PROCESSING, FAIL]
      if (showCreateBtn) {
        return disableCreateList.includes(status.value)
      } else {
        return false
      }
    })

    const downloadU3m = (url) => {
      if (isExternal && !props.isCanDownloadU3M) {
        store.dispatch('helper/openModalConfirm', {
          title: t('II0003'),
          content: t('II0004'),
          primaryText: t('UU0031')
        })
      } else {
        const fileName = url.split('/')[url.split('/').length - 1]
        downloadDataURLFile(url, fileName)
      }
    }

    const handleClick = () => {
      if (showCreateBtn) {
        create3DMaterial.func(props.material)
      } else {
        status.value === COMPLETED
          ? openModalViewer()
          : store.dispatch('helper/openModalConfirm', {
            title: isExternal ? t('II0005') : t('EE0029'),
            content: isExternal ? t('II0006') : t('EE0030'),
            primaryText: t('UU0031')
          })
      }
    }

    const openModalU3mInstruction = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-u3m-instruction',
        properties: {
          isAllowCreate: props.locationId === 'AssetsMaterialEdit'
        }
      })
    }

    const openModalViewer = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-viewer',
        properties: {
          baseImgUrl: baseImgUrl.value,
          normalImgUrl: normalImgUrl.value
        }
      })
    }

    return {
      status,
      U3M_STATUS,
      isExternal,
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
