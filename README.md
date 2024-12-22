
# HEI 이미지 갤러리 애플리케이션

## 소개

이 프로젝트는 사용자가 이미지를 업로드하고, 업로드된 이미지를 갤러리 형식으로 확인할 수 있는 애플리케이션입니다. 백엔드로는 Express 서버를 사용하여 AWS S3 버킷과 연동하였습니다.

## 기능

- **이미지 업로드:** 사용자가 로컬 디바이스에서 이미지를 선택하여 S3 버킷에 업로드합니다.
- **갤러리 보기:** 업로드된 이미지를 목록 형식으로 확인할 수 있습니다.

## 기술 스택

- **프론트엔드:** React Native (Expo), TypeScript
- **백엔드:** Express.js
- **스토리지:** AWS S3 버킷

## 설치 및 실행 방법

1. **프로젝트 클론:**

   ```bash
   git clone [프로젝트 저장소 URL]
   cd [프로젝트 디렉토리]
   ```

2. **의존성 설치:**

   ```bash
   npm install
   ```

3. **환경 변수 설정:**

   루트 디렉토리에 `.env` 파일을 생성하고 다음과 같이 설정합니다:

   ```env
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   AWS_REGION=ap-northeast-2
   ```

4. **서버 실행:**

   ```bash
   node server.js
   ```

   서버는 `http://localhost:3000`에서 실행됩니다.

5. **앱 실행:**

   ```bash
   npm start
   ```

   웹 브라우저 혹은 Expo Go 앱을 사용하여 QR 코드를 스캔하거나, 에뮬레이터에서 실행하여 애플리케이션을 확인할 수 있습니다.

## 테스트

1. **백엔드/프론트엔드 테스트:**

   ```bash
   npm test
   ```


