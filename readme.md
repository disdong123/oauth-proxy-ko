# oauth2-proxy-ko
## Settings
### Environment variables
| Option         | Type   | Example               |
|----------------|--------|-----------------------|
| --client-id    | string |  |
| --redirect-uri | string |  |
### Run
```shell

```
## Docs
### Flow
```mermaid
sequenceDiagram
	participant Client
	participant LB
	participant Oauth2-proxy
	note right of Oauth2-proxy: skip /home/**
	participant Resource-server
	participant Upstream
	
	critical Skip url
		Client ->> LB: Request /home/
		LB ->> Oauth2-proxy: Request /home/
		Oauth2-proxy ->> Oauth2-proxy: Skip url
		Oauth2-proxy -->> Upstream: Request /home/
	end
	
	critical Non-skip url without cookies
		Client ->> LB: Request /users/me
		LB ->> Oauth2-proxy: Request /users/me
		Oauth2-proxy ->> Oauth2-proxy: no cookies
		Oauth2-proxy -->> LB: Redirect to login page
		LB -->> Client: Redirect to login page
		Client ->> Resource-server: Request login page
		Resource-server ->> Client: Response login page
		Client ->> Resource-server: Request login
		Resource-server ->> Resource-server: Success
		Resource-server -->> Client: Redirect to redirect_uri
		Client ->> LB: Request redirect_uri
		LB ->> Oauth2-proxy: Request redirect_uri
		Oauth2-proxy ->> Resource-server: Request token with authorize_code
		Resource-server ->> Oauth2-proxy: Response access/refresh token
		Oauth2-proxy ->> Oauth2-proxy: Set cookies
		Oauth2-proxy -->> LB: Redirect to /users/me
		LB -->> Client: Redirect to /users/me
		Client ->> LB: Request /users/me
		LB ->> Oauth2-proxy: Request /users/me
		Oauth2-proxy ->> Oauth2-proxy: Valid cookies
		Oauth2-proxy ->> Upstream: Request /users/me
		Upstream ->> Upstream: Process /users/me
		Upstream ->> Oauth2-proxy: Response ok
		Oauth2-proxy ->> LB: Response ok
		LB ->> Client: Response ok
	end
	
	critical Non-skip url with expired cookies
		Client ->> LB: Request /users/me
		LB ->> Oauth2-proxy: Request /users/me
		Oauth2-proxy ->> Oauth2-proxy: expired cookies
		Oauth2-proxy ->> Resource-server: Request accesstoken
		Resource-server ->> Oauth2-proxy: Response accesstoken
		Oauth2-proxy ->> Oauth2-proxy: Set cookies
		Oauth2-proxy -->> LB: Redirect to /users/me
		LB -->> Client: Redirect to /users/me
		Client ->> LB: Request /users/me
		LB ->> Oauth2-proxy: Request /users/me
		Oauth2-proxy ->> Oauth2-proxy: Valid cookies
		Oauth2-proxy ->> Upstream: Request /users/me
		Upstream ->> Upstream: Process /users/me
		Upstream ->> Oauth2-proxy: Response ok
		Oauth2-proxy ->> LB: Response ok
		LB ->> Client: Response ok
	end
```

### IDP 
#### Kakao
- Base url: https://kauth.kakao.com
- Required: REST_API_KEY, REDIRECT_URI, OIDC 여부, 

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
	Client ->> Resource Server: Request acesstoken
	note right of Client: POST "/oauth/token?redirect_uri=${REDIRECT_URI}" <br>-d {grant_type: "authorization_code",client_id:"{REST_API_KEY}",code:"{AUTHORIZE_CODE}"},
	Resource Server ->> Client: Response accesstoken
	note right of Client: 응답: {access_token, id_token, refresh_token, token_type ...}
```

#### Naver
### Todo...
- httponly, secure cookies
  - 개발자 도구로 열어서 토큰을 탈취하는건?
- 서명 -> 무결성 보장
  - 민감정보 -> 암호화 후 서명
  - https://www.npmjs.com/package/fastify-secure-session/v/2.2.1
  - AES, HMAC SHA256
- upstream forwarding -> proxy server?
  - https://github.com/fastify/fastify-http-proxy
  - https://www.npmjs.com/package/http-proxy-middleware

## Ref
- https://github.com/oauth2-proxy/oauth2-proxy