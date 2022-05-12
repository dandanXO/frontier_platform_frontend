<template lang="pug">
div(class="h-full")
  //- Upper Part
  div
    p {{ $route.name }}
    btn(size="sm" @click="openCreateOrEditMoodboard") Edit
  //- Lower Part
  div(class="h-242.5 pt-16 pb-6.5 px-8 bg-black-50 flex flex-col")
    template(v-if="moodboard.moodboardType === MOODBOARD_TYPE.DEMANDER")
      div(class="pl-31 pb-13.5")
        h5(class="text-h5 font-bold text-primary pb-3") {{ $t('QQ0016') }}
        p(class="text-body2 text-black-500") {{ $t('QQ0017') }}
      div(class="flex-grow flex gap-x-5.5")
        div(class="w-52 h-full")
          btn(size="md" prependIcon="add" class="w-full" @click="openModalMoodboardShareList") {{ $t('UU0096') }}
        div(class="flex-grow bg-black-0 border-primary-middle border rounded h-full")
    template(v-else-if="moodboard.moodboardType === MOODBOARD_TYPE.PROVIDER")
      div(class="pl-31 pb-13.5")
        h5(class="text-h5 font-bold text-primary pb-3") {{ $t('QQ0061') }}
        p(class="text-body2 text-black-500") {{ $t('QQ0062') }}
      div(class="bg-black-0 border-primary-middle border rounded flex-grow flex flex-col")
        div(class="flex pt-5")
          div(class="w-6 border-b border-black-400")
          tabs(:tabList="tabList" class="flex-grow" @switch="currentTab = $event.path")
          div(class="w-6 border-b border-black-400")
        div(class="px-7 pt-4 flex-grow flex flex-col")
          template(v-if="currentTab === TAB.OFFER")
            div(class="flex justify-between items-center")
              input-text(
                v-model:textValue="keyword"
                size="sm"
                class="w-67.5"
                prependIcon="search"
                :placeholder="$t('RR0053')"
              )
              btn(size="sm" prependIcon="add") {{ $t("UU0055") }}
            div(class="py-2 flex justify-between items-center")
              p(class="text-body2 font-bold text-primary") {{ $t('QQ0070') }}
              btn-functional(size="lg") {{ $t("RR0209") }}
            div(class="bg-black-50 h-10 flex items-center gap-x-3 pl-4")
              svg-icon(iconName="public" size="20" class="text-black-600")
              p(class="text-caption text-black-800") {{ $t('QQ0053') }}
            div(class="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 grid-flow-row auto-rows-auto content-start h-150 py-2 overflow-y-auto hide-scrollbar")
              div(class="aspect-square border border-black-400 border-dashed rounded-md flex justify-center items-center cursor-pointer" @click="openModalCreateCollection")
                div(class="flex flex-col justify-center items-center")
                  svg-icon(iconName="add" size="24" class="text-primary mb-3.5")
                  span(class="text-body1 text-primary") {{ $t("FF0003") }}
              child-node-item(
                v-for="node in moodboardOfferNode.childNodeList"
                :nodeType="node.nodeType"
                :properties="node.properties"
                :displayName="node.nodeType === NODE_TYPE.COLLECTION ? node.properties.collectionName : node.properties.materialNo"
                :isSelectable="false"
              )
</template>

<script setup>
import { computed, ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import { MOODBOARD_TYPE } from '@/utils/constants.js'
import { useI18n } from 'vue-i18n'
import { NODE_TYPE } from '@/utils/constants.js'
import ChildNodeItem from '@/components/layout/ChildNodeItem.vue'
import SvgIcon from '@/components/common/SvgIcon.vue'

const store = useStore()
const { t } = useI18n()
const props = defineProps({
  moodboardId: {
    type: Number,
    required: true
  }
})

const TAB = {
  OFFER: 'offer',
  PICKED: 'picked',
  COMMENT: 'comment'
}

const tabList = [
  { name: t('QQ0051'), path: TAB.OFFER },
  { name: t('QQ0052'), path: TAB.PICKED },
  { name: t('QQ0031'), path: TAB.COMMENT },
]
const currentTab = ref(tabList[0].path)

const moodboard = computed(() => store.getters['moodboard/moodboard'])
const moodboardOfferNode = computed(() => store.getters['moodboard/moodboardOfferNode'])

const openCreateOrEditMoodboard = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-or-edit-moodboard',
    properties: {
      mode: 2
    }
  })
}

const openModalMoodboardShareList = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-moodboard-share-list',
  })
}

const keyword = ref('')

await store.dispatch('moodboard/getMoodboard', { moodboardId: props.moodboardId })
await store.dispatch('moodboard/getMoodboardNode', { moodboardId: props.moodboardId, nodeId: moodboard.value.properties.myRootNodeId, keyword: keyword.value })
</script>
