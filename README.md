# Jobcapture
어쩌다 만든 잡캔 자동 로그인 및 스샷 캡처

## 설치
### 1. 기본 세팅
```javascript
// index.js L:10 - L:13
document.querySelector('input#client_id').value = 'iacryl'; // 회사명을 입력
document.querySelector('input#email').value = '아이디'; // 아이디를 입력
document.querySelector('input#password').value = '비밀번호'; // 비밀번호를 입력
```

### 2. npm install
```
npm i
```

## 실행
```
npm start
```
실행 후 screenshot.png 를 실행해서 확인  
screenshot.png를 실행한 상태에서 `npm start`를 하면 편하게 쓸 수 있음