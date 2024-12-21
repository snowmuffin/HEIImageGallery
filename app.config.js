import 'dotenv/config';
export default {
    expo: {
      name: "heiimagegallery",
      slug: "heiimagegallery",
      version: "1.0.0",
      extra: {
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_REGION: process.env.AWS_REGION,
      },
    },
  };
  