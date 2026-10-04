import { Router } from 'express';
import { config } from '../config.js';
import { HttpError } from '../lib/httpError.js';
import { cloudinaryConfigured, sign } from '../lib/cloudinary.js';

export const uploadsRouter = Router();

// What a signed upload is allowed to be: images only, in the user's own folder.
const ALLOWED_FORMATS = 'jpg,jpeg,png,webp,heic';

// POST /api/uploads/signature: everything the browser needs for ONE upload.
// It's behind requireAuth, so only logged-in users can upload at all.
uploadsRouter.post('/signature', (req, res) => {
  if (!cloudinaryConfigured()) {
    throw new HttpError(503, 'Photo uploads are not set up on this server');
  }

  const params = {
    allowed_formats: ALLOWED_FORMATS,
    folder: `postly/users/${req.userId}`,
    timestamp: Math.round(Date.now() / 1000), // Cloudinary refuses signatures older than an hour
  };

  const { cloudName, apiKey } = config.cloudinary;
  res.json({ cloudName, apiKey, ...params, signature: sign(params) });
});
