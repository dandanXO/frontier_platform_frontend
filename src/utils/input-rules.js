import inputValidator from '@/utils/input-validator'
import i18n from '@/utils/i18n'

// format: fail case && error msg

export default {
  required: (msg = i18n.global.t('WW0002')) => (v) => !inputValidator.required(v) && msg,
  email: (msg = i18n.global.t('WW0019')) => (v) => !inputValidator.emailFormat(v) && msg
}
