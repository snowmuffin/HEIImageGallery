module.exports = {
    preset: 'jest-expo',
    testEnvironment: 'jsdom', // 브라우저 환경 모방
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // 추가 설정 파일 지정
  };
  