import imgDefaultMaterial from '@/assets/images/default_material.png'

export default {
  mounted(el, binding) {
    const { value } = binding
    if (!el.src) {
      el.src = value || imgDefaultMaterial
    }
  },
}
