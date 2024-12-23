import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Modal, Button, Linking, Alert } from 'react-native';

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
  const [modalVisible, setModalVisible] = useState(false); // 모달 표시 상태

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

  // 다운로드 버튼 클릭 핸들러
  const handleDownload = async () => {
    if (!item.url) {
      Alert.alert('Error', '다운로드할 URL이 없습니다.');
      console.error('다운로드 실패: URL이 정의되지 않았습니다.');
      return;
    }
  
    try {
      const supported = await Linking.canOpenURL(item.url); // URL 열기 가능 여부 확인
      if (supported) {
        await Linking.openURL(item.url); // URL 열기
        console.log('다운로드 성공: URL이 열렸습니다.', item.url);
      } else {
        Alert.alert('Error', '이미지 URL을 열 수 없습니다.');
        console.error('다운로드 실패: 지원되지 않는 URL입니다.', item.url);
      }
    } catch (error) {
      console.error('다운로드 중 오류 발생:', error);
      Alert.alert('Error', '다운로드 중 문제가 발생했습니다. 나중에 다시 시도해주세요.');
    }
  };

  return (
    <>
      {/* 이미지 카드 */}
      <TouchableOpacity 
        onPress={() => setModalVisible(true)} // 클릭 시 모달 열기
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
      </TouchableOpacity>

      {/* 상세 정보 모달 */}
      <Modal
        visible={modalVisible} // 모달 표시 여부
        animationType="slide" // 애니메이션 타입
        transparent={true} // 배경 투명 여부
        onRequestClose={() => setModalVisible(false)} // 뒤로가기 시 모달 닫기
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>이미지 상세 정보</Text>
            <Image
              source={{ uri: item.url }}
              style={styles.modalImage}
              resizeMode="contain"
            />
            <Text style={styles.modalText}>파일명: {item.key}</Text>
            <Text style={styles.modalText}>크기: {formatSize(item.size)}</Text>
            <Text style={styles.modalText}>수정 날짜: {formatDate(item.lastModified)}</Text>
            <View style={styles.buttonContainer}>
              <Button title="닫기" onPress={() => setModalVisible(false)} />
              <Button title="다운로드" onPress={handleDownload} color="#007bff" />
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 5,
  },
  modalImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
});

export default ImageGalleryItem;
