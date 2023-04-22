import { pixelToCm, cmToPixel } from '@/utils/cropper'

describe('cropper', () => {
  it('should handle image pixel convert to cm', () => {
    const pixel = 600
    const dpi = 600
    const cm = pixelToCm(pixel, dpi).toDP(2).toString()
    expect(cm).toEqual('2.54')
  })

  it('should handle image cm convert to pixel', () => {
    const cm = 2.54
    const dpi = 600
    const pixel = cmToPixel(cm, dpi).toDP(2).toString()
    expect(pixel).toEqual('600')
  })
})
