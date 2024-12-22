import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PROXY_SERVER_URL = 'http://localhost:3000/upload';

const ImageUploadForm: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerResult | null>(null);
  const [uploading, setUploading] = useState(false);

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

    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('file', blob, fileName);

      const uploadResponse = await fetch(PROXY_SERVER_URL, {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        await uploadResponse.json();
        Alert.alert('Success', '이미지 업로드가 완료되었습니다.');
        setSelectedImage(null);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      Alert.alert('Error', '이미지 업로드 중 문제가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {selectedImage?.assets?.[0]?.uri && (
        <Image
          testID="image-preview"
          source={{ uri: selectedImage.assets[0].uri }}
          style={styles.imagePreview}
        />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>이미지 선택</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, uploading && styles.disabledButton]}
          onPress={uploadImage}
          disabled={uploading}
        >
          <Text style={styles.buttonText}>{uploading ? '업로드 중...' : '이미지 업로드'}</Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // 버튼들을 중앙에 정렬
    alignItems: 'center', // 버튼 텍스트와 동일한 높이 정렬
    gap: 12, // 버튼 간격 조정
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
