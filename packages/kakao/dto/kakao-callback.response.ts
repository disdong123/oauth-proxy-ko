export type KakaoCallbackResponse = {
  code: string;
  state: string | null;
  error: string | null;
  error_description: string | null;
  redirectUri: string | null;
};
