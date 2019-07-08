export const errorCode = {
  ERROR_COMMON: 1001,
  ERROR_ARGUMENT: 1002,
  ERROR_PARSE_JSON: 1003,
  ERROR_TIMEOUT: 1004,
  ERROR_NETWORK_REQ: 1005,
  ERROR_NETWORK_RSP: 1006,
  ERROR_NETWORK_SETUP: 1007
};

export default class ErrorInfo extends Error {
  constructor(code, message, payload = {}) {
    super(message);
    this.message = message;
    this.code = code;
    this.name = this.constructor.name;
    this.payload = payload;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
    this.stack = new Error().stack;
  }
}
