import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ImageUploadForm from '@/components/image_uploader';
import ImageGallery from '@/components/ImageGallery';
const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to HEI Image Gallery!</Text>
      <ImageUploadForm/>
      <ImageGallery/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
});

export default App;
