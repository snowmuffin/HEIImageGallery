import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';

const PROXY_SERVER_URL = 'http://localhost:3000/images';

type ImageItem = {
  key: string;
  url: string;
  size: number;
  lastModified: string;
};

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [numColumns, setNumColumns] = useState(1); // 열 수 상태 관리

  // 화면 크기에 따라 열 수 조정
  useEffect(() => {
    const { width } = Dimensions.get('window');
    
    if (width > 1200) {
      setNumColumns(4); // 화면 너비가 1200 이상이면 4열
    } else if (width > 800) {
      setNumColumns(3); // 화면 너비가 800 이상이면 3열
    } else if (width > 500) {
      setNumColumns(2); // 화면 너비가 500 이상이면 2열
    } else {
      setNumColumns(1); // 그 이하에서는 1열
    }

    const handleResize = () => {
      const { width } = Dimensions.get('window');
      if (width > 1200) {
        setNumColumns(4);
      } else if (width > 800) {
        setNumColumns(3);
      } else if (width > 500) {
        setNumColumns(2);
      } else {
        setNumColumns(1);
      }
    };

    // 화면 크기 변화 시 처리
    Dimensions.addEventListener('change', handleResize);

    return () => {
      Dimensions.removeEventListener('change', handleResize);
    };
  }, []);

  // 이미지 데이터 fetching
  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(PROXY_SERVER_URL);
      if (!response.ok) throw new Error('Failed to fetch images');
      const data: ImageItem[] = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <FlatList
        data={images}
        renderItem={({ item }: { item: ImageItem }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.url }} style={styles.image} />
            <Text style={styles.text}>File: {item.key}</Text>
            <Text style={styles.text}>Size: {item.size} bytes</Text>
            <Text style={styles.text} testID={`uploaded-time-${item.key}`}>
              Uploaded: {new Date(item.lastModified).toLocaleString()}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.key}
        numColumns={numColumns} // 화면 크기에 맞는 열 수
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapperStyle : null} // 여러 열일 때만 적용
        key={numColumns} // numColumns 값에 따라 FlatList를 강제로 리렌더링
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    flex: 1,
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
  columnWrapperStyle: {
    justifyContent: 'space-between', // 열 간격 조정
  },
});

export default ImageGallery;
