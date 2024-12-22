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
    console.log('=== 테스트 초기화 완료 ===');
  });

  it('displays selected image preview', async () => {
    console.log('[Test] 이미지 미리보기 테스트 시작');

    // Mock ImagePicker
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'mock-image-uri' }],
    });
    console.log('[Mock] ImagePicker 설정 완료');

    const { getByText, queryByTestId } = render(<ImageUploadForm onUploadSuccess={function (): void {
      throw new Error('Function not implemented.');
    } } />);
    console.log('[Render] 컴포넌트 렌더링 완료');

    // 이미지 선택 버튼 클릭
    const selectButton = getByText('이미지 선택');
    console.log('[Action] 이미지 선택 버튼 클릭');
    await act(async () => {
      fireEvent.press(selectButton);
    });

    console.log('[Check] 이미지 미리보기 표시 확인');
    await waitFor(() => {
      expect(queryByTestId('image-preview')).toBeTruthy();
    });

    console.log('[Test] 이미지 미리보기 테스트 완료');
  });

  it('handles image selection cancellation', async () => {
    console.log('[Test] 이미지 선택 취소 처리 테스트 시작');

    // Mock ImagePicker cancellation
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
      canceled: true,
      assets: [],
    });
    console.log('[Mock] ImagePicker 취소 상태 설정 완료');

    const { getByText, queryByTestId } = render(<ImageUploadForm onUploadSuccess={function (): void {
      throw new Error('Function not implemented.');
    } } />);
    console.log('[Render] 컴포넌트 렌더링 완료');

    // 이미지 선택 버튼 클릭
    const selectButton = getByText('이미지 선택');
    console.log('[Action] 이미지 선택 버튼 클릭');
    await act(async () => {
      fireEvent.press(selectButton);
    });

    console.log('[Check] 이미지 미리보기가 표시되지 않음 확인');
    await waitFor(() => {
      expect(queryByTestId('image-preview')).toBeNull();
    });

    console.log('[Test] 이미지 선택 취소 처리 테스트 완료');
  });

  it('uploads image successfully', async () => {
    console.log('[Test] 이미지 업로드 성공 테스트 시작');

    // Mock ImagePicker
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'mock-image-uri' }],
    });
    console.log('[Mock] ImagePicker 설정 완료');

    // Mock fetch for proxy server upload
    fetchMock.mockResponseOnce(
      JSON.stringify({ message: 'Upload successful!' }),
      { status: 200 }
    );
    console.log('[Mock] fetch 모의 응답 설정 완료');

    const { getByText, queryByTestId } = render(<ImageUploadForm onUploadSuccess={function (): void {
      throw new Error('Function not implemented.');
    } } />);
    console.log('[Render] 컴포넌트 렌더링 완료');

    // 이미지 선택 버튼 클릭
    const selectButton = getByText('이미지 선택');
    console.log('[Action] 이미지 선택 버튼 클릭');
    await act(async () => {
      fireEvent.press(selectButton);
    });

    console.log('[Check] 이미지 미리보기 표시 확인');
    await waitFor(() => {
      expect(queryByTestId('image-preview')).toBeTruthy();
    });

    // 이미지 업로드 버튼 클릭
    const uploadButton = getByText('이미지 업로드');
    console.log('[Action] 이미지 업로드 버튼 클릭');
    await act(async () => {
      fireEvent.press(uploadButton);
    });

    console.log('[Check] fetch 호출 확인');
    expect(fetch).toHaveBeenNthCalledWith(1, 'mock-image-uri');

    console.log('[Check] 업로드 버튼 상태 확인');
    await waitFor(() => {
      expect(getByText('이미지 업로드')).toBeTruthy();
      expect(uploadButton.props.disabled).toBe(false);
    });

    console.log('[Test] 이미지 업로드 성공 테스트 완료');
  });
});
