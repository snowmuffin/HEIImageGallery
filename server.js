const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer();

app.use(cors());

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const params = {
    Bucket: 'hei-test-storage',
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
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

app.get('/images', async (req, res) => {
  const params = {
    Bucket: 'hei-test-storage',
    MaxKeys: 1000,
  };

  const validImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  let images = [];
  let nonImages = [];
  let isTruncated = true;
  let continuationToken = null;

  try {
    while (isTruncated) {
      const currentParams = { ...params };
      if (continuationToken) {
        currentParams.ContinuationToken = continuationToken;
      }

      const data = await s3.listObjectsV2(currentParams).promise();

      console.log(`총 로드된 파일 수: ${data.Contents.length}`);

      const filteredImages = data.Contents.filter((item) => {
        const extension = item.Key.split('.').pop()?.toLowerCase();
        return extension && validImageExtensions.includes(extension);
      }).map((item) => ({
        key: item.Key,
        size: item.Size,
        lastModified: item.LastModified,
        url: `https://hei-test-storage.s3.ap-northeast-2.amazonaws.com/${item.Key}`,
        isImage: true,
      }));

      const filteredNonImages = data.Contents.filter((item) => {
        const extension = item.Key.split('.').pop()?.toLowerCase();
        return !extension || !validImageExtensions.includes(extension);
      }).map((item) => ({
        key: item.Key,
        size: item.Size,
        lastModified: item.LastModified,
        url: `https://hei-test-storage.s3.ap-northeast-2.amazonaws.com/${item.Key}`,
        isImage: false,
      }));

      images = images.concat(filteredImages);
      nonImages = nonImages.concat(filteredNonImages);

      console.log(`현재까지 로드된 이미지 수: ${images.length}`);
      console.log(`현재까지 로드된 비이미지 파일 수: ${nonImages.length}`);

      isTruncated = data.IsTruncated;
      continuationToken = data.NextContinuationToken;
    }

    res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching image list:', error);
    res.status(500).send('Error fetching image list');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Proxy server is running on http://localhost:${port}`);
});
