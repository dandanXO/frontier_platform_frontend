import { downloadDataURLFile } from './fileOperator'

export const takeScreenshotByCanvas = async (canvas: HTMLCanvasElement) => {
  return new Promise<void>((resolve, reject) =>
    canvas.toBlob(async (blob) => {
      if (!blob) {
        return reject('blob undefined')
      }

      const { width, height } = canvas
      const fileName = `screencapture-${width}x${height}.png`
      const url = URL.createObjectURL(blob)
      await downloadDataURLFile(url, fileName)
      resolve()
    })
  )
}
