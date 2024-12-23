const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 환경변수에서 필요한 값 가져오기
const port = process.env.PORT || 3000; // 포트 번호
const s3BucketName = process.env.S3_BUCKET_NAME; // S3 버킷 이름
const s3Region = process.env.AWS_REGION; // AWS 리전
const validImageExtensions = (process.env.VALID_IMAGE_EXTENSIONS || 'jpg,jpeg,png,gif,bmp,webp').split(',');

// AWS S3 클라이언트 생성
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // AWS 액세스 키 ID
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // AWS 시크릿 액세스 키
  region: s3Region, // AWS 리전 설정
});

// multer를 사용하여 파일 업로드 처리
const upload = multer();

// CORS 설정 (모든 도메인 허용)
app.use(cors());

// 파일 업로드 엔드포인트
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file; // 업로드된 파일
  if (!file) {
    return res.status(400).send('No file uploaded.'); // 파일이 없는 경우 에러 응답
  }

  // S3 업로드 파라미터 설정
  const params = {
    Bucket: s3BucketName, // 환경변수에서 가져온 S3 버킷 이름
    Key: file.originalname, // 업로드 파일 이름
    Body: file.buffer, // 파일 내용
    ContentType: file.mimetype, // 파일 MIME 타입
  };

  // S3에 파일 업로드
  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Upload error:', err); // 업로드 실패 시 에러 로그
      return res.status(500).send('S3 upload failed.'); // 에러 응답
    }
    console.log('Upload successful:', data); // 업로드 성공 로그
    res.status(200).send({ message: 'Upload successful!', data }); // 성공 응답
  });
});

// 이미지 목록 가져오기 엔드포인트
app.get('/images', async (req, res) => {
  const params = {
    Bucket: s3BucketName, // 환경변수에서 가져온 S3 버킷 이름
    MaxKeys: 1000, // 한 번에 가져올 최대 파일 수
  };

  let images = []; // 이미지 파일 목록
  let nonImages = []; // 비이미지 파일 목록
  let isTruncated = true; // 추가 페이지 확인 플래그
  let continuationToken = null; // 다음 페이지 토큰

  try {
    while (isTruncated) {
      const currentParams = { ...params };
      if (continuationToken) {
        currentParams.ContinuationToken = continuationToken; // 다음 페이지 토큰 설정
      }

      // S3 객체 목록 가져오기
      const data = await s3.listObjectsV2(currentParams).promise();

      console.log(`총 로드된 파일 수: ${data.Contents.length}`); // 로드된 파일 수 로그

      // 이미지 파일 필터링
      const filteredImages = data.Contents.filter((item) => {
        const extension = item.Key.split('.').pop()?.toLowerCase(); // 파일 확장자 추출
        return extension && validImageExtensions.includes(extension); // 유효한 확장자인지 확인
      }).map((item) => ({
        key: item.Key,
        size: item.Size,
        lastModified: item.LastModified,
        url: `https://${s3BucketName}.s3.${s3Region}.amazonaws.com/${item.Key}`, // 환경변수를 사용한 URL 생성
        isImage: true,
      }));

      // 비이미지 파일 필터링
      const filteredNonImages = data.Contents.filter((item) => {
        const extension = item.Key.split('.').pop()?.toLowerCase();
        return !extension || !validImageExtensions.includes(extension); // 비유효 확장자
      }).map((item) => ({
        key: item.Key,
        size: item.Size,
        lastModified: item.LastModified,
        url: `https://${s3BucketName}.s3.${s3Region}.amazonaws.com/${item.Key}`, // 환경변수를 사용한 URL 생성
        isImage: false,
      }));

      images = images.concat(filteredImages); // 이미지 파일 목록 업데이트
      nonImages = nonImages.concat(filteredNonImages); // 비이미지 파일 목록 업데이트

      console.log(`현재까지 로드된 이미지 수: ${images.length}`); // 현재까지 로드된 이미지 파일 수 로그
      console.log(`현재까지 로드된 비이미지 파일 수: ${nonImages.length}`); // 현재까지 로드된 비이미지 파일 수 로그

      isTruncated = data.IsTruncated; // 추가 페이지 존재 여부
      continuationToken = data.NextContinuationToken; // 다음 페이지 토큰 업데이트
    }

    res.status(200).json(images); // 이미지 목록 반환
  } catch (error) {
    console.error('Error fetching image list:', error); // 에러 로그 출력
    res.status(500).send('Error fetching image list'); // 에러 응답
  }
});

// 서버 실행
app.listen(port, '0.0.0.0', () => {
  console.log(`Proxy server is running on http://localhost:${port}`); // 서버 시작 로그
});
