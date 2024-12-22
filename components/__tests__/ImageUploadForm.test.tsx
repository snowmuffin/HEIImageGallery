import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ImageUploadForm from '../image_uploader';
import * as ImagePicker from 'expo-image-picker';

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' },
}));

describe('ImageUploadForm', () => {
  it('displays selected image preview', async () => {
    // Mock ImagePicker
    ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'mock-image-uri' }],
    });

    const { getByText, queryByTestId } = render(<ImageUploadForm />);

    // 이미지 선택 버튼 클릭
    const selectButton = getByText('이미지 선택');
    fireEvent.press(selectButton);

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
    fireEvent.press(selectButton);

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



    const { getByText, queryByTestId } = render(<ImageUploadForm />);

    // 이미지 선택 버튼 클릭
    const selectButton = getByText('이미지 선택');
    fireEvent.press(selectButton);

    // 이미지 미리보기 표시 확인
    await waitFor(() => {
      expect(queryByTestId('image-preview')).toBeTruthy();
    });

    // 이미지 업로드 버튼 클릭
    const uploadButton = getByText('이미지 업로드');
    fireEvent.press(uploadButton);

    // 업로드 중 버튼 상태 확인
    expect(getByText('업로드 중...')).toBeTruthy();
    expect(uploadButton.props.disabled).toBe(true);

    // 업로드 완료 후 버튼 상태 및 Alert 확인
    await waitFor(() => {
      expect(getByText('이미지 업로드')).toBeTruthy();
      expect(uploadButton.props.disabled).toBe(false);
    });
  });
});