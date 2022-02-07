<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(class="w-230 h-fit pb-25")
    breadcrumb(class="pt-12 pb-9" :breadcrumbList="breadcrumbList" @click:item="$router.push($event.path)")
    div(class="pb-7.5")
      div(class="flex items-center pb-2")
        h5(class="text-h5 text-primary font-bold line-clamp-1 pr-3") {{`${material.materialNo} ${material.description}`}}
        tooltip(placement="bottom")
          template(#trigger)
            svg-icon(iconName="clone" class="text-black-700 cursor-pointer hover:text-brand" size="24" @click="cloneNode.func(nodeKey, share.value.isCanClone)")
          template(#content)
            p(class="text-caption text-primary px-3 py-1") {{$t('RR0056')}}
        div(class="relative cursor-pointer ml-3" @click="openModalShareMessage")
          svg-icon(iconName="chat" size="24" class="text-black-700")
          div(v-if="haveMsgAndFirstRead" class="absolute -top-px -right-px w-2 h-2 rounded-full border border-black-0 bg-warn")
      div(class="text-caption text-black-700 flex items-center")
        p(class="pr-2.5") {{share.displayName}}
        p {{$t('RR0148')}} {{$dayjs.unix(share.shareDate).format('MM/DD/YYYY')}}
    material-detail-external(:material="material" :isCanDownloadU3M="share.isCanDownloadU3M")
</template>

<script>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import useShareToMe from '@/composables/useShareToMe'
import MaterialDetailExternal from '@/components/layout/materialDetail/MaterialDetailExternal.vue'

export default {
  name: 'ShareToMeMaterialDetail',
  components: {
    MaterialDetailExternal
  },
  props: {
    nodeKey: {
      type: [Number, String],
      required: true
    }
  },
  async setup (props) {
    const { t } = useI18n()
    const store = useStore()
    const route = useRoute()
    const { parsePath, prefixPath } = useNavigation()
    const { cloneNode } = useShareToMe()
    const sharingId = ref(route.query.sharingId)

    await store.dispatch('shareToMe/getShareToMeMaterial', { workspaceNodeId: props.nodeKey.split('-')[1], sharingId: sharingId.value })

    const material = computed(() => store.getters['shareToMe/material'])
    const share = computed(() => store.getters['shareToMe/materialShare'])
    const breadcrumbList = computed(() => {
      const tempBreadCrumbList = store.getters['shareToMe/materialBreadcrumbList']
      const list = [
        {
          name: t('RR0010'),
          path: parsePath(`${prefixPath.value}/share-to-me`)
        }
      ]
      for (let i = 0; i <= tempBreadCrumbList.length - 1; i++) {
        const { name, workspaceNodeId } = tempBreadCrumbList[i]
        if (i !== tempBreadCrumbList.length - 1) {
          list.push({
            name,
            path: parsePath(`${prefixPath.value}/share-to-me?workspaceNodeId=${workspaceNodeId}&sharingId=${sharingId.value}`)
          })
        } else {
          list.push({
            name: material.value.materialNo,
            path: parsePath(`${prefixPath.value}/share-to-me/${workspaceNodeId}?sharingId=${sharingId.value}`)
          })
        }
      }
      return list
    })
    const isFirstTime = ref(true)
    const haveMsgAndFirstRead = computed(() => !!share.value?.message && isFirstTime.value)

    const openModalShareMessage = () => {
      isFirstTime.value = false
      store.dispatch('helper/openModal', {
        component: 'modal-share-message',
        header: t('RR0146'),
        properties: {
          message: share.value.message
        }
      })
    }

    return {
      breadcrumbList,
      material,
      share,
      cloneNode,
      haveMsgAndFirstRead,
      openModalShareMessage
    }
  }
}

</script>
