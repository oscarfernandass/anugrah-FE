import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Image } from 'react-native';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import snipe from '../assets/images/snipe.png';

const Spinner = () => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(20, { duration: 3000 }); // Increases scale to 5 over 1.5 seconds
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: 1 - scale.value / 5, // Gradually fades out as it zooms in
    };
  });

  return (
    <View style={styles.container}>
      {/* <Animated.View style={animatedStyle}> */}
        <Image source={snipe} style={{ height: 160, width: 160 ,borderColor:'white', borderWidth:2, borderRadius:8 }} />
      {/* </Animated.View> */}
        <Text style={[{ color: 'white', fontSize: 16 }, styles.font]}>Anugrah</Text>
      <ActivityIndicator style={{marginTop:20}} size={30} color={'white'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D69D7',
    gap:10
  },
  font: {
    fontFamily: 'Helvetica Neue',
  },
});

export default Spinner;
