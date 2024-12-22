import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';

const PROXY_SERVER_URL = 'http://localhost:3000/images'; // 프록시 서버 URL

// 이미지 아이템의 타입 정의
type ImageItem = {
  key: string;
  url: string;
  size: number;
  lastModified: string;
};

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 프록시 서버에서 이미지 목록 가져오기
  const fetchImages = async () => {
    setLoading(true);

    try {
      const response = await fetch(PROXY_SERVER_URL);

      if (response.ok) {
        const data: ImageItem[] = await response.json();
        setImages(data);
      } else {
        throw new Error('Failed to fetch images');
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      Alert.alert('오류', '이미지 목록을 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // 이미지 렌더링 함수
  const renderItem = ({ item }: { item: ImageItem }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.url }} style={styles.image} />
      <Text style={styles.text}>File: {item.key}</Text>
      <Text style={styles.text}>Size: {item.size} bytes</Text>
      <Text style={styles.text}>Uploaded: {new Date(item.lastModified).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={images}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
});

export default ImageGallery;
