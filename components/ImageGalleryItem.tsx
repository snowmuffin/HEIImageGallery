import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

type ImageItem = {
  key: string;
  url: string;
  size: number;
  lastModified: string;
};

type ImageGalleryItemProps = {
  item: ImageItem;
  isDesktop: boolean;
  imageWidth: number;
};

const ImageGalleryItem: React.FC<ImageGalleryItemProps> = React.memo(({ item, isDesktop, imageWidth }) => {
  const formatSize = (size: number) => {
    if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    if (size >= 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${size} bytes`;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <View 
      testID={`image-gallery-item-${item.key}`} 
      style={[styles.card, { width: imageWidth, marginBottom: 10 }]}
    >
      <Image
        source={{ uri: item.url }}
        style={[styles.image, { width: imageWidth, height: imageWidth }]}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle} numberOfLines={1}>
          {item.key}
        </Text>
        <Text style={styles.infoText}>크기: {formatSize(item.size)}</Text>
        <Text style={styles.infoText}>날짜: {formatDate(item.lastModified)}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    borderRadius: 10,
    backgroundColor: '#f0f0f0', // 로딩 중 기본 배경
  },
  infoContainer: {
    padding: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 12,
    color: '#555',
  },
});

export default ImageGalleryItem;