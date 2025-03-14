export class MessageDto {
  constructor(message: string, session_id: string) {
    this.message = message;
    this.session_id = session_id;
  }

  message = "";
  session_id = "";
}
