# HEI 이미지 갤러리 및 테스트 유틸리티

## 소개

이 프로젝트는 다음과 같은 주요 기능을 제공합니다:
1. **이미지 갤러리 애플리케이션**:
   - 사용자가 이미지를 업로드하고 AWS S3 버킷에서 갤러리 형식으로 확인할 수 있는 기능.
2. **테스트 이미지 생성기**:
   - 간단한 GUI를 통해 사용자 지정 설정으로 테스트용 이미지를 생성할 수 있는 유틸리티.
3. **자동 이미지 업로드 스크립트**:
   - 디렉토리 내 이미지를 AWS S3에 자동으로 업로드하는 CLI 스크립트.

## 주요 구성 요소

- **이미지 업로드 서버** (`server.js`): Express 기반의 AWS S3 연동 서버.
- **이미지 생성 GUI** (`testimagegen.py`): PIL과 Tkinter를 활용한 GUI 기반 이미지 생성기.
- **자동 업로드 스크립트** (`uploadImages.js`): Node.js로 작성된 이미지 업로드 스크립트.

## 설치 방법

1. **저장소 클론**

   ```bash
   git clone [프로젝트 저장소 URL]
   cd [프로젝트 디렉토리]
   ```

2. **의존성 설치:**

   ```bash
   npm install
   pip install -r requirements.txt
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


