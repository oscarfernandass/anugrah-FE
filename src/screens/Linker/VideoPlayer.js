import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Video } from 'react-native-video';
import { useRoute } from '@react-navigation/native';

const VideoPlayer = () => {
  const route = useRoute();
  const { uri } = route.params || {};

  if (!uri) {
    console.error('Video URI is not provided');
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Video
        source={{ uri }}
        style={styles.videoPlayer}
        controls
        resizeMode="contain"
        onError={(e) => console.error('Video Error: ', e)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
});

export default VideoPlayer;