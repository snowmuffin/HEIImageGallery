import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ImageGallery from '../ImageGallery'; // 컴포넌트 경로 설정
import fetchMock from 'jest-fetch-mock';

describe('ImageGallery', () => {
  // 테스트 환경 초기화
  beforeEach(() => {
    fetchMock.resetMocks(); // fetch Mock 초기화
    console.log('=== 테스트 환경 초기화 완료 ===');
  });

  // 공통 함수: Mock fetch 데이터 설정
  const mockFetchResponse = (response: object[], logMessage: string) => {
    fetchMock.mockResponseOnce(JSON.stringify(response));
    console.log(`[Mock] ${logMessage}`);
  };

  // 테스트 케이스 1: 이미지 목록이 렌더링되는지 확인
  it('이미지 목록을 올바르게 렌더링합니다.', async () => {
    console.log('[Test] 이미지 목록 렌더링 테스트 시작');

    // Mock 데이터
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

    mockFetchResponse(mockData, '이미지 데이터 설정 완료');

    // 컴포넌트 렌더링
    const { getAllByTestId } = render(<ImageGallery isDesktop={false} />);
    console.log('[Render] ImageGallery 컴포넌트 렌더링 완료');

    // 이미지 렌더링 확인
    await waitFor(() => {
      const items = getAllByTestId(/^image-gallery-item-/);
      console.log(`[Check] 렌더링된 이미지 갯수: ${items.length}`);
      expect(items).toHaveLength(2); // 렌더링된 이미지 수 확인
    });

    console.log('[Test] 이미지 목록 렌더링 테스트 완료');
  });

  // 테스트 케이스 2: 이미지가 없을 때 메시지가 표시되는지 확인
  it('이미지가 없을 경우 메시지를 표시합니다.', async () => {
    console.log('[Test] 이미지 없음 메시지 테스트 시작');

    // 빈 Mock 데이터
    mockFetchResponse([], '빈 이미지 데이터 설정 완료');

    // 컴포넌트 렌더링
    const { getByText } = render(<ImageGallery isDesktop={false} />);
    console.log('[Render] ImageGallery 컴포넌트 렌더링 완료');

    // "이미지가 없습니다." 메시지 확인
    await waitFor(() => {
      console.log('[Check] "이미지가 없습니다." 메시지 표시 확인');
      expect(getByText('이미지가 없습니다.')).toBeTruthy(); // 메시지 확인
    });

    console.log('[Test] 이미지 없음 메시지 테스트 완료');
  });
});
