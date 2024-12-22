import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PROXY_SERVER_URL = 'http://localhost:3000/upload';

interface ImageUploadFormProps {
  onUploadSuccess: () => void; // 업로드 성공 후 호출할 함수
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ onUploadSuccess }) => {
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // 업로드 진행 상태

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage?.assets?.[0]?.uri) {
      Alert.alert('Error', '이미지를 선택해주세요.');
      return;
    }

    const fileUri = selectedImage.assets[0].uri;
    const fileName = selectedImage.assets[0].fileName || 'example.jpg';

    setUploading(true);
    setUploadProgress(0); // 초기화

    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('file', blob, fileName);

      const uploadResponse = await fetch(PROXY_SERVER_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (uploadResponse.ok) {
        await uploadResponse.json();
        Alert.alert('Success', '이미지 업로드가 완료되었습니다.');
        setSelectedImage(null);
        onUploadSuccess(); // 업로드 후 갱신을 위한 콜백 호출
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      Alert.alert('Error', '이미지 업로드 중 문제가 발생했습니다.');
    } finally {
      setUploading(false);
      setUploadProgress(0); // 업로드 후 진행 상태 초기화
    }
  };

  const renderProgress = () => {
    if (uploading) {
      return (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Uploading: {Math.round(uploadProgress * 100)}%</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Button title="이미지 선택" onPress={pickImage} />
      {selectedImage?.assets?.[0]?.uri && (
        <Image testID="image-preview" source={{ uri: selectedImage.assets[0].uri }} style={styles.imagePreview} />
      )}
      {renderProgress()}
      <Button
        title={uploading ? '업로드 중...' : '이미지 업로드'}
        onPress={uploadImage}
        disabled={uploading || !selectedImage}
        color="#007BFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  imagePreview: {
    width: '80%',  // 화면 크기에 맞게 유동적으로 크기 조정
    height: 200,
    marginVertical: 16,
    borderRadius: 8,
  },
  progressContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ImageUploadForm;
