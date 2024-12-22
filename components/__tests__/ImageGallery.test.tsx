import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import ImageGallery from '../ImageGallery'; // 파일 경로를 맞게 설정
import fetchMock from 'jest-fetch-mock';

describe('ImageGallery', () => {
  beforeEach(() => {
    fetchMock.resetMocks(); // fetch 모의 초기화
  });


  it('renders a list of images correctly', async () => {
    const mockData = [
      {
        key: 'image1',
        url: 'https://example.com/image1.jpg',
        size: 1024,
        lastModified: Date.now(),
      },
      {
        key: 'image2',
        url: 'https://example.com/image2.jpg',
        size: 2048,
        lastModified: Date.now(),
      },
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockData)); // 모의 데이터 응답

    const { getByText, getByTestId } = render(<ImageGallery />);


  });
});
