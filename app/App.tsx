import React, { useState } from 'react';
import { Container, Box, Typography, Paper, Grid } from '@mui/material';
import ImageUploadForm from '@/components/image_uploader';
import ImageGallery from '@/components/ImageGallery';

const App = () => {
  const [galleryKey, setGalleryKey] = useState(0);  // 갤러리 상태 변경을 위한 key 관리

  const handleUploadSuccess = () => {
    setGalleryKey(prevKey => prevKey + 1);  // 갤러리 상태를 변경하여 강제로 갱신
  };

  return (
    <Container maxWidth="lg" style={styles.container}>
      <Box style={styles.header}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to HEI Image Gallery!
        </Typography>
      </Box>
      <Box style={styles.content}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper style={styles.paper}>
              <Typography variant="h6" gutterBottom>
                Upload Your Image
              </Typography>
              <ImageUploadForm onUploadSuccess={handleUploadSuccess} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper style={styles.paper}>
              <Typography variant="h6" gutterBottom>
                Gallery
              </Typography>
              <ImageGallery key={galleryKey} />  {/* galleryKey가 변경되면 갤러리 컴포넌트가 새로 렌더링됨 */}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // 화면의 최소 높이
    padding: '20px',
    backgroundColor: '#f9f9f9',
    margin: '0 auto',
    maxWidth: '100%', // 최대 너비 설정
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  content: {
    flex: 1, // 내용이 남는 공간을 차지하게 설정
    display: 'flex',
    flexDirection: 'column',
  },
  paper: {
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
};

export default App;
