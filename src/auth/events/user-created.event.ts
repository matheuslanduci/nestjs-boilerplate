export class UserCreatedEvent {
  email: string

  constructor(email: string) {
    this.email = email
  }
}
