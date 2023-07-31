import inputValidator from '@/utils/inputValidator'
import i18n from '@/utils/i18n'

// format: !(fail case) && error msg

export default {
  required:
    (msg = i18n.global.t('WW0002')) =>
    (v) =>
      !inputValidator.required(v) && msg,
  email:
    (msg = i18n.global.t('WW0019')) =>
    (v) =>
      !inputValidator.emailFormat(v) && msg,
  maxLength:
    (max, msg = i18n.global.t('WW0003')) =>
    (v) =>
      !inputValidator.maxLength(v, max) && msg,
}
