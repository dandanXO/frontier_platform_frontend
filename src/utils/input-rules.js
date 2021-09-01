import inputValidator from '@/utils/input-validator'

export default {
  required: (msg = 'err.fieldRequired') => (v) => inputValidator.required(v) || msg
}
