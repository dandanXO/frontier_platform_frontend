<style lang="scss" scoped>
.pt-with-header-empty {
  padding-top: grow-shrink-y(58, 122);
}

.pt-with-header {
  padding-top: grow-shrink-y(58, 142);
}
</style>

<template lang="pug">
header(class="w-screen h-14.5 pt-8 pl-10 pr-9 fixed inset-0")
  div(class="flex justify-between")
    svg-icon(iconName="frontier-logo" size="special" class="w-34 h-6.5")
    ul(class="grid grid-flow-col gap-x-5.5")
      li
        dropdown-locale
      li(class="flex items-center")
        router-link-extending(class="text-primary font-bold text-caption" to="/logout") {{$t('word.logout')}}
        svg-icon(iconName="arrow-right" size="24" class="text-black-650")
div(class="w-screen mt-14.5")
  div(v-if="orgList.length === 0" class="w-full flex flex-col items-center pt-with-header-empty")
    h3(class="text-primary font-bold text-h3 mb-6") {{$t('term.createYourOrg')}}
    p(class="text-primary text-body1 line-height-1.6 w-160 text-center mb-7.5") {{$t('sentence.providePlatform')}}
    div(class="w-58 h-55 rounded-md border border-black-400 border-dashed flex justify-center items-center cursor-pointer" @click="isOpenCreateForm = true")
      div(class="grid justify-items-center gap-y-3.5")
        svg-icon(iconName="old-add" size="24")
        span(class="text-primary-middle text-body2 font-bold") {{$t('term.createOrg')}}
  div(v-else class="pt-with-header px-88")
    p(class="text-black-800 font-bold text-body1 pb-3 border-b border-black-200") {{$t('term.yourOrg')}}
    div(class="flex gap-5 flex-wrap mt-7.5")
      div(v-for="org in orgList" class="w-58 h-55 rounded-md border border-black-400 bg-black-100 flex flex-col items-center py-5 cursor-pointer" @click="goToPublicLibrary(org.orgName)")
        div(class="w-15 h-15 mb-5")
          img(:src="org.logo" class="rounded-full")
        span(class="text-body1 text-primary font-bold mb-3") {{org.orgName}}
        span(class="text-black-650 text-caption mb-7.5") {{`${org.memberList.length} ${$t('word.member')}`}}
        div(class="flex flex-row-reverse transform -translate-x-1.5")
          template(v-if="org.memberList.length <= 6")
            img(v-for="(member, index) in org.memberList"
              class="w-7.5 h-7.5 border border-black-0 rounded-full relative"
              :src="member.avatar"
              :class="`z-${org.memberList.length - index}`"
              :style="{ 'margin-right': org.memberList.length === 1 ? '0px' : '-12px' }"
            )
          template(v-else)
            template(v-for="(member, index) in org.memberList.slice(0, 6)")
              img(v-if="index < 5" :src="member.avatar"
                class="w-7.5 h-7.5 border border-black-0 rounded-full relative"
                :class="`z-${org.memberList.length - index}`"
                :style="{ 'margin-right': '-12px' }"
              )
              div(v-else class="w-7.5 h-7.5 rounded-full relative bg-primary-middle flex items-center justify-center"
                :class="`z-${org.memberList.length - index}`"
                :style="{ 'margin-right': '-12px' }"
              )
                svg-icon(iconName="more" size="24" class="text-black-600")
      div(class="w-58 h-55 rounded-md border border-black-400 border-dashed flex justify-center items-center cursor-pointer" @click="isOpenCreateForm = true")
        div(class="grid justify-items-center gap-y-3.5")
          svg-icon(iconName="old-add" size="24")
          span(class="text-primary-middle text-body2 font-bold") {{$t('term.createOrg')}}
div(v-if="isOpenCreateForm" class="fixed inset-0 z-10 w-screen h-screen bg-black bg-opacity-70 flex justify-center overflow-y-scroll")
  div(class="flex flex-col w-105 h-175 rounded-lg bg-black-0 mt-28.5 mb-20.5 relative pt-10.5 px-10 pb-7.5")
    svg-icon(iconName="close" size="24" class="text-black-700 absolute top-3 right-3 cursor-pointer" @click="closeCreateForm")
    h6(class="text-primary font-bold text-h6 pb-8.5 mb-2.5 border-b border-black-400 w-full text-center") {{$t('term.createOrg')}}
    span(class="self-end text-caption text-black-600 mb-1.5") {{$t('term.required')}}
    form(class="w-full grid gap-y-4")
      div(class="grid gap-y-3")
        span(class="text-primary font-bold text-body2") {{$t('term.orgType')}}
          span(class="text-warn") *
        div(class="flex justify-between")
          old-input-radio(v-for="type in orgCategoryList"
            v-model:inputValue="formData.orgCategoryId"
            name="orgCategory"
            :value="type.orgCategoryId"
            :label="type.label"
          )
      div(class="grid gap-y-3 relative z-10")
        span(class="text-primary font-bold text-body2") {{$t('term.country')}}
          span(class="text-warn") *
        old-input-select(v-model:value="formData.countryCode" :options="countryList" keyOptionDisplay="name" keyOptionValue="countryCode" :placeholder="$t('form.org.country')")
      div(class="grid gap-y-3 relative")
        span(v-if="isOrgNameExist" class="absolute right-0 top-1.5 text-caption text-warn") {{$t('error.orgNameAlreadyExist')}}
        span(class="text-primary font-bold text-body2") {{$t('term.orgName')}}
          span(class="text-warn") *
        old-input-text(v-model:value="formData.orgName" :placeholder="$t('form.org.orgName')" @blur="checkOrgNameExist" :class="[{ 'border-warn': isOrgNameExist }]")
      div(class="grid gap-y-3")
        span(class="text-primary font-bold text-body2") {{$t('term.orgAddress')}}
        old-input-text(v-model:value="formData.address" :placeholder="$t('form.org.orgAddress')")
      div(class="grid gap-y-3 relative z-9")
        span(class="text-primary font-bold text-body2") {{$t('word.phone')}}
        input-calling-code(v-model:value="formData.phone" v-model:countryCode="formData.phoneCountryCode" :placeholder="$t('form.org.phone')")
      div(class="grid gap-y-3 relative z-8")
        span(class="text-primary font-bold text-body2") {{$t('word.fax')}}
        input-calling-code(v-model:value="formData.fax" v-model:countryCode="formData.faxCountryCode" :placeholder="$t('form.org.fax')")
    btn(size="lg" class="mt-6" :disabled="!avaliableToCreateOrg" @click="createOrg") {{$t('word.create')}}
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import DropdownLocale from '@/components/DropdownLocale'
import InputCallingCode from '@/components/InputCallingCode'
import { computed, reactive, ref, toRaw, watch } from 'vue'

export default {
  name: 'Lobby',
  components: {
    DropdownLocale,
    InputCallingCode
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const initialFormData = {
      orgCategoryId: 1,
      countryCode: '',
      address: '',
      orgName: '',
      phone: '',
      phoneCountryCode: 'TW',
      fax: '',
      faxCountryCode: 'TW'
    }
    const isOpenCreateForm = ref(false)
    const isOrgNameExist = ref(false)
    const formData = reactive({ ...initialFormData })
    const orgCategoryList = reactive([
      {
        label: 'Brand',
        orgCategoryId: 1
      },
      {
        label: 'Supplier',
        orgCategoryId: 2
      },
      {
        label: 'Designer',
        orgCategoryId: 3
      },
      {
        label: 'Other',
        orgCategoryId: 4
      }
    ])

    const countryList = computed(() => store.getters['code/countryList'])
    const orgList = computed(() => store.getters['user/organizationList'])
    const avaliableToCreateOrg = computed(() => formData.countryCode !== '' && formData.orgName !== '' && !isOrgNameExist.value)

    watch(
      () => formData.orgName,
      () => {
        if (isOrgNameExist.value) {
          isOrgNameExist.value = false
        }
      }
    )

    const closeCreateForm = () => {
      isOpenCreateForm.value = false
      resetFormData()
    }

    const resetFormData = () => {
      Object.assign(formData, initialFormData)
    }

    const goToPublicLibrary = (orgName) => {
      /**
       * @todo 需要定義組織下的 URL
       */
      router.push(`/${orgName}/public-library`)
    }

    const createOrg = async () => {
      try {
        await checkOrgNameExist()

        if (isOrgNameExist.value) { return }

        await store.dispatch('organization/createOrg', toRaw(formData))
        goToPublicLibrary(formData.orgName)
        closeCreateForm()
      } catch (error) {
        console.error(error)
      }
    }

    const checkOrgNameExist = async () => {
      isOrgNameExist.value = await store.dispatch('organization/checkOrgNameExist', { orgName: formData.orgName })
    }

    return {
      orgList,
      orgCategoryList,
      formData,
      countryList,
      isOpenCreateForm,
      closeCreateForm,
      createOrg,
      avaliableToCreateOrg,
      goToPublicLibrary,
      checkOrgNameExist,
      isOrgNameExist
    }
  }
}
</script>
