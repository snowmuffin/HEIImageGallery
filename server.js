const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config(); // .env 파일에서 환경 변수 로드

const app = express();
const port = 3000;

// S3 클라이언트 설정
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // 환경 변수에서 가져옴
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // 환경 변수에서 가져옴
  region: process.env.AWS_REGION, // 환경 변수에서 가져옴
});

// 파일 업로드 미들웨어 설정
const upload = multer();

// CORS 활성화
app.use(cors());

// POST 요청 처리 (클라이언트 -> 프록시 서버 -> S3)
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const params = {
    Bucket: 'hei-test-storage', // S3 버킷 이름
    Key: file.originalname, // 업로드 파일 이름
    Body: file.buffer,
    ContentType: file.mimetype, // MIME 타입
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).send('S3 upload failed.');
    }
    console.log('Upload successful:', data);
    res.status(200).send({ message: 'Upload successful!', data });
  });
});

// S3 이미지 목록 가져오기
app.get('/images', async (req, res) => {
  const params = {
    Bucket: 'hei-test-storage',
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    const images = data.Contents.map((item) => ({
      key: item.Key,
      size: item.Size,
      lastModified: item.LastModified,
      url: `https://hei-test-storage.s3.ap-northeast-2.amazonaws.com/${item.Key}`,
    }));

    res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching image list:', error);
    res.status(500).send('Error fetching image list');
  }
});

// 서버 실행
app.listen(port, () => {
  console.log(`Proxy server is running on http://localhost:${port}`);
});
