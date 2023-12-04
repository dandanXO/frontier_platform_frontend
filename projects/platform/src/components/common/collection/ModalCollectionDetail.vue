<template lang="pug">
modal-behavior(
  :header="$t('RR0246')"
  :primaryBtnText="canEdit ? $t('UU0027') : ''"
  :secondaryBtnText="canEdit ? $t('UU0002') : $t('UU0026')"
  @click:primary="canEdit ? goToEditCollection() : closeModal()"
  @click:secondary="closeModal"
)
  collection-detail(:collection="collection")
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import type { Collection, NodeMeta } from '@frontier/platform-web-sdk'
import type { PropsModalCreateOrEditCollection } from '@/components/workspace/ModalCreateOrEditCollection.vue'
import CollectionDetail from '@/components/common/collection/CollectionDetail.vue'

export interface PropsModalCollectionDetail {
  nodeMeta: NodeMeta
  collection: Collection
  canEdit: boolean
}

const props = withDefaults(defineProps<PropsModalCollectionDetail>(), {
  canEdit: false,
})

const store = useStore()

const goToEditCollection = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-or-edit-collection',
    properties: {
      mode: 2,
      nodeMeta: props.nodeMeta,
      collection: props.collection,
    } as PropsModalCreateOrEditCollection,
  })
}

const closeModal = () => store.dispatch('helper/closeModal')
</script>
