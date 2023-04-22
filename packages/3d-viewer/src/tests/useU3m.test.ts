import { flushPromises, mount } from '@vue/test-utils'
import useU3m from '../composables/useU3M'
import { defineComponent } from 'vue'
import u3mBody from './mock/u3mBody.json'

vi.stubGlobal(
  'fetch',
  vi.fn(() => ({
    json: () => new Promise((resolve) => resolve(u3mBody)),
  }))
)

describe('useU3m', () => {
  it('should fetch and parse u3m file correctly', async () => {
    const u3mPath = '/u3m'
    const TestComponent = defineComponent({
      props: {
        u3mPath: { type: String, required: true },
      },
      setup(props) {
        return { ...useU3m(props.u3mPath) }
      },
      render() {
        return null
      },
    })

    const wrapper = mount(TestComponent, {
      props: { u3mPath },
    })
    expect(wrapper.vm.u3mPath).toEqual(u3mPath)
    expect(wrapper.vm.u3m).toBeUndefined()
    await flushPromises()

    expect(wrapper.vm.u3m).toEqual({
      u3m: u3mBody,
      alpha: 0.98,
      baseColor: { r: 0.12, g: 0.13, b: 0.14 },
      metalness: 0.44,
      roughness: 0.32,
      specular: 0.67,
    })
  })
})
