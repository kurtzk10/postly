import { HttpError } from './httpError.js';

export const CAPTION_MAX = 140;

// Only images hosted on Cloudinary are accepted, so the app never stores
// links to arbitrary third-party sites.
const CLOUDINARY_IMAGE = /^https:\/\/res\.cloudinary\.com\/[\w-]+\/image\/upload\//;

export function parseId(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) {
    throw new HttpError(400, 'id must be a positive whole number');
  }
  return id;
}

// Checks the body of POST /api/postcards and returns the cleaned values.
export function validateNewPostcard(body) {
  if (!body || typeof body !== 'object') {
    throw new HttpError(400, 'Request body must be JSON');
  }
  const { imageUrl, caption = '', templateId } = body;

  if (typeof imageUrl !== 'string' || !CLOUDINARY_IMAGE.test(imageUrl)) {
    throw new HttpError(400, 'imageUrl must be a Cloudinary image URL (https://res.cloudinary.com/...)');
  }
  if (typeof caption !== 'string') {
    throw new HttpError(400, 'caption must be text');
  }
  const trimmed = caption.trim();
  if (trimmed.length > CAPTION_MAX) {
    throw new HttpError(400, `caption must be ${CAPTION_MAX} characters or fewer`);
  }
  if (!Number.isInteger(templateId) || templateId < 1) {
    throw new HttpError(400, 'templateId must be a positive whole number');
  }

  return { imageUrl, caption: trimmed, templateId };
}
