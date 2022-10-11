<template lang="pug">
div
  div(class="flex items-center text-grey-900 mb-6")
    h5(class="text-h5 font-bold") {{ $t("RR0132") }}
    f-popper(placement="top" class="pl-1" showArrow)
      template(#trigger)
        f-svg-icon(iconName="info_outline" class="cursor-pointer" size="14")
      template(#content="{ collapsePopper }")
        div(class="p-5")
          span(class="text-body2 text-cyan-400 underline leading-1.6 cursor-pointer" @click="openModalU3mInstruction(); collapsePopper()") {{ $t("UU0029") }}
  div(class="flex items-center")
    f-button(size="md" type="secondary" :disabled="status !== COMPLETED" @click="openModalViewer") {{ $t("UU0006") }}
    div(v-if="status === U3M_STATUS.COMPLETED" class="inline-flex text-body2 text-cyan-400 gap-2 ml-4")
      span(class="inline-flex items-center underline cursor-pointer" @click="downloadU3m(zipUrl)") {{ $t("EE0081") }}
        f-svg-icon(iconName="u3m_download" size="20")
      span(class="inline-flex items-center underline cursor-pointer" @click="downloadU3m(u3maUrl)") {{ $t("EE0082") }}
        f-svg-icon(iconName="u3m_download" size="20")
  model-editor(
    v-if="showModelEditor"
    :dpi="dpi"
    :u3mPath="u3mSpecUrl"
    :baseImgUrl="baseImgUrl"
    :normalImgUrl="normalImgUrl"
    :roughImgUrl="roughImgUrl"
    :dispImgUrl="dispImgUrl"
    @close="closeModalViewer"
  )
</template>
  
<script setup>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { toRefs, onMounted, onUnmounted, ref } from 'vue'
import { U3M_STATUS } from '@/utils/constants'
import { downloadDataURLFile } from '@/utils/fileOperator'

const props = defineProps({
  isEmbed: {
    type: Boolean,
    default: false
  },
  material: {
    type: Object,
    required: true
  },
  isCanDownloadU3M: {
    type: Boolean,
    default: false
  }
})

const { t } = useI18n()
const store = useStore()
const {
  status,
  zipUrl,
  u3maUrl,
  u3mSpecUrl,
  baseImgUrl,
  normalImgUrl,
  roughImgUrl,
  dispImgUrl,
  dpi,
} = toRefs(props.material.u3m)
const { COMPLETED } = U3M_STATUS
const showModelEditor = ref(false)

const downloadU3m = async (url) => {
  const needCheckTokenStatus = [
    'metafabric.design', // 青望科技
    'bluehope.4pt.tw', // 青望科技 Demo 網域
  ].some(hostname => document.referrer.includes(hostname))

  if (!props.isEmbed) {
    await store.dispatch('user/getUser')
  } else if (needCheckTokenStatus) {
    const status = await store.dispatch('checkTokenStatus', { accessToken: localStorage.getItem('accessToken') })

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
      type: 1,
      header: t('II0003'),
      contentText: t('II0004'),
      primaryBtnText: t('UU0031')
    })
  } else {
    const fileName = url.split('/')[url.split('/').length - 1]
    downloadDataURLFile(url, fileName)
  }
}

const openModalU3mInstruction = () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-u3m-instruction',
    properties: {
      primaryBtnText: t('UU0094'),
      primaryHandler: () => {
        store.dispatch('helper/closeModalBehavior')
      }
    }
  })
}


const openModalViewer = () => {
  showModelEditor.value = true
}

const closeModalViewer = () => {
  showModelEditor.value = false
}

const keyDownHandler = (e) => {
  if (e.key === " ") {
    showModelEditor.value = true
    e.preventDefault()
  }
}

onMounted(() => window.addEventListener("keydown", keyDownHandler))
onUnmounted(() => window.removeEventListener("keydown", keyDownHandler))
</script>
  