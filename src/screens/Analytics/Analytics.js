import { ScrollView, StyleSheet, Text, View,ImageBackground } from 'react-native'
import React from 'react'
import GeneralAnalytics from '../GeneralAnalytics'
import ground from '../../assets/images/ground.png';
import SalesTrend from './SalesTrend2';
const Analytics = () => {
    const WelcomeMessage = () => {
        return (
            <View style={{ paddingTop: 10 }}>
                <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2 }, styles.font]}>
                   Dashboard  <Text style={styles.blueText}>Analytics</Text>
                </Text>
                <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2 }, styles.font]}>
                    <Text style={styles.blueText}>Track </Text>  End to end
                </Text>
            </View>
        );
    };

  return (
    <ImageBackground source={ground} style={styles.container}>
    <ScrollView contentContainerStyle={{ flexGrow: 1,paddingHorizontal:20 ,paddingTop:5,gap:0}}>
        <WelcomeMessage/>
      <GeneralAnalytics/>
      <SalesTrend/>
    </ScrollView>
    </ImageBackground>
  )
}

export default Analytics

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    },
    blueText: {
        color: '#0D69D7',
        fontSize: 19,
    },
    font: {
        fontFamily: 'Helvetica Neue',
    },
})