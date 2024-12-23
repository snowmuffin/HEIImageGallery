import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ImageUploadForm from '../image_uploader';
import * as ImagePicker from 'expo-image-picker';
import fetchMock from 'jest-fetch-mock';

// ImagePicker와 fetch를 Mock 처리
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' },
}));

describe('ImageUploadForm', () => {
  // 공통 테스트 환경 초기화
  beforeEach(() => {
    fetchMock.resetMocks(); // fetch Mock 초기화
    console.log('=== 테스트 환경 초기화 완료 ===');
  });

  // 공통 함수: ImagePicker Mock 설정
  const mockImagePicker = (canceled: boolean, uri?: string) => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
      canceled,
      assets: canceled ? [] : [{ uri }],
    });
    console.log(`[Mock] ImagePicker 설정 완료 (취소 여부: ${canceled})`);
  };

  // 공통 함수: fetch Mock 설정
  const mockFetchResponse = (response: object, status = 200) => {
    fetchMock.mockResponseOnce(JSON.stringify(response), { status });
    console.log(`[Mock] fetch 응답 설정 완료 (상태: ${status})`);
  };

  it('이미지 미리보기를 표시합니다.', async () => {
    console.log('[Test] 이미지 미리보기 테스트 시작');

    // ImagePicker Mock: 이미지 선택 성공
    mockImagePicker(false, 'mock-image-uri');

    const { getByText, queryByTestId } = render(<ImageUploadForm />);
    console.log('[Render] 컴포넌트 렌더링 완료');

    // "이미지 선택" 버튼 클릭
    const selectButton = getByText('이미지 선택');
    console.log('[Action] 이미지 선택 버튼 클릭');
    await act(async () => fireEvent.press(selectButton));

    // 이미지 미리보기 확인
    console.log('[Check] 이미지 미리보기 표시 확인');
    await waitFor(() => {
      expect(queryByTestId('image-preview')).toBeTruthy();
    });

    console.log('[Test] 이미지 미리보기 테스트 완료');
  });

  it('이미지 선택이 취소되었을 때 미리보기를 표시하지 않습니다.', async () => {
    console.log('[Test] 이미지 선택 취소 테스트 시작');

    // ImagePicker Mock: 이미지 선택 취소
    mockImagePicker(true);

    const { getByText, queryByTestId } = render(<ImageUploadForm />);
    console.log('[Render] 컴포넌트 렌더링 완료');

    // "이미지 선택" 버튼 클릭
    const selectButton = getByText('이미지 선택');
    console.log('[Action] 이미지 선택 버튼 클릭');
    await act(async () => fireEvent.press(selectButton));

    // 이미지 미리보기가 표시되지 않는지 확인
    console.log('[Check] 이미지 미리보기 미표시 확인');
    await waitFor(() => {
      expect(queryByTestId('image-preview')).toBeNull();
    });

    console.log('[Test] 이미지 선택 취소 테스트 완료');
  });

  it('이미지를 성공적으로 업로드합니다.', async () => {
    console.log('[Test] 이미지 업로드 테스트 시작');

    // ImagePicker Mock: 이미지 선택 성공
    mockImagePicker(false, 'mock-image-uri');

    // fetch Mock: 업로드 성공 응답
    mockFetchResponse({ message: 'Upload successful!' });

    const { getByText, queryByTestId } = render(<ImageUploadForm />);
    console.log('[Render] 컴포넌트 렌더링 완료');

    // "이미지 선택" 버튼 클릭
    const selectButton = getByText('이미지 선택');
    console.log('[Action] 이미지 선택 버튼 클릭');
    await act(async () => fireEvent.press(selectButton));

    // 이미지 미리보기 확인
    console.log('[Check] 이미지 미리보기 표시 확인');
    await waitFor(() => {
      expect(queryByTestId('image-preview')).toBeTruthy();
    });

    // "이미지 업로드" 버튼 클릭
    const uploadButton = getByText('이미지 업로드');
    console.log('[Action] 이미지 업로드 버튼 클릭');
    await act(async () => fireEvent.press(uploadButton));

    // fetch 호출 확인
    console.log('[Check] fetch 호출 확인');
    expect(fetchMock).toHaveBeenCalledTimes(1); // fetch가 호출되었는지 확인

    console.log('[Test] 이미지 업로드 테스트 완료');
  });
});
