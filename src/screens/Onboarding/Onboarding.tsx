import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import Page, { PAGE_WIDTH } from './components/Page';
import { BACKGROUND_COLOR, PAGES } from './constants';
// import { AntDesign } from '@expo/vector-icons';
import Dot from './components/Dot';
import right from './assets/skates/right.png';
import { useNavigation } from '@react-navigation/native';
export default function Onboarding() {
  const navigation=useNavigation();
  const translateX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      translateX.value = event.contentOffset.x;
    },
  });

  const activeIndex = useDerivedValue(() => {
    return Math.round(translateX.value / PAGE_WIDTH);
  });

  const scrollRef = useAnimatedRef<ScrollView>();

  const onIconPress = useCallback(() => {
    if (activeIndex.value === PAGES.length - 1){
      navigation.navigate('LoginScreen');
    };
    scrollRef.current?.scrollTo({ x: PAGE_WIDTH * (activeIndex.value + 1) });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef as any}
        style={{ flex: 1 }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {PAGES.map((page, index) => (
          <Page
            key={index.toString()}
            page={page}
            translateX={translateX}
            index={index}
          />
        ))}
      </Animated.ScrollView>
      <View style={styles.footer}>
        {/* Paginator */}
        <View style={[styles.fillCenter, { flexDirection: 'row' }]}>
          {PAGES.map((_, index) => {
            return (
              <Dot
                key={index.toString()}
                index={index}
                activeDotIndex={activeIndex}
              />
            );
          })}
        </View>
        {/* Text Container */}
        <View style={styles.fillCenter}>
          <Text style={styles.text}>CYKLONES</Text>
        </View>
        {/* iconContainer */}
        <View style={styles.fillCenter}>
            <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}} onPress={onIconPress}>
                {/* <Text style={{color:'black',fontSize:14}}>Icon</Text> */}
                <Image source={right} style={{width:30,height:30}}/>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  footer: {
    height: 50,
    marginBottom: 50,
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  fillCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
    color:'#0D69D7'
  },
});
