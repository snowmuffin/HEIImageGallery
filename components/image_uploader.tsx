import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// 업로드를 처리할 서버 URL
const PROXY_SERVER_URL = 'http://localhost:3000/upload';

const ImageUploadForm: React.FC = () => {
  // 선택된 이미지 상태 관리
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerResult | null>(null);
  // 업로드 진행 상태 관리
  const [uploading, setUploading] = useState(false);

  // 이미지를 선택하는 함수
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // 이미지 파일만 허용
      allowsEditing: true, // 이미지 편집 허용
      quality: 1, // 이미지 품질 최대화
    });

    if (!result.canceled) {
      setSelectedImage(result); // 선택된 이미지 상태 업데이트
    }
  };

  // 이미지를 서버에 업로드하는 함수
  const uploadImage = async () => {
    if (!selectedImage?.assets?.[0]?.uri) {
      Alert.alert('Error', '이미지를 선택해주세요.'); // 이미지가 선택되지 않은 경우 경고
      return;
    }

    const fileUri = selectedImage.assets[0].uri; // 선택된 이미지의 URI
    const fileName = selectedImage.assets[0].fileName || 'example.jpg'; // 기본 파일 이름 설정

    setUploading(true); // 업로드 상태 활성화

    try {
      // 선택된 파일을 blob 형태로 변환
      const response = await fetch(fileUri);
      const blob = await response.blob();

      // FormData 객체 생성 및 파일 추가
      const formData = new FormData();
      formData.append('file', blob, fileName);

      // 서버에 POST 요청으로 업로드
      const uploadResponse = await fetch(PROXY_SERVER_URL, {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        await uploadResponse.json(); // 서버 응답 처리
        Alert.alert('Success', '이미지 업로드가 완료되었습니다.');
        setSelectedImage(null); // 선택된 이미지 상태 초기화
      } else {
        throw new Error('Upload failed'); // 업로드 실패 처리
      }
    } catch (error) {
      Alert.alert('Error', '이미지 업로드 중 문제가 발생했습니다.'); // 에러 발생 시 경고
    } finally {
      setUploading(false); // 업로드 상태 비활성화
    }
  };

  return (
    <View style={styles.container}>
      {/* 선택된 이미지 미리보기 */}
      {selectedImage?.assets?.[0]?.uri && (
        <Image
          testID="image-preview" // 테스트용 ID
          source={{ uri: selectedImage.assets[0].uri }} // 이미지 URI 설정
          style={styles.imagePreview} // 스타일 적용
        />
      )}
      <View style={styles.buttonContainer}>
        {/* 이미지 선택 버튼 */}
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>이미지 선택</Text>
        </TouchableOpacity>
        {/* 이미지 업로드 버튼 */}
        <TouchableOpacity
          style={[styles.button, uploading && styles.disabledButton]} // 업로드 중 비활성화 스타일 적용
          onPress={uploadImage}
          disabled={uploading} // 업로드 중 버튼 비활성화
        >
          <Text style={styles.buttonText}>{uploading ? '업로드 중...' : '이미지 업로드'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  imagePreview: {
    width: 70,
    height: 70,
    marginVertical: 16,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ImageUploadForm;
