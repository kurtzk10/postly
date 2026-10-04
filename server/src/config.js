import dotenv from 'dotenv';

dotenv.config({ quiet: true });

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT) || 4000,
  databaseUrl: required('DATABASE_URL'),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  // Signs the login cookie so it can't be forged. Long and random, never committed.
  sessionSecret: required('SESSION_SECRET'),
  isProduction: process.env.NODE_ENV === 'production',
  // Optional: without them the app runs, but uploading new photos is off.
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};
