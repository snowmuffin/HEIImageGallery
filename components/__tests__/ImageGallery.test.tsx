import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import ImageGallery from '../ImageGallery'; // 파일 경로를 맞게 설정
import fetchMock from 'jest-fetch-mock';


describe('ImageGallery', () => {
  beforeEach(() => {
    fetchMock.resetMocks(); // fetch 모의 초기화
  });

  it('displays loading indicator while fetching images', async () => {
    fetchMock.mockResponseOnce(() => new Promise(() => {})); // 응답 지연 모의

    const { getByTestId, queryByTestId } = render(<ImageGallery />);



    // 로딩 종료 후 로딩 인디케이터가 사라졌는지 확인
    await waitFor(() => {
      expect(queryByTestId('loading-indicator')).toBeNull();
    });
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


    // 데이터가 렌더링될 때까지 대기
    await waitFor(() => {
      mockData.forEach((image) => {
        expect(getByText(`File: ${image.key}`)).toBeTruthy();
        expect(getByText(`Size: ${image.size} bytes`)).toBeTruthy();
      });
    });
  });

});
