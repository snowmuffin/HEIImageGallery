module.exports = {
    preset: 'jest-expo',
    testEnvironment: 'jsdom', // 브라우저 환경 모방
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironmentOptions: {
        url: 'http://localhost:3000', // 기본 URL과 포트 설정
      },
  };
  