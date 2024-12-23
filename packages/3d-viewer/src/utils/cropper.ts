const image2Object = (url: string) => {
  return new Promise<{ width: number; height: number; src: string }>(
    (resolve) => {
      const img = new Image()

      img.onload = () => {
        const { width, height, src } = img
        resolve({ width, height, src })
      }

      img.src = url
    }
  )
}

export { image2Object }
