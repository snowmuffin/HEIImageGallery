

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config(); 


const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];


const directoryPath = path.join(__dirname, 'images'); // 현재 스크립트 디렉토리 내 'images' 폴더


const PROXY_SERVER_URL = process.env.PROXY_SERVER_URL;

if (!PROXY_SERVER_URL) {
  console.error('Error: PROXY_SERVER_URL is not defined in the environment variables.');
  process.exit(1);
}

/**
 * @param {string} dirPath - 이미지 파일이 있는 디렉토리 경로
 * @returns {Promise<string[]>} - 이미지 파일 경로 배열
 */
const getImageFiles = async (dirPath) => {
  try {
    const files = await fs.promises.readdir(dirPath);
    const imageFiles = files.filter((file) =>
      validImageExtensions.includes(path.extname(file).toLowerCase())
    );
    return imageFiles;
  } catch (error) {
    console.error(`디렉토리 읽기 오류: ${error.message}`);
    return [];
  }
};

/**
 * @param {string} filePath - 업로드할 이미지 파일의 전체 경로
 * @param {string} fileName - 업로드할 이미지 파일의 이름
 * @returns {Promise<void>}
 */
const uploadImage = async (filePath, fileName) => {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath), fileName);

    console.log(`업로드 중: ${fileName}`);

    const response = await axios.post(PROXY_SERVER_URL, form, {
      headers: {
        ...form.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    if (response.status === 200) {
      console.log(`성공: ${fileName}`);
    } else {
      console.error(`실패 (${response.status}): ${fileName}`);
    }
  } catch (error) {
    console.error(`업로드 오류 (${fileName}): ${error.message}`);
  }
};


const uploadAllImages = async () => {
  const imageFiles = await getImageFiles(directoryPath);

  if (imageFiles.length === 0) {
    console.log('업로드할 이미지 파일이 없습니다.');
    return;
  }

  console.log(`총 업로드할 이미지 파일 수: ${imageFiles.length}`);

  for (const fileName of imageFiles) {
    const filePath = path.join(directoryPath, fileName);
    await uploadImage(filePath, fileName);
  }

  console.log('모든 이미지 업로드 완료.');
};


uploadAllImages();
