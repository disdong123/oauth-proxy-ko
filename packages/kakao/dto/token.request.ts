export class TokenRequest {
  private client_id: string;
  private redirect_uri: string;
  private code: string;
  private grant_type: string = 'authorization_code';

  constructor(clientId: string, redirectUri: string, code: string) {
    this.client_id = clientId;
    this.redirect_uri = redirectUri;
    this.code = code;
  }
}
