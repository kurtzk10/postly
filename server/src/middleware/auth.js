import { HttpError } from '../lib/httpError.js';

// Put in front of every route that needs a logged-in user. The session
// remembers who logged in; this hands that id to the routes as req.userId.
export function requireAuth(req, res, next) {
  if (!req.session.userId) {
    throw new HttpError(401, 'Please log in');
  }
  req.userId = req.session.userId;
  next();
}
