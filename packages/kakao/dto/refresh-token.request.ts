export class RefreshTokenRequest {
  private client_id: string;
  private refresh_token: string;
  private grant_type: string = 'refresh_token';

  constructor(clientId: string, refreshToken: string) {
    this.client_id = clientId;
    this.refresh_token = refreshToken;
  }
}
