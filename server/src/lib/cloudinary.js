import { createHash } from 'node:crypto';
import { config } from '../config.js';

export function cloudinaryConfigured() {
  const { cloudName, apiKey, apiSecret } = config.cloudinary;
  return Boolean(cloudName && apiKey && apiSecret);
}

// Cloudinary's signing rule: sort the parameters by name, join them as
// name=value with &, add the API secret on the end, and SHA-1 the result.
// Cloudinary does the same on its side; if anyone changes a parameter, the
// signatures stop matching and the request is refused.
export function sign(params) {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return createHash('sha1').update(toSign + config.cloudinary.apiSecret).digest('hex');
}

// Turns a saved image URL back into Cloudinary's id for it, e.g.
//   https://res.cloudinary.com/<cloud>/image/upload/v1791126763/postly/users/4/abc.png
//   -> postly/users/4/abc
// Returns null for anything that isn't an image in OUR account.
export function publicIdFromUrl(imageUrl) {
  const prefix = `https://res.cloudinary.com/${config.cloudinary.cloudName}/image/upload/`;
  if (!imageUrl.startsWith(prefix)) return null;
  const path = imageUrl.slice(prefix.length).replace(/^v\d+\//, '');
  return path.replace(/\.[a-z0-9]+$/i, '');
}

// Deletes one image from Cloudinary. Resolves with Cloudinary's answer,
// e.g. { result: 'ok' } or { result: 'not found' }; throws if it can't be reached.
export async function destroyImage(publicId) {
  const params = { public_id: publicId, timestamp: Math.round(Date.now() / 1000) };
  const form = new FormData();
  for (const [key, value] of Object.entries(params)) form.append(key, value);
  form.append('api_key', config.cloudinary.apiKey);
  form.append('signature', sign(params));

  const res = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/image/destroy`, {
    method: 'POST',
    body: form,
    signal: AbortSignal.timeout(5000),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error?.message || `Cloudinary answered ${res.status}`);
  return data;
}
