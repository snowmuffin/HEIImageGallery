// components/ImageGallery.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, useWindowDimensions, FlatList } from 'react-native';
import ImageGalleryItem from './ImageGalleryItem'; // 생성한 컴포넌트 경로

const PROXY_SERVER_URL = 'http://localhost:3000/images';

type ImageItem = {
  key: string;
  url: string;
  size: number;
  lastModified: string;
};

type ImageGalleryProps = {
  isDesktop: boolean;
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ isDesktop }) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { width: windowWidth } = useWindowDimensions();


  const numColumns = isDesktop ? 8 : 2;


  const imageMargin = 10;
  const totalMargin = imageMargin * (numColumns + 1);
  const imageWidth = (windowWidth - totalMargin) / numColumns;

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(PROXY_SERVER_URL);
      if (!response.ok) throw new Error('Failed to fetch images');
      const data: ImageItem[] = await response.json();
      

      console.log(`총 로드된 파일 수: ${data.length}`);
      
      const validImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
      const filteredImages = data.filter((item) => {
        const extension = item.key.split('.').pop()?.toLowerCase();
        return extension && validImageExtensions.includes(extension);
      });
      
 
      console.log(`총 로드된 이미지 수: ${filteredImages.length}`);
      

      const excludedFiles = data.filter((item) => {
        const extension = item.key.split('.').pop()?.toLowerCase();
        return !extension || !validImageExtensions.includes(extension);
      });
      if (excludedFiles.length > 0) {
        console.log('이미지로 간주되지 않은 파일들:', excludedFiles);
      }
      
      setImages(filteredImages);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const renderItem = ({ item }: { item: ImageItem }) => (
    <ImageGalleryItem item={item} isDesktop={isDesktop} imageWidth={imageWidth} />
  );

  const keyExtractor = (item: ImageItem) => item.key;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (images.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noImagesText}>이미지가 없습니다.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={images}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={numColumns}
      contentContainerStyle={styles.galleryContainer}
      columnWrapperStyle={isDesktop ? { justifyContent: 'space-between' } : undefined}
    />
  );
};

const styles = StyleSheet.create({
  galleryContainer: {
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImagesText: {
    fontSize: 16,
    color: '#999',
  },
});

export default ImageGallery;
