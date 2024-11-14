import { Image, StyleSheet, Text, TouchableOpacity, View, ImageBackground, FlatList } from 'react-native';
import React, { useState, useCallback } from 'react';
import LottieView from 'lottie-react-native';
import ground from '../../assets/images/ground.png';
import { getDoc } from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { loadGraph } from '../../api/api';
import { useNavigation } from '@react-navigation/native';

const Jobs = () => {
    const navigation = useNavigation();
    const [selectedJobs, setSelectedJobs] = useState([]); // Store multiple selected jobs
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [uploadError, setUploadError] = useState(false);
    const [success, setSuccess] = useState(false);

    const toggleJobSelection = (job) => {
        setSelectedJobs((prevSelected) =>
            prevSelected.includes(job)
                ? prevSelected.filter((selected) => selected !== job) // Remove job if already selected
                : [...prevSelected, job] // Add job if not selected
        );
    };

    const handleLoad = async () => {
        setLoading(true);
        try {
            const userName = await AsyncStorage.getItem('username');
            const data = {
                "kb_details": selectedJobs.map((job) => ({
                    "kb_name": job,
                    "kb_path": `./storage/${job}`
                }))
            };
            console.log(data);
            const response = await loadGraph(data);
            console.log(response?.message);
            if (response?.message) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 2000);
                setTimeout(() => navigation.navigate('ChatBot'), 2000);
            }
        } catch (error) {
            setUploadError(true); // Show upload error on failure
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const fetch = async () => {
                setLoading(true);
                const userName = await AsyncStorage.getItem('username');
                try {
                    const response = await getDoc(userName);
                    console.log(response);
                    setData(response?.documents); // Safeguarding in case documents are undefined
                } catch (error) {
                    setUploadError(true);
                } finally {
                    setLoading(false);
                }
            };
            fetch();
        }, []) // Empty dependency array ensures this runs on screen focus
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => toggleJobSelection(item)} // Toggle job selection when clicked
            className={`mt-[10px] h-[48px] rounded-[8px] w-full self-center border bg-[#FAFAFA] justify-between flex-row items-center ${selectedJobs.includes(item) ? "border-[#2E6BE5]" : "border-[lightgrey]"}`}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity className='pl-[12px] pr-[12px]'>
                    <View style={{ borderRadius: 50, height: 20, width: 20, borderColor: 'lightgrey', borderWidth: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                        {selectedJobs.includes(item) && (
                            <View style={{ borderRadius: 50, height: 13, width: 13, backgroundColor: '#0D69D7' }} />
                        )}
                    </View>
                </TouchableOpacity>
                <Text className="text-[16px] font-normal text-left font-helvetica-neue" style={[{ color: '#08090A' }]}>
                    {item}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const WelcomeMessage = () => (
        <View style={{ paddingTop: 10 }}>
            <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2 }, styles.font]}>
                Choose <Text style={styles.blueText}>Knowledge Base</Text>
            </Text>
        </View>
    );

    return (
        <ImageBackground className="pl-[20px] pr-[20px]" source={ground} style={styles.container}>
            <View style={{ flex: 1 }}>
                <WelcomeMessage />
                <LottieView source={require('../../assets/lottie/king.json')} autoPlay loop style={{ height: 240, width: 240, marginTop: -10, marginLeft: -30 }} />
                {loading ? (
                    <View>
                        <LottieView source={require('../../assets/lottie/loading.json')} autoPlay loop style={{ height: 250, width: 360, alignSelf: 'center' }} />
                        <Text style={[{ fontSize: 12, color: 'black', fontWeight: '400', letterSpacing: 0.2, alignSelf: 'center', marginTop: -110 }, styles.font]}>Choosing...</Text>
                    </View>
                ) : success ? (
                    <View>
                        <LottieView source={require('../../assets/lottie/success.json')} autoPlay style={{ height: 360, width: 160, alignSelf: 'center', marginTop: -100 }} />
                        <Text style={[{ fontSize: 12, color: 'black', fontWeight: '400', letterSpacing: 0.2, alignSelf: 'center', marginTop: -110 }, styles.font]}>
                            Selected Successfully!
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item}
                        extraData={selectedJobs}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        nestedScrollEnabled={false} // Prevent nested scrolling
                    />
                )}
            </View>
            <TouchableOpacity
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    width: '100%',
                    backgroundColor: 'black',
                    borderRadius: 4,
                    position: 'absolute',
                    bottom: 15
                }}
                onPress={handleLoad}
            >
                <Text style={[{ color: 'white', fontSize: 15, paddingVertical: 14 }, styles.font]}>Fix Document</Text>
            </TouchableOpacity>
        </ImageBackground>
    );
};

export default Jobs;

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
});
