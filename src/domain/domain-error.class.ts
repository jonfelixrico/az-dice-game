enum DomainErrorCodes {
  USER_WAS_LAST_ROLL = 'USER_WAS_LAST_ROLL',
  ROLL_NOT_FOUND = 'ROLL_NOT_FOUND',
  ROLL_ALREADY_REMOVED = 'ROLL_ALREADY_REMOVED',
  ROLL_NOT_RESTORABLE_BECAUSE_NOT_REMOVED = 'ROLL_NOT_RESTORABLE_BECAUSE_NOT_REMOVED',
}

export class DomainError extends Error {
  constructor(code: keyof typeof DomainErrorCodes | DomainErrorCodes) {
    super(code)
  }
}
