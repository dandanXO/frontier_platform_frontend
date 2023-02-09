import store from '@/store'
import i18n from '@/utils/i18n'
import { shallowRef, h } from 'vue'

const t = i18n.global.t
let timerId

export default function remindVerifyEmail() {
  let secRemains = 0

  const startCountDown = () => {
    if (timerId) {
      clearInterval(timerId)
    }
    secRemains = 30
    const noteDom = document.getElementById('verify-email-note')
    noteDom.classList.add('!text-grey-250', '!cursor-not-allowed')
    noteDom.textContent = `${t('UU0056')}... (${secRemains})`

    timerId = setInterval(() => {
      secRemains--
      noteDom.textContent = `${t('UU0056')}... (${secRemains})`
      if (secRemains <= 0) {
        noteDom.textContent = t('UU0056')
        noteDom.classList.remove('!text-grey-250', '!cursor-not-allowed')
        clearInterval(timerId)
      }
    }, 1000)
  }

  const noteAttr = {
    id: 'verify-email-note',
    class: ['text-cyan-400 cursor-pointer'],
    onClick: async () => {
      if (secRemains > 0) return
      startCountDown()
      await store.dispatch('user/resendVerifyEmail')
      store.dispatch('helper/pushFlashMessage', t('AA0087'))
    },
  }

  store.dispatch('helper/openModalConfirm', {
    type: 1,
    header: t('AA0030'),
    contentComponent: shallowRef({
      render: () => {
        return h('span', { class: 'text-body2 leading-1.6 text-grey-600' }, [
          t('AA0052'),
          h('br'),
          h('strong', noteAttr, t('UU0056')),
        ])
      },
    }),
    secondaryBtnText: t('UU0026'),
  })
}
