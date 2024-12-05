import BackgroundService from 'react-native-background-actions';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageBackground, Alert, KeyboardAvoidingView, Platform,FlatList,TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import LottieView from 'lottie-react-native'
import ground from '../../assets/images/ground.png';
import Input from '../../components/Input/input';
import useUploadResume from '../../api/uploadResume';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';
import sea from '../../assets/images/sea.png';
const Contactss = () => {
    const navigation = useNavigation();
    const[contacts,setContacts]=useState([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [uploadError, setUploadError] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);

    useEffect(()=>{
        fetchContacts();
    },[])

    const fetchContacts=()=>{
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
            title: 'Contacts',
            message: 'This app would like to view your contacts.',
            buttonPositive: 'Please accept bare mortal',
        })
        .then((res) => {
                setLoading(true);
                console.log('Permission: ', res);
                Contacts.getAll()
                    .then((contacts) => {
                        // work with contacts
                        console.log(contacts);
                        const sortedContacts = contacts.sort((a, b) => {
                const nameA = a.displayName || 'unknown'; // Default to an empty string if displayName is null
                const nameB = b.displayName || 'unknown'; // Default to an empty string if displayName is null
                return nameA.localeCompare(nameB);
            });
                setContacts(sortedContacts);
                setFilteredContacts(sortedContacts);
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);
                Alert.alert(e);
                setLoading(false);
            });
        })
        .catch((error) => {
            console.error('Permission error: ', error);
            setLoading(false);
            });
    }
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query) {
            const filtered = contacts?.filter(contact =>
                contact?.displayName?.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredContacts(filtered);
        } else {
            setFilteredContacts(contacts);
        }
    };




    const WelcomeMessage = () => {
        return (
            <View style={{ paddingTop: 10 }}>
                <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2 }, styles.font]}>
                    Your<Text style={styles.blueText}> Contacts</Text>
                </Text>
                <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2 }, styles.font]}>
                    <Text style={styles.blueText}>Integration</Text> ensured
                </Text>
            </View>
        );
    };

    const renderContactItem = ({ item }) => (
        <TouchableOpacity style={styles.contactItem} onPress={()=>{
            navigation.navigate('ContactChat',{image:item.hasThumbnail?item.thumbnailPath:null,name:item.displayName,number:item.phoneNumbers[0].number})
        }}>
            <Image
                source={
                    item.hasThumbnail
                        ? { uri: item.thumbnailPath }
                        : require('../../assets/images/profile.png')
                }
                style={styles.contactImage}
            />
            <View style={styles.contactDetails}>
                <Text style={styles.contactName}>{item.displayName}</Text>
                {item.phoneNumbers.length > 0 && (
                    <Text style={styles.contactNumber}>{item.phoneNumbers[0].number}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100} // Adjust this offset as needed
        >
            <ImageBackground source={ground} style={styles.container}>

                    <View style={{paddingHorizontal:20}}>
                    <WelcomeMessage/>
                    <View style={styles.searchContainer}>
                    <Image tintColor={'grey'} source={sea} style={{height:16,width:16}} />
                        <TextInput
                            placeholder="Search Contacts"
                            placeholderTextColor={'lightgrey'}
                            value={searchQuery}
                            onChangeText={handleSearch}
                            style={styles.searchInput}
                            />
                    </View>
                            </View>
                <View style={{ flexGrow: 1,paddingHorizontal:20 }}>
                    {
                        loading ? (
                            <View>
                                <LottieView source={require('../../assets/lottie/loading.json')} autoPlay loop style={{ height: 250, width: 360, alignSelf: 'center' }} />
                                <Text style={[{ fontSize: 12, color: 'black', fontWeight: '400', letterSpacing: 0.2, alignSelf: 'center', marginTop: -110 }, styles.font]}>fetching contacts...</Text>
                            </View>
                        ) : (
                            <View>

                        <FlatList
                            data={filteredContacts}
                            keyExtractor={(item) => item.recordID}
                            renderItem={renderContactItem}
                            contentContainerStyle={{ paddingVertical: 8 }}
                        />
                               
                            </View>
                        )
                    }
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}

export default Contactss

const styles = StyleSheet.create({
    inputContainer: {
        // marginBottom: 24,
    },
    label: {
        fontFamily: 'Lato-Bold',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 24,
        marginBottom: 8,
    },
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
    errorText: {
        fontFamily: 'Helvetica Neue',
        color: 'red',
        fontSize: 12,
        marginTop: -20,
        marginBottom: 12,
    },
    contactItem: {
        flexDirection: 'row',
        paddingVertical: 12,
        backgroundColor: 'rgba(200,100,0.5)',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    contactImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    contactDetails: {
        flex: 1,
    },
    contactName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    contactNumber: {
        fontSize: 14,
        color: '#888',
    },
    searchContainer: {
        marginVertical: 6,
        backgroundColor: 'rgba(143, 158, 163, 0.2)',
        borderRadius: 50,
        paddingHorizontal: 15,
        marginTop:8,
        flexDirection:'row',
        alignItems:'center'
    },
    searchInput: {
        fontSize: 16,
        color: 'black',
        paddingLeft:8

    },
})
