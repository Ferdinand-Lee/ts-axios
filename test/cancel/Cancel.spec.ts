import Cancel, { isCancel } from "../../src/cancel/Cancel"

describe('cancel:Cancel', () => {
  test('should return corrent result when message is specified', () => {
    const cancel = new Cancel('Operate has been canceled')
    expect(cancel.message).toBe('Operate has been canceled')
  })
  test('should returns true if value is a Cancel', () => {
    expect(isCancel(new Cancel())).toBeTruthy()
  })
  test('should return false if value is not a Cancel', () => {
    expect(isCancel({ foo: 'bar' })).toBeFalsy()
  })
})