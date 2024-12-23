
---

# HEI 이미지 갤러리 및 테스트 유틸리티

## 소개

이 프로젝트는 다음과 같은 주요 기능을 제공합니다:
1. **이미지 갤러리 애플리케이션**:
   - Expo를 사용하여 React Native 기반으로 제작된 앱으로, 사용자가 이미지를 업로드하고 AWS S3 버킷의 이미지들을 갤러리 형식으로 확인할 수 있습니다.
2. **테스트 이미지 생성기**:
   - 간단한 GUI를 통해 사용자 지정 설정으로 테스트용 이미지를 생성할 수 있는 유틸리티입니다.
3. **자동 이미지 업로드 스크립트**:
   - 디렉토리 내 이미지를 AWS S3에 자동으로 업로드하는 스크립트입니다.

---

## 주요 구성 요소

- **이미지 업로드 서버** (`server.js`): Express 기반의 AWS S3 연동 서버.
- **이미지 갤러리 앱** (`Expo`): React Native 기반의 모바일 애플리케이션.
- **이미지 생성 GUI** (`testimagegen.py`): PIL과 Tkinter를 활용한 GUI 기반 이미지 생성기.
- **자동 업로드 스크립트** (`uploadImages.js`): Node.js로 작성된 이미지 업로드 스크립트.

---

## 설치 방법

### 1. 저장소 클론
   ```bash
   git clone https://github.com/snowmuffin/HEIImageGallery # 프로젝트 저장소 클론
   cd HEIImageGallery         # 프로젝트 디렉토리로 이동
   ```

### 2. 의존성 설치
- **Node.js 의존성 설치 (Expo 및 서버 관련):**
  ```bash
  npm install
  ```
- **Python 의존성 설치 (이미지 생성 관련):**
  ```bash
  pip install -r requirements.txt # Python 패키지 설치
  ```

### 3. 환경 변수 설정
루트 디렉토리에 `.env` 파일을 생성하고 다음과 같이 설정:
```plaintext
AWS_ACCESS_KEY_ID=your_access_key_id          # AWS 액세스 키
AWS_SECRET_ACCESS_KEY=your_secret_access_key  # AWS 시크릿 키
AWS_REGION=your_aws_region                    # AWS 리전 (예: ap-northeast-2)
S3_BUCKET_NAME=your_bucket_name               # S3 버킷 이름
PROXY_SERVER_URL=http://localhost:3000/upload # 서버 업로드 URL
```

---

## 실행 방법

### 1. 이미지 업로드 서버 실행
```bash
node server.js
```
- Express 서버를 실행하여 S3와의 연동 처리.
- 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

---

### 2. Expo 앱 실행 (이미지 갤러리)
```bash
npm start
```
- Expo 개발 환경을 시작하여 애플리케이션을 실행.
- 터미널에 QR 코드가 표시되며, Expo Go 앱으로 스캔하거나 에뮬레이터에서 실행할 수 있습니다.
- 웹 브라우저에서도 실행 가능 (`http://localhost:8081`).

---

### 3. 이미지 생성 GUI 실행
```bash
python testimagegen.py
```
- 테스트용 이미지를 생성하기 위한 GUI를 실행.
- GUI 창에서 이미지 크기, 색상, 텍스트 등 설정 후 생성 가능.

---

### 4. 자동 이미지 업로드 실행
```bash
node uploadImages.js
```
- `images/` 디렉토리에 저장된 이미지를 AWS S3로 업로드.
- 업로드 성공 여부가 콘솔에 출력됩니다.

---

## 테스트 방법

### 1. 백엔드 및 프론트엔드 테스트
```bash
npm test
```
-  작성된 테스트 스크립트를 실행하여 애플리케이션의 주요 기능을 검증.

### 2. 이미지 업로드 및 생성 테스트
```bash
# GUI를 실행하여 테스트 이미지를 생성
python testimagegen.py

# 생성된 이미지를 S3에 업로드
node uploadImages.js
```
- 이미지를 성공적으로 생성 및 업로드했는지 확인.

---

