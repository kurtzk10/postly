import { createHash } from 'node:crypto';
import { Router } from 'express';
import { config } from '../config.js';
import { HttpError } from '../lib/httpError.js';

export const uploadsRouter = Router();

// What a signed upload is allowed to be: images only, in the user's own folder.
const ALLOWED_FORMATS = 'jpg,jpeg,png,webp,heic';

// Cloudinary's signing rule: sort the parameters by name, join them as
// name=value with &, add the API secret on the end, and SHA-1 the result.
// Cloudinary does the same on its side; if anyone changes a parameter, the
// signatures stop matching and the upload is refused.
function sign(params, secret) {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return createHash('sha1').update(toSign + secret).digest('hex');
}

// POST /api/uploads/signature: everything the browser needs for ONE upload.
// It's behind requireAuth, so only logged-in users can upload at all.
uploadsRouter.post('/signature', (req, res) => {
  const { cloudName, apiKey, apiSecret } = config.cloudinary;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new HttpError(503, 'Photo uploads are not set up on this server');
  }

  const params = {
    allowed_formats: ALLOWED_FORMATS,
    folder: `postly/users/${req.userId}`,
    timestamp: Math.round(Date.now() / 1000), // Cloudinary refuses signatures older than an hour
  };

  res.json({ cloudName, apiKey, ...params, signature: sign(params, apiSecret) });
});
