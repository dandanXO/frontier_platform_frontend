<template lang="pug">
modal-behavior(
  :header="$t('II0024')"
  :primaryBtnText="$t('UU0049')"
  :secondaryBtnText="$t('UU0002')"
  :primaryBtnDisabled="primaryBtnDisabled"
  @click:primary="contactTitasOrg"
  @click:secondary="$store.dispatch('helper/closeModalBehavior')"
)
  form(class="w-125")
    div(class="grid grid-cols-2 gap-5 mb-5")
      f-input-text(
        v-model:textValue="formData.fromEmail"
        :label="$t('II0026')"
        required
        size="sm"
        :rules="[$inputRules.required(), $inputRules.email()]"
      )
      f-input-container(:label="$t('II0025')")
        f-popper(placement="bottom" :offset="[0, 0]")
          template(#trigger)
            div(class="h-9 rounded border border-grey-200 w-full flex px-4 items-center")
              img(:src="selectedOrg.logo" class="w-6 h-6 rounded-full")
              p(class="flex-grow text-body2 px-2 line-clamp-1") {{ selectedOrg.orgName }}
              f-svg-icon(
                iconName="keyboard_arrow_right"
                size="20"
                class="transform rotate-90 cursor-pointer text-grey-600"
              )
          template(#content)
            f-contextual-menu(
              class="w-60"
              :menuTree="orgMenuTree"
              v-model:inputSelectValue="formData.toEmail"
              :selectMode="2"
            )
    f-input-text(
      v-model:textValue="formData.subject"
      :label="$t('II0027')"
      required
      :rules="[$inputRules.required()]"
      class="mb-4"
    )
    f-input-textarea(
      v-model:textValue="formData.content"
      :label="$t('RR0146')"
      height="146"
      required
      :rules="[$inputRules.required()]"
    )
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  toEmail: {
    type: String,
  },
})

const store = useStore()
const { t } = useI18n()

const formData = reactive({
  toEmail: props.toEmail,
  fromEmail: store.getters['user/email'],
  subject: '',
  content: '',
})
const primaryBtnDisabled = computed(
  () => !formData.fromEmail || !formData.subject || !formData.content
)
const titasInfo = computed(() => store.getters['titas/titasInfo'])
const orgMenuTree = {
  blockList: [
    {
      menuList: titasInfo.value.orgList.map(
        ({ orgName, logo, contactEmail }) => ({
          title: orgName,
          selectValue: contactEmail,
          thumbnail: logo,
        })
      ),
    },
  ],
}
const selectedOrg = computed(() =>
  titasInfo.value.orgList.find((org) => org.contactEmail === formData.toEmail)
)

const contactTitasOrg = async () => {
  store.dispatch('helper/pushModalLoading')
  await store.dispatch('titas/contactTitasOrg', formData)
  store.dispatch('helper/openModalConfirm', {
    type: 2,
    header: t('II0028'),
    contentText: t('II0033', { orgName: selectedOrg.value.orgName }),
    primaryBtnText: t('UU0031'),
  })
}
</script>
