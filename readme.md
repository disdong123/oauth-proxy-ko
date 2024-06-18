# oauth2-proxy-ko
## Settings
### Environment variables
| Option         | Type   | Description |
|----------------|--------|------------|
| --client-id    | string | KAKAO      |
| --redirect-uri | string | localhost  |
### Run
```shell

```

## IDP 
### Kakao
- Base url: https://kauth.kakao.com
- Required: REST_API_KEY, REDIRECT_URI, OIDC 여부, 

#### Without oauth2-proxy-ko
```mermaid
sequenceDiagram
	participant Resource Owner
	participant Client
	participant Resource Server

	Resource Owner ->> Client: Request kakao login
	Client -->> Resource Owner: Redirect to kakao login page
	note right of Client: /oauth/authorize?<br>client_id=${REST_API_KEY}&<br>redirect_uri=${REDIRECT_URI}&<br>response_type=code&<br>scope=openid
	Resource Owner ->> Resource Server: Request kakao login page
	note right of Resource Server: /oauth/authorize?<br>client_id=${REST_API_KEY}&<br>redirect_uri=${REDIRECT_URI}&<br>response_type=code&<br>scope=openid
	Resource Server ->> Resource Owner: Response kakao login page
	Resource Owner ->> Resource Server: Login
	Resource Server ->> Resource Server: Login success
	Resource Server -->> Resource Owner: Redirect to {REDIRECT_URI}
	note right of Resource Server: ${REDIRECT_URI}?code=${AUTHORIZE_CODE}
	Resource Owner ->> Client: Request {REDIRECT_URI}
	note right of Client: ${REDIRECT_URI}?code=${AUTHORIZE_CODE}<br>code 의 유효기간은 1분
	Client ->> Client: Request acesstoken
	note right of Client: POST "/oauth/token?redirect_uri=${REDIRECT_URI}" <br>-d {grant_type: "authorization_code",client_id:"{REST_API_KEY}",code:"{AUTHORIZE_CODE}"},
	note right of Client: 응답: {access_token, id_token, refresh_token, token_type ...}
```

#### With oauth2-proxy-ko 
### Naver

## Ref
- https://github.com/oauth2-proxy/oauth2-proxy