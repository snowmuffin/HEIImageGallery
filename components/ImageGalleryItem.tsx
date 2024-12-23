import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

// 이미지 항목의 타입 정의
type ImageItem = {
  key: string; // 이미지의 고유 키
  url: string; // 이미지 URL
  size: number; // 이미지 크기 (바이트)
  lastModified: string; // 마지막 수정 날짜
};

// 컴포넌트의 Props 타입 정의
type ImageGalleryItemProps = {
  item: ImageItem; // 개별 이미지 항목
  isDesktop: boolean; // 데스크톱 환경 여부
  imageWidth: number; // 이미지의 가로 크기
};

// ImageGalleryItem 컴포넌트 정의
const ImageGalleryItem: React.FC<ImageGalleryItemProps> = React.memo(({ item, isDesktop, imageWidth }) => {
  // 이미지 크기를 포맷하는 함수
  const formatSize = (size: number) => {
    if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`; // MB 단위로 변환
    if (size >= 1024) return `${(size / 1024).toFixed(2)} KB`; // KB 단위로 변환
    return `${size} bytes`; // 바이트 단위
  };

  // 날짜를 포맷하는 함수
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`; // YYYY-MM-DD HH:mm 형식으로 반환
  };

  return (
    <View 
      testID={`image-gallery-item-${item.key}`} // 테스트용 ID 설정
      style={[styles.card, { width: imageWidth, marginBottom: 10 }]} // 카드 스타일 적용 및 가로 크기 조정
    >
      <Image
        source={{ uri: item.url }} // 이미지 URI 설정
        style={[styles.image, { width: imageWidth, height: imageWidth }]} // 이미지 스타일 적용
        resizeMode="cover" // 이미지 크기 맞추기
      />
      <View style={styles.infoContainer}> {/* 이미지 정보 컨테이너 */}
        <Text style={styles.infoTitle} numberOfLines={1}> {/* 제목 표시 (한 줄 제한) */}
          {item.key}
        </Text>
        <Text style={styles.infoText}>크기: {formatSize(item.size)}</Text> {/* 이미지 크기 정보 */}
        <Text style={styles.infoText}>날짜: {formatDate(item.lastModified)}</Text> {/* 마지막 수정 날짜 정보 */}
      </View>
    </View>
  );
});

// 스타일 정의
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
    backgroundColor: '#f0f0f0',
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
