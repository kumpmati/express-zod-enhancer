/**
 * Generic application error class. Use this when throwing errors in the application
 *
 * Borrowed from Alex Kondov's Tao of Node
 * @see https://alexkondov.com/tao-of-node/#use-error-extend
 */
export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(statusCode: number, message: string, isOperational = true, stack = "") {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
