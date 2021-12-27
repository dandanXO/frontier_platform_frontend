<template lang="pug">
div(class="w-100 px-8")
  h6(class="text-h6 text-primary font-bold text-center pb-4") {{$t('AA0077')}}
  p(class="text-body2 text-primary line-height-1.6 text-center pb-4") {{$t('AA0078')}}
  div(class="flex justify-between items-center")
    input-text(
      v-model:textValue="uploadMaterialEmail"
      required
      class="w-58.5"
      :customErrorMsg="errorMsg"
    )
      template(#errorMsg v-if="suggestEmailList.length > 0")
        p(v-if="suggestEmailList.length > 0" class="text-caption text-warn absolute pt-1 whitespace-nowrap") {{$t('WW0029')}}
    p(class="text-body2 text-primary") {{$t('AA0079')}}
  div(v-if="suggestEmailList.length > 0" class="pt-7.5 flex")
    p(class="text-body2 text-primary pr-2") {{$t('AA0085')}}
    div
      p(v-for="email in suggestEmailList" class="text-body2 text-assist-blue pb-2.5") {{email}}
  div(class="h-25 flex justify-center items-center")
    btn(v-if="isOldOrg" size="lg" class="w-full" :disabled="!availableToCreateOrg" @click="setOrgUploadMail") {{$t('UU0020')}}
    div(v-else class="grid grid-cols-2 gap-x-3")
      btn(size="md" type="secondary" @click="openModalCreateOrg") {{$t('UU0004')}}
      btn(size="md" type="primary" :disabled="!availableToCreateOrg" @click="createOrg") {{$t('UU0020')}}
</template>

<script>
import { ref } from 'vue'
import { computed, watch } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'ModalCreateMailOrg',
  props: {
    isOldOrg: {
      type: Boolean,
      default: false
    }
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const suggestEmailList = ref([])
    const errorMsg = ref('')
    const uploadMaterialEmail = computed({
      get: () => store.getters['organization/createForm'].uploadMaterialEmail,
      set: (v) => store.commit('organization/SET_createForm_uploadMaterialEmail', v)
    })
    const availableToCreateOrg = computed(() => uploadMaterialEmail.value !== '' && suggestEmailList.value.length === 0)

    const openModalCreateOrg = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-create-org'
      })
    }
    const createOrg = async () => {
      store.dispatch('helper/pushModalLoading')
      const { success, message, result } = await store.dispatch('organization/createOrg')

      if (success) {
        store.dispatch('helper/clearModalPipeline')
        router.push({ name: 'PublicLibrary', params: { orgNo: store.getters['organization/organization'].orgNo } })
      } else if (result.availableEmailList?.length > 0) {
        suggestEmailList.value = result.availableEmailList
      } else {
        errorMsg.value = message.content
      }
      store.dispatch('helper/closeModalLoading')
    }
    const setOrgUploadMail = async () => {
      store.dispatch('helper/pushModalLoading')
      const { success, message, result } = await store.dispatch('organization/setOrgUploadMail', { uploadMaterialEmail: uploadMaterialEmail.value })

      if (success) {
        store.dispatch('helper/clearModalPipeline')
      } else if (result.availableEmailList?.length > 0) {
        suggestEmailList.value = result.availableEmailList
      } else {
        errorMsg.value = message.content
      }
      store.dispatch('helper/closeModalLoading')
    }

    watch(
      () => uploadMaterialEmail.value,
      () => {
        suggestEmailList.value.length = 0
        errorMsg.value = ''
      }
    )

    return {
      uploadMaterialEmail,
      openModalCreateOrg,
      createOrg,
      suggestEmailList,
      availableToCreateOrg,
      setOrgUploadMail,
      errorMsg
    }
  }
}
</script>
