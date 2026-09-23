// An error that carries the HTTP status it should be answered with.
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
