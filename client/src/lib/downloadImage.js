import { toPng } from 'html-to-image'

// Turns a piece of the page into a PNG and downloads it. Fonts and photos
// must have finished loading first, or they're missing from the picture.
export async function downloadAsPng(node, filename) {
  await document.fonts.ready
  await Promise.all(
    [...node.querySelectorAll('img')].map((img) =>
      img.complete
        ? null
        : new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
          }),
    ),
  )

  // pixelRatio 2: the sheet is 750px wide on screen, so the file is 1500px.
  const dataUrl = await toPng(node, { pixelRatio: 2 })
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}
