<template lang="pug">
div
  div(class="mx-auto w-230 h-fit pb-25")
    material-detail-external-header(
      :breadcrumbList="breadcrumbList"
      :material="material"
      @clone="shareToMeCloneByMaterial(nodeKey, sharingId, share.isCanClone)"
    )
      template(#action-list)
        div(class="relative cursor-pointer ml-3" @click="openModalShareMessage")
          f-svg-icon(iconName="chat" size="24" class="text-grey-600")
          div(
            v-if="haveMsgAndFirstRead"
            class="absolute -top-px -right-px w-2 h-2 rounded-full border border-grey-0 bg-red-400"
          )
      template(#caption)
        div(class="text-caption text-grey-600 flex items-center")
          p(class="pr-2.5") {{ share.displayName }}
          p {{ $t('RR0148') }} {{ toYYYYMMDDFormat(share.shareDate) }}
    material-detail-external(
      :material="material"
      :isCanDownloadU3M="share.isCanDownloadU3M"
    )
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import useShareToMe from '@/composables/useShareToMe'
import MaterialDetailExternal from '@/components/common/material/detail/MaterialDetailExternal.vue'
import MaterialDetailExternalHeader from '@/components/common/material/detail/MaterialDetailExternalHeader.vue'
import { toYYYYMMDDFormat } from '@frontier/lib'

const props = defineProps({
  nodeKey: {
    type: String,
    required: true,
  },
})

const { t } = useI18n()
const store = useStore()
const route = useRoute()
const { parsePath, prefixPath } = useNavigation()
const { shareToMeCloneByMaterial } = useShareToMe()
const sharingId = ref(route.query.sharingId)

await store.dispatch('shareToMe/getShareToMeMaterial', {
  nodeKey: props.nodeKey,
  sharingId: sharingId.value,
  rank: Number(route.query.rank),
})

const material = computed(() => store.getters['shareToMe/material'])
const share = computed(() => store.getters['shareToMe/materialShare'])
const breadcrumbList = computed(() => {
  return [
    {
      name: t('RR0010'),
      path: parsePath(`${prefixPath.value}/share-to-me`),
    },
    ...store.getters['shareToMe/materialBreadcrumbList'].map(
      ({ name, nodeKey }, index, array) => {
        if (index !== array.length - 1) {
          return {
            name,
            path: parsePath(
              `${prefixPath.value}/share-to-me/${nodeKey}?sharingId=${sharingId.value}`
            ),
          }
        } else {
          return {
            name: material.value.materialNo,
            path: parsePath(
              `${prefixPath.value}/share-to-me/material/${nodeKey}?sharingId=${sharingId.value}`
            ),
          }
        }
      }
    ),
  ]
})
const isFirstTime = ref(true)
const haveMsgAndFirstRead = computed(
  () => !!share.value?.message && isFirstTime.value
)

const openModalShareMessage = () => {
  isFirstTime.value = false
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-share-message',
    properties: {
      message: share.value.message,
    },
  })
}
</script>
