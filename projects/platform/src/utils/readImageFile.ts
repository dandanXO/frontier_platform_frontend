import ExifReader from 'exifreader'

export function readImageFile(file: File): Promise<{
  type: string
  size: number
  width: number
  height: number
  xResolution: number
  yResolution: number
  exifData: any
}> {
  return new Promise((resolve, reject) => {
    // Create FileReader to read file for EXIF extraction
    const readerForEXIF = new FileReader()
    readerForEXIF.onload = (event) => {
      try {
        const tags = ExifReader.load(event.target.result)
        const xResolution = Number(tags['XResolution']?.value)
        const yResolution = Number(tags['YResolution']?.value)

        // Create another FileReader to read file as Data URL for image display
        const readerForImage = new FileReader()
        readerForImage.onload = (event) => {
          const img = new Image()
          img.onload = () => {
            resolve({
              type: file.type,
              size: file.size,
              width: img.width,
              height: img.height,
              xResolution,
              yResolution,
              exifData: tags,
            })
          }
          img.onerror = () => {
            reject(new Error('There was an error loading the image.'))
          }
          img.src = event.target.result
        }
        readerForImage.readAsDataURL(file)
      } catch (error) {
        console.error('Error processing EXIF data:', error)
        reject(new Error('Failed to process EXIF data.'))
      }
    }
    readerForEXIF.onerror = () => {
      reject(new Error('There was an error reading the file.'))
    }
    readerForEXIF.readAsArrayBuffer(file)
  })
}
