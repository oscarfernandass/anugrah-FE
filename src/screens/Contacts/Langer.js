import React, { useState,useEffect } from 'react';
import { FlatList, Image, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import ground from '../../assets/images/ground.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sea from '../../assets/images/sea.png';
import { useNavigation } from '@react-navigation/native';
const Langer = () => {
    const navigation=useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredLanguages, setFilteredLanguages] = useState([]);
    const [currentSelection, setCurrentSelection] = useState('English'); // Temporary selection
    const [selectedLanguage, setSelectedLanguage] = useState('English'); // Fixed language selection
    const languages = ['English', 'हिंदी', 'বাংলা', 'తెలుగు', 'தமிழ்', 'मराठी'];

    const fetchLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem('selected1');
            if (savedLanguage) {
                setSelectedLanguage(savedLanguage);
                setCurrentSelection(savedLanguage);
            }
        } catch (error) {
            console.error('Error fetching saved language:', error);
        }
    };
    useEffect(() => {
        fetchLanguage();
    }, []);

    useEffect(() => {
        setFilteredLanguages(languages);
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query) {
            const filtered = languages.filter(language =>
                language.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredLanguages(filtered);
        } else {
            setFilteredLanguages(languages);
        }
    };

    const languageMapping = {
        'English': 'english',
        'हिंदी': 'hindi',
        'বাংলা': 'bengali',
        'తెలుగు': 'telugu',
        'தமிழ்': 'tamil',
        'मराठी': 'marathi',
    };
    
    const handleFixLanguage = async () => {
        try {
            const englishForm = languageMapping[currentSelection];
            await AsyncStorage.setItem('selectedLanguage1', englishForm); // Save the English form
            await AsyncStorage.setItem('selected1', currentSelection); // Save the English form
            ToastAndroid.show(
                `Language set to ${englishForm}`,
                ToastAndroid.SHORT
            );
            fetchLanguage();
        } catch (error) {
            console.error('Error saving language:', error);
        }finally{
            navigation.goBack();
        }
    };
    

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => setCurrentSelection(item)} // Update temporary selection
            style={[
                styles.languageItem,
                currentSelection === item ? styles.selectedBorder : styles.defaultBorder
            ]}
        >
            <View style={styles.row}>
                <TouchableOpacity style={styles.iconContainer}>
                    <View style={styles.icon}>
                        {currentSelection === item && <View style={styles.selectedIcon} />}
                    </View>
                </TouchableOpacity>
                <Text style={styles.languageText}>{item}</Text>
            </View>
        </TouchableOpacity>
    );

    const WelcomeMessage = () => {
        return (
            <View style={{ paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2 }, styles.font]}>
                        Multiple<Text style={styles.blueText}> Languages</Text>
                    </Text>
                    <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2 }, styles.font]}>
                        <Text style={styles.blueText}>Enhanced</Text> Communication
                    </Text>
                </View>
                <View style={styles.selectedLanguageContainer}>
                    <Text style={styles.selectedLanguageText}>
                        {selectedLanguage || 'None'}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100} // Adjust this offset as needed
        >
            <ImageBackground source={ground} style={styles.container}>
                <View style={{ paddingHorizontal: 20 }}>
                    <WelcomeMessage />
                    <View style={styles.searchContainer}>
                        <Image tintColor={'grey'} source={sea} style={{height:16,width:16}} />
                        <TextInput
                            placeholder="Search Languages"
                            placeholderTextColor={'lightgrey'}
                            value={searchQuery}
                            onChangeText={handleSearch}
                            style={styles.searchInput}
                        />
                    </View>
                </View>
                <View style={{ flexGrow: 1, paddingHorizontal: 20 }}>
                    <FlatList
                        data={filteredLanguages}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingVertical: 8 }}
                    />
                </View>
                <View style={{paddingHorizontal:20}}>
                <TouchableOpacity
                    style={styles.fixLanguageButton}
                    onPress={handleFixLanguage}
                    >
                    <Text style={styles.fixLanguageText}>Fix Language</Text>
                </TouchableOpacity>
                    </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

export default Langer;

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
    searchContainer: {
        marginVertical: 6,
        backgroundColor: 'rgba(143, 158, 163, 0.2)',
        borderRadius: 50,
        paddingHorizontal: 15,
        // justifyContent:'space-around',
        alignItems:'center',
        flexDirection:'row',
        marginTop: 8,
    },
    searchInput: {
        fontSize: 16,
        color: 'black',
        paddingLeft:8
    },
    languageItem: {
        marginTop: 10,
        height: 48,
        borderRadius: 8,
        width: '100%',
        alignSelf: 'center',
        backgroundColor: '#FAFAFA',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    defaultBorder: {
        borderWidth: 1,
        borderColor: 'lightgrey',
    },
    selectedBorder: {
        borderWidth: 1,
        borderColor: '#2E6BE5',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        paddingHorizontal: 12,
    },
    icon: {
        borderRadius: 50,
        height: 20,
        width: 20,
        borderColor: 'lightgrey',
        borderWidth: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedIcon: {
        borderRadius: 50,
        height: 13,
        width: 13,
        backgroundColor: '#0D69D7',
    },
    languageText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#08090A',
    },
    selectedLanguageContainer: {
        backgroundColor: '#0D69D7',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        height: 32,
        marginTop: 6,
    },
    selectedLanguageText: {
        color: 'white',
        fontSize: 14,
        paddingHorizontal: 12,
    },
    fixLanguageButton: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%',
        backgroundColor: 'black',
        borderRadius: 4,
        position: 'absolute',
        bottom: 15,
        paddingHorizontal: 20,
    },
    fixLanguageText: {
        color: 'white',
        fontSize: 15,
        paddingVertical: 14,
        fontFamily: 'Helvetica Neue',
    },
});
