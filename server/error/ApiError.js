// const BaseError = require('./BaseError.js'); // already correct
const BaseError = require("./BaseError");

class NotFoundError extends BaseError {
  constructor(description = 'Not Found') {
    super('NotFoundError', 404, true, description);
  }
}

class ValidationError extends BaseError {
  constructor(description = 'Validation Error') {
    super('ValidationError', 400, true, description);
  }
}

class UnauthorizedError extends BaseError {
  constructor(description = 'Unauthorized') {
    super('UnauthorizedError', 402, true, description);
  }
}

module.exports = {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
};

