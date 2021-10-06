<template lang="pug">
div(class="w-100")
  div(class="px-8")
    h6(class="text-h6 text-primary font-bold pb-4 text-center") {{field.title}}
    i18n-t(:keypath="field.keypath" tag="p" class="text-primary text-center pb-4")
      template(v-slot:[field.slotName])
        br
        strong {{field.name}}
    div(class="pb-6 flex justify-center")
      input-text(v-model:textValue="confirmText" class="w-80" size="lg" :placeholder="field.placeholder" :customErrorMsg="errorMsg")
    div(class="h-25 flex justify-center items-center")
      div(class="grid grid-cols-2 gap-x-3")
        btn(size="md" type="secondary" :disabled="confirmText.length === 0" @click="openModelDoubleConfirm") {{$t('reuse.confirm')}}
        btn(size="md" @click="closeModal") {{$t('reuse.cancel')}}
</template>
<script>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'

export default {
  name: 'ModalDeleteOrgOrGroup',
  setup () {
    const router = useRouter()
    const store = useStore()
    const { t } = useI18n()
    const { location } = useNavigation()

    const field = computed(() => {
      const groupName = store.getters['group/group'].groupName
      const orgName = store.getters['organization/organization'].orgName
      return location.value === 'org'
        ? {
          title: t('b.deleteOrg'),
          name: orgName,
          keypath: 'b.enterOrgNameToDelete',
          slotName: 'orgName',
          placeholder: orgName,
          errorMsg: t('err.orgNameIsWrong')
        }
        : {
          title: t('b.deleteGroup'),
          name: groupName,
          keypath: 'b.enterGroupName',
          slotName: 'groupName',
          placeholder: groupName,
          errorMsg: t('err.groupNameIsWrong')
        }
    })

    const confirmText = ref('')
    const errorMsg = ref('')

    const openModelDoubleConfirm = () => {
      if (confirmText.value !== field.value.name) {
        errorMsg.value = field.value.errorMsg
        return
      }

      if (location.value === 'org') {
        store.dispatch('helper/pushModalConfirm', {
          title: t('b.deleteTheOrg'),
          content: t('b.afterDeleteOrg'),
          secondaryText: t('b.confirm'),
          secondaryHandler: async () => {
            await store.dispatch('organization/deleteOrg')
            store.dispatch('helper/clearModalPipeline')
            router.push('/')
          }
        })
      } else if (location.value === 'group') {
        store.dispatch('helper/pushModalConfirm', {
          title: t('b.deleteTheGroup'),
          content: t('b.deleteActionCanNotUndo'),
          secondaryText: t('b.confirm'),
          afterSecondaryHandler: async () => {
            await store.dispatch('helper/openModal', {
              component: 'modal-choose-storage'
            })
          }
        })
      }
    }

    const closeModal = () => {
      store.dispatch('helper/closeModal')
    }

    watch(
      () => confirmText.value,
      () => {
        errorMsg.value = ''
      }
    )

    return {
      confirmText,
      errorMsg,
      closeModal,
      openModelDoubleConfirm,
      field
    }
  }
}
</script>
