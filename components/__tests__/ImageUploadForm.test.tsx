import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ImageUploader from '../image_uploader'; // 컴포넌트 경로에 맞게 수정

describe('ImageUploader Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<ImageUploader />);
    expect(getByText('이미지 선택')).toBeTruthy();
    expect(getByText('이미지 업로드')).toBeTruthy();
  });

  it('displays selected image preview', () => {
    const { getByText, queryByTestId } = render(<ImageUploader />);

    const selectButton = getByText('이미지 선택');
    fireEvent.press(selectButton);

    // ImagePicker Mock 처리 후 테스트 작성
    // queryByTestId는 특정 id를 가진 요소를 탐색
    expect(queryByTestId('image-preview')).toBeTruthy();
  });

  it('disables upload button while uploading', () => {
    const { getByText } = render(<ImageUploader />);

    const uploadButton = getByText('이미지 업로드');
    fireEvent.press(uploadButton);

    // 업로드 중 상태 확인
    expect(uploadButton.props.disabled).toBe(true);
  });
});
