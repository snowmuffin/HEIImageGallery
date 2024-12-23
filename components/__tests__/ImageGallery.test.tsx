import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ImageGallery from '../ImageGallery'; // 파일 경로를 맞게 설정
import fetchMock from 'jest-fetch-mock';

describe('ImageGallery', () => {
  beforeEach(() => {
    fetchMock.resetMocks(); // fetch 모의 초기화
    console.log('=== 테스트 초기화 완료 ===');
  });

  it('renders a list of images correctly', async () => {
    console.log('[Test] 이미지 목록 렌더링 테스트 시작');

    // Mock 이미지 데이터 생성
    const mockData = [
      {
        key: 'image1.jpg',
        url: 'https://example.com/image1.jpg',
        size: 1024,
        lastModified: Date.now(),
      },
      {
        key: 'image2.png',
        url: 'https://example.com/image2.png',
        size: 2048,
        lastModified: Date.now(),
      },
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockData)); // Mock 응답 설정
    console.log('[Mock] fetch 응답 설정 완료');

    const { getAllByTestId } = render(<ImageGallery isDesktop={false} />); // 컴포넌트 렌더링
    console.log('[Render] ImageGallery 컴포넌트 렌더링 완료');

    // 이미지 렌더링 확인
    await waitFor(() => {
      const items = getAllByTestId(/^image-gallery-item-/);
      console.log(`[Check] 렌더링된 이미지 갯수: ${items.length}`);
      expect(items).toHaveLength(2); // 2개의 이미지 렌더링 확인
    });

    console.log('[Test] 이미지 목록 렌더링 테스트 완료');
  }, 10000);

  it('renders a message when no images are available', async () => {
    console.log('[Test] 이미지 없음 메시지 테스트 시작');

    fetchMock.mockResponseOnce(JSON.stringify([])); // 빈 응답 Mock 설정
    console.log('[Mock] fetch 빈 응답 설정 완료');

    const { getByText } = render(<ImageGallery isDesktop={false} />); // 컴포넌트 렌더링
    console.log('[Render] ImageGallery 컴포넌트 렌더링 완료');

    // 빈 데이터 처리 확인
    await waitFor(() => {
      console.log('[Check] "이미지가 없습니다." 메시지 표시 확인');
      expect(getByText('이미지가 없습니다.')).toBeTruthy(); // 메시지 확인
    });

    console.log('[Test] 이미지 없음 메시지 테스트 완료');
  });
});
