import { inputValidator } from './inputValidator'
import i18n from '@frontier/i18n'

const inputRules = {
  // format: !(fail case) && error msg
  required:
    (msg = i18n.global.t('WW0002')) =>
    (v: unknown) =>
      !inputValidator.required(v) && msg,
  email:
    (msg = i18n.global.t('WW0019')) =>
    (v: string) =>
      !inputValidator.emailFormat(v) && msg,
  maxLength:
    (max: number, msg = i18n.global.t('WW0003')) =>
    (v: string) =>
      !inputValidator.maxLength(v, max) && msg,
}

export { inputRules }
