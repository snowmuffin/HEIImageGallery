// App.tsx
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import ImageUploadForm from '@/components/image_uploader';
import ImageGallery from '@/components/ImageGallery';

const App = () => {
  const [isDesktop, setIsDesktop] = useState(Dimensions.get('window').width > 600);

  useEffect(() => {
    const handleResize = ({ window }: { window: any }) => {
      setIsDesktop(window.width > 600);
    };

    const subscription = Dimensions.addEventListener('change', handleResize);
    return () => subscription?.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {isDesktop ? (
        <View style={styles.flexRow}>
          <View style={styles.sidebarDesktop}>
            <Text style={styles.title}>Image Upload</Text>
            <ImageUploadForm />
          </View>
          <View style={styles.mainContent}>
            <Text style={styles.title}>Gallery</Text>
            <ImageGallery isDesktop={isDesktop} />
          </View>
        </View>
      ) : (
        <View style={styles.flexColumn}>
          <View style={styles.uploadSection}>
            <Text style={styles.title}>Image Upload</Text>
            <ImageUploadForm />
          </View>
          <View style={styles.gallerySection}>
            <Text style={styles.title}>Gallery</Text>
            <ImageGallery isDesktop={false}/>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  flexRow: {
    flexDirection: 'row',
    gap: 20,
    flex: 1,
  },
  flexColumn: {
    flexDirection: 'column',
    flex: 2,
    gap: 20,
    flexGrow: 1,
  },
  sidebarDesktop: {
    flex: 1,
    maxWidth: 300,
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  mainContent: {
    flex: 2,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  uploadSection: {
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 20,
    minHeight: '30%',
    borderRadius: 8,
  },
  gallerySection: {
    width: '100%',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 1,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default App;
