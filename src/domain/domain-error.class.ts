enum DomainErrorCodes {
  USER_WAS_LAST_ROLL = 'USER_WAS_LAST_ROLL',
}

export class DomainError extends Error {
  constructor(code: keyof typeof DomainErrorCodes) {
    super(code)
  }
}
