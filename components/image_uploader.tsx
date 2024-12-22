import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PROXY_SERVER_URL = 'http://127.0.0.1:3000/upload'; // 프록시 서버 URL

const ImageUploadForm = () => {
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerResult | null>(null);
  const [uploading, setUploading] = useState(false);

  // 이미지 선택 핸들러
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

  // 이미지 업로드 핸들러 (프록시 서버로 업로드)
  const uploadImage = async () => {
    if (!selectedImage || !selectedImage.assets) {
      Alert.alert('Error', '이미지를 선택해주세요.');
      return;
    }

    const fileUri = selectedImage.assets[0].uri;

    setUploading(true);

    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('file', blob, 'example.jpg'); // 파일 이름 지정

      const uploadResponse = await fetch(PROXY_SERVER_URL, {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        console.log('Upload result:', result);
        Alert.alert('Success', '이미지 업로드가 완료되었습니다.');
        setSelectedImage(null);
      } else {
        throw new Error('프록시 서버에서 업로드 실패');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Error', '이미지 업로드 중 문제가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Test Alert"
        onPress={() => Alert.alert('Test', 'This is a test alert')}
      />
      <Button title="이미지 선택" onPress={pickImage} />
      {selectedImage && selectedImage.assets && (
        <Image
          testID="image-preview"
          source={{ uri: selectedImage.assets[0].uri }}
          style={styles.imagePreview}
        />
      )}
      <Button
        title={uploading ? '업로드 중...' : '이미지 업로드'}
        onPress={uploadImage}
        disabled={uploading}
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
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginVertical: 16,
    borderRadius: 8,
  },
});

export default ImageUploadForm;
