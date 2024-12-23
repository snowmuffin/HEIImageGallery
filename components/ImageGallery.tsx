import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, useWindowDimensions, FlatList } from 'react-native';
import ImageGalleryItem from './ImageGalleryItem';

// 서버에서 이미지를 가져오기 위한 URL 설정
const PROXY_SERVER_URL = 'http://14.39.20.106:3000/images';

// 이미지 항목의 타입 정의
type ImageItem = {
  key: string; // 이미지의 고유 키
  url: string; // 이미지 URL
  size: number; // 이미지 크기 (바이트)
  lastModified: string; // 마지막 수정 날짜
};

// 컴포넌트의 Props 타입 정의
type ImageGalleryProps = {
  isDesktop: boolean; // 데스크톱 환경 여부를 나타냄
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ isDesktop }) => {
  const [images, setImages] = useState<ImageItem[]>([]); // 이미지 목록 상태 관리
  const [loading, setLoading] = useState(false); // 로딩 상태 관리

  const { width: windowWidth } = useWindowDimensions(); // 화면 너비 가져오기
  const numColumns = isDesktop ? 8 : 2; // 데스크톱 여부에 따라 열 수 설정
  const imageMargin = 1; // 이미지 간 마진
  const totalMargin = isDesktop ? 400 : 70; // 전체 마진 설정
  const imageWidth = (windowWidth - totalMargin) / numColumns; // 이미지 너비 계산

  // 이미지를 서버에서 가져오는 함수
  const fetchImages = async () => {
    setLoading(true); // 로딩 상태 활성화
    try {
      const response = await fetch(PROXY_SERVER_URL); // 서버에 요청 보내기
      if (!response.ok) throw new Error('Failed to fetch images'); // 요청 실패 처리
      const data: ImageItem[] = await response.json(); // JSON 응답 변환

      // 유효한 이미지 확장자 필터링
      const validImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
      const filteredImages = data.filter((item) => {
        const extension = item.key.split('.').pop()?.toLowerCase(); // 확장자 추출
        if (!extension) return false;
        return validImageExtensions.includes(extension); // 유효한 확장자인지 확인
      });

      setImages(filteredImages); // 필터링된 이미지 목록 저장
    } catch (error) {
      console.error('Error fetching images:', error); // 에러 로그 출력
    } finally {
      setLoading(false); // 로딩 상태 비활성화
    }
  };

  // 컴포넌트가 처음 렌더링될 때 이미지를 가져옴
  useEffect(() => {
    fetchImages();
  }, []);

  // 각 이미지 항목을 렌더링하는 함수
  const renderItem = ({ item }: { item: ImageItem }) => (
    <ImageGalleryItem item={item} isDesktop={isDesktop} imageWidth={imageWidth} />
  );

  // 리스트의 키 추출 함수
  const keyExtractor = (item: ImageItem) => item.key;

  // 로딩 중일 때 표시할 컴포넌트
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // 이미지가 없을 때 표시할 컴포넌트
  if (images.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noImagesText}>이미지가 없습니다.</Text>
      </View>
    );
  }

  // 이미지 리스트를 렌더링하는 FlatList 컴포넌트
  return (
    <FlatList
      data={images} // 데이터 소스
      renderItem={renderItem} // 각 항목 렌더링 함수
      keyExtractor={keyExtractor} // 고유 키 추출
      numColumns={numColumns} // 열 개수 설정
      contentContainerStyle={[
        styles.galleryContainer,
        { paddingHorizontal: imageMargin }, // 갤러리 패딩 설정
      ]}
      columnWrapperStyle={
        isDesktop ? { marginHorizontal: imageMargin / 2 } : undefined // 열 간 마진 설정
      }
    />
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  galleryContainer: {
    alignItems: 'flex-start',
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
