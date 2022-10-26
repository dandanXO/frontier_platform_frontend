<template lang="pug">
modal-behavior(
  :header="$t('MM0001')"
  :primaryBtnText="$t('UU0018')"
  :primaryBtnDisabled="!firstName || !lastName"
  @click:primary="updateUserProfile"
)
  div(class="w-90")
    f-input-text(v-model:textValue="user.email" disabled :clearable="false")
    p(class="text-right text-caption text-grey-600 pt-7.5 pb-1") *{{ $t('RR0163') }}
    div(class="grid grid-cols-2 gap-x-3 pb-4")
      f-input-text(
        v-model:textValue="firstName"
        required
        :label="$t('MM0034')"
        :rules="[$inputRules.required()]"
      )
      f-input-text(
        v-model:textValue="lastName"
        required
        :label="$t('MM0035')"
        :rules="[$inputRules.required()]"
      )
</template>

<script setup>
import { useStore } from 'vuex'
import { ref, computed } from 'vue'

const store = useStore()
const user = computed(() => store.getters['user/user'])

const firstName = ref(user.value.firstName)
const lastName = ref(user.value.lastName)

const updateUserProfile = async () => {
  store.dispatch('helper/openModalLoading')
  await store.dispatch('user/updateUserProfile', {
    firstName: firstName.value,
    lastName: lastName.value,
  })
  store.dispatch('helper/clearModalPipeline')
}
</script>
