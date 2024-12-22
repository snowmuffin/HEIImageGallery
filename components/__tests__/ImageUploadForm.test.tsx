import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ImageUploadForm from '../image_uploader';
import * as ImagePicker from 'expo-image-picker';
import fetchMock from 'jest-fetch-mock';
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' },
}));

describe('ImageUploadForm', () => {
  beforeEach(() => {
    fetchMock.resetMocks(); // fetch 모의 초기화
  });
  it('displays selected image preview', async () => {
    // Mock ImagePicker
    jest.mock('expo-image-picker', () => ({
      launchImageLibraryAsync: jest.fn(),
      MediaTypeOptions: { Images: 'Images' },
    }));
    
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'mock-image-uri' }],
    });

    const { getByText, queryByTestId } = render(<ImageUploadForm />);

    // 이미지 선택 버튼 클릭
    const selectButton = getByText('이미지 선택');
    await act(async () => {
      fireEvent.press(selectButton);
    });

    // 이미지 선택 후 미리보기 표시 확인
    await waitFor(() => {
      expect(queryByTestId('image-preview')).toBeTruthy();
    });
  });

  it('handles image selection cancellation', async () => {
    // Mock ImagePicker cancellation
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
      canceled: true,
      assets: [],
    });

    const { getByText, queryByTestId } = render(<ImageUploadForm />);

    // 이미지 선택 버튼 클릭
    const selectButton = getByText('이미지 선택');
    await act(async () => {
      fireEvent.press(selectButton);
    });

    // 이미지 미리보기가 표시되지 않음 확인
    await waitFor(() => {
      expect(queryByTestId('image-preview')).toBeNull();
    });
  });

  it('uploads image successfully', async () => {
    // Mock ImagePicker
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'mock-image-uri' }],
    });
    fetchMock.mockResponseOnce(async () => {
      return new Response(new Blob(['mock image data'])).text();
    });

    // Mock fetch for proxy server upload
    fetchMock.mockResponseOnce(
      JSON.stringify({ message: 'Upload successful!' }), // 업로드 성공 응답
      { status: 200 }
    );
    const { getByText, queryByTestId } = render(<ImageUploadForm />);

    // 이미지 선택 버튼 클릭
    const selectButton = getByText('이미지 선택');
    await act(async () => {
      fireEvent.press(selectButton);
    });

    // 이미지 미리보기 표시 확인
    await waitFor(() => {
      expect(queryByTestId('image-preview')).toBeTruthy();
    });

    // 이미지 업로드 버튼 클릭
    const uploadButton = getByText('이미지 업로드');
    await act(async () => {
      fireEvent.press(uploadButton);
    });

    expect(fetch).toHaveBeenNthCalledWith(1, 'mock-image-uri');

    // 업로드 완료 후 버튼 상태 및 Alert 확인
    await waitFor(() => {
      expect(getByText('이미지 업로드')).toBeTruthy();
      expect(uploadButton.props.disabled).toBe(false);
    });
  });
});
