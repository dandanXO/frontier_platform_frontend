import inputValidator from '@/utils/input-validator'

export default {
  required: (msg = 'reuse.fieldRequired') => (v) => inputValidator.required(v) || msg
}
