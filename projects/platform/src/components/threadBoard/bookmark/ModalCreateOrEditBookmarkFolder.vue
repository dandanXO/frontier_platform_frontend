<template lang="pug">
modal-behavior(
  :header="$t('TT0218')"
  :primaryBtnText="isEditMode ? $t('UU0018') : $t('UU0020')"
  :secondaryBtnText="$t('UU0002')"
  :primaryBtnDisabled="!isValid"
  :closable="false"
  @click:primary="handleConfirm"
  @click:secondary="closeModalBehavior"
)
  template(#note v-if="isEditMode") 
    span(class="text-caption text-grey-600 cursor-pointer" @click="handleRemove") {{ $t('TT0223') }}
  div(class="w-94 flex flex-col")
    div(class="flex flex-col gap-y-4")
      f-input-text(
        required
        :label="$t('TT0219')"
        prependIcon="folder"
        :placeholder="$t('TT0220')"
        v-model:textValue="folderName"
      )
      f-input-text(
        :label="$t('TT0221')"
        prependIcon="search"
        :placeholder="$t('RR0053')"
        v-model:textValue="orgNameSearchText"
      )
    f-scrollbar-container(class="h-64")
      div(class="flex flex-col items-stretch py-2")
        div(
          v-for="(org, index) in searchedContactOrgList"
          :key="index"
          class="w-full h-12 flex items-center justify-between pl-2 pr-4 rounded text-body2 gap-x-2 cursor-pointer hover:bg-grey-100"
          @mouseenter="showCheckboxId = org.orgId"
          @mouseleave="showCheckboxId = null"
          @click="updateCheckedIdList(org.orgId)"
        )
          div(class="flex items-center gap-x-4")
            img(class="w-8 h-8 rounded-full" :src="org.logo")
            p(class="text-body2") {{ org.orgName }}
          f-input-checkbox(
            v-if="showCheckboxId === org.orgId || checkedOrgIdSet.has(org.orgId)"
            binary
            :inputValue="checkedOrgIdSet.has(org.orgId)"
            @update:inputValue="updateCheckedIdList(org.orgId)"
            iconSize="20"
          )
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { storeToRefs } from 'pinia'
import useThreadBoardStore from '@/stores/threadBoard'
import { isCaseInsensitiveMatch } from '@/utils/string'

const props = defineProps<{
  bookmark?: {
    bookmarkId: number
    folderName: string
    orgIdList: number[]
  }
}>()

const store = useStore()
const threadBoardStore = useThreadBoardStore()
const { contactOrgList } = storeToRefs(threadBoardStore)

const folderName = ref<string | null>(props.bookmark?.folderName || '')
const orgNameSearchText = ref<string | null>('')
const showCheckboxId = ref<number | null>(null)
const checkedOrgIdSet = ref<Set<number>>(new Set(props.bookmark?.orgIdList))

const isEditMode = computed(() => props.bookmark != null)

const searchedContactOrgList = computed(() => {
  if (!contactOrgList.value) {
    return []
  }

  return contactOrgList.value.filter((org) =>
    isCaseInsensitiveMatch(org.orgName, orgNameSearchText.value || '')
  )
})

const isValid = computed(() => {
  if (folderName.value == null) {
    return false
  }

  return folderName.value.length > 0
})

const closeModalBehavior = () => store.dispatch('helper/closeModalBehavior')

const updateCheckedIdList = (orgId: number) => {
  checkedOrgIdSet.value.has(orgId)
    ? checkedOrgIdSet.value.delete(orgId)
    : checkedOrgIdSet.value.add(orgId)
}

const handleRemove = () => {
  if (!props.bookmark) {
    throw new Error('Bookmark is required')
  }

  closeModalBehavior()
  return threadBoardStore.removeBookmark(props.bookmark.bookmarkId)
}

const handleConfirm = () => {
  if (!folderName.value) {
    throw new Error('Folder name is required')
  }

  if (props.bookmark) {
    threadBoardStore.updateFolderBookmark(
      props.bookmark.bookmarkId,
      folderName.value,
      Array.from(checkedOrgIdSet.value)
    )
  } else {
    threadBoardStore.addFolderBookmark(
      folderName.value,
      Array.from(checkedOrgIdSet.value)
    )
  }

  closeModalBehavior()
}
</script>
