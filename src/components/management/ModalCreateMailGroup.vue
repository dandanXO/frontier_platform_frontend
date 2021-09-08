<template lang="pug">
div(class="w-100 px-8")
  h6(class="text-h6 text-primary font-bold text-center pb-4") {{$t('b.createUploadMail')}}
  p(class="text-body2 text-primary line-height-1.6 text-center pb-4") {{$t('b.createMailForUpload')}}
  div(class="flex justify-between items-center")
    input-text(v-model:textValue="uploadMaterialEmail" required class="w-58.5" :customErrorMsg="suggestEmailList.length > 0 ? $t('err.nameInUse') : ''")
    p(class="text-body2 text-primary") {{$t('b.textileCloud')}}
  div(v-if="suggestEmailList.length > 0" class="pt-7.5 flex")
    p(class="text-body2 text-primary pr-2") {{$t('b.available')}}:
    div
      p(v-for="email in suggestEmailList" class="text-body2 text-assist-blue pb-2.5") {{email}}
  div(class="h-25 flex justify-center items-center")
    div(class="grid grid-cols-2 gap-x-3")
      btn(size="md" type="secondary" @click="openModalCreateGroup") {{$t('reuse.back')}}
      btn(size="md" type="primary" :disabled="!availableToCreateGroup" @click="createGroup") {{$t('reuse.create')}}
</template>

<script>
import { ref } from 'vue'
import { computed, watch } from '@vue/runtime-core'
import { useStore } from 'vuex'
export default {
  name: 'ModalCreateMailGroup',
  setup () {
    const store = useStore()
    const suggestEmailList = ref([])
    const uploadMaterialEmail = computed({
      get: () => store.getters['group/createForm'].uploadMaterialEmail,
      set: (v) => store.commit('group/SET_createForm_uploadMaterialEmail', v)
    })
    const availableToCreateGroup = computed(() => uploadMaterialEmail.value !== '' && suggestEmailList.value.length === 0)

    const openModalCreateGroup = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-create-group'
      })
    }
    const createGroup = async () => {
      try {
        await store.dispatch('group/createGroup')
        store.dispatch('helper/closeModal')
      } catch (availableEmailList) {
        suggestEmailList.value = availableEmailList
      }
    }

    watch(
      () => uploadMaterialEmail.value,
      () => {
        suggestEmailList.value.length = 0
      }
    )

    return {
      uploadMaterialEmail,
      openModalCreateGroup,
      createGroup,
      suggestEmailList,
      availableToCreateGroup
    }
  }
}
</script>
