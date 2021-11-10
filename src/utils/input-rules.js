import inputValidator from '@/utils/input-validator'

// format: fail case && error msg

export default {
  required: (msg = 'WW0002') => (v) => !inputValidator.required(v) && msg
}
