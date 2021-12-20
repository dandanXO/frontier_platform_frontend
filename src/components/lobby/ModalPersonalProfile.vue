<template lang="pug">
div(class="w-101 px-8")
  h6(class="text-h6 font-bold text-primary pb-7.5 text-center") {{$t('MM0001')}}
  input-text(
    v-model:textValue="user.email"
    disabled
    :clearable="false"
  )
  p(class="text-right text-caption text-black-600 pt-7.5 pb-1") *{{$t('MM0003')}}
  div(class="grid grid-cols-2 gap-x-3 pb-4")
    input-text(v-model:textValue="firstName" required :label="$t('MM0034')")
    input-text(v-model:textValue="lastName" required :label="$t('MM0035')")
  btn-group(
    class="h-25"
    :primaryText="$t('UU0018')"
    @click:primary="updateUserProfile"
    :secondaryButton="false"
  )
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed } from 'vue'

export default {
  name: 'ModalPersonalProfile',
  setup () {
    const store = useStore()
    const user = computed(() => store.getters['user/user'])

    const firstName = ref(user.value.firstName)
    const lastName = ref(user.value.lastName)

    const updateUserProfile = async () => {
      store.dispatch('helper/openModalLoading')
      await store.dispatch('user/updateUserProfile', { firstName: firstName.value, lastName: lastName.value })
      store.dispatch('helper/clearModalPipeline')
    }
    return {
      user,
      firstName,
      lastName,
      updateUserProfile
    }
  }
}
</script>
