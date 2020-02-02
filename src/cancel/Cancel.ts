export default class Cancel {
  message?: string
  constructor(message?: string) {
    this.message = message
  }
}

export function isCancel(vlaue: any): boolean {
  return vlaue instanceof Cancel
}