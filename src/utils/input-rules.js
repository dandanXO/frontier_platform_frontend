import inputValidator from '@/utils/input-validator'

// format: fail case && error msg

export default {
  required: (msg = 'err.fieldRequired') => (v) => !inputValidator.required(v) && msg
}
