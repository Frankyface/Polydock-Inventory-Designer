// Downscales/recompresses an uploaded photo (e.g. a phone screenshot of a
// Google Maps satellite view) before it's stored in localStorage — a raw
// phone photo can be several MB, which would eat most of the quota just for
// one design's background.
const MAX_DIMENSION_PX = 1600
const JPEG_QUALITY = 0.82

export function compressImageToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const scale = Math.min(1, MAX_DIMENSION_PX / Math.max(img.naturalWidth, img.naturalHeight))
      const width = Math.round(img.naturalWidth * scale)
      const height = Math.round(img.naturalHeight * scale)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)

      resolve({ dataUrl: canvas.toDataURL('image/jpeg', JPEG_QUALITY), naturalWidth: width, naturalHeight: height })
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Could not load that image'))
    }
    img.src = objectUrl
  })
}
