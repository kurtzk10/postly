import { HttpError } from '../lib/httpError.js';

export function notFound(req, res) {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
}

// Express recognises error handlers by their four arguments, so `next` stays.
export function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }
  // Malformed JSON body, raised by express.json()
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body is not valid JSON' });
  }
  // Anything else is a real failure: log it, but never send the details to the client.
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
}
