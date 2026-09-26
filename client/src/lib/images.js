// Asks Cloudinary for a small square crop instead of the full photo, so a
// month of calendar thumbnails doesn't download a month of full-size images.
export function thumbnailUrl(imageUrl, size = 120) {
  return imageUrl.replace('/image/upload/', `/image/upload/c_fill,w_${size},h_${size}/`)
}
