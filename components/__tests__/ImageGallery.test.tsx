import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ImageGallery from '../ImageGallery'; // 파일 경로를 맞게 설정
import fetchMock from 'jest-fetch-mock';

describe('ImageGallery', () => {
  beforeEach(() => {
    fetchMock.resetMocks(); // fetch 모의 초기화
  });

  it('renders a list of images correctly', async () => {
    const mockData = [
      {
        key: 'image1.jpg', // 확장자 포함
        url: 'https://example.com/image1.jpg',
        size: 1024,
        lastModified: Date.now(),
      },
      {
        key: 'image2.png', // 확장자 포함
        url: 'https://example.com/image2.png',
        size: 2048,
        lastModified: Date.now(),
      },
    ];
  
    fetchMock.mockResponseOnce(JSON.stringify(mockData));
  
    const { getAllByTestId } = render(<ImageGallery isDesktop={false} />);
  
    await waitFor(() => {
      const items = getAllByTestId(/^image-gallery-item-/);
      expect(items).toHaveLength(2); // 2개의 항목 렌더링 확인
    });
  },10000);

  it('renders a message when no images are available', async () => {
    // Mock empty response
    fetchMock.mockResponseOnce(JSON.stringify([]));

    const { getByText } = render(<ImageGallery isDesktop={false} />);

    // 빈 데이터 확인
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/images');
      expect(getByText('이미지가 없습니다.')).toBeTruthy();
    });
  });
});
