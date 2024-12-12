import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
  Alert,
  Platform
} from 'react-native';
import LottieView from 'lottie-react-native';
import Contacts from 'react-native-contacts';
import { useNavigation } from '@react-navigation/native';
import ground from '../../assets/images/ground.png';
import sea from '../../assets/images/sea.png';
import add from '../../assets/images/add.png';

const Contactss = () => {
  const navigation = useNavigation();
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [urName, setUrName] = useState('');
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
        buttonPositive: 'Please accept',
      });

      if (permission === PermissionsAndroid.RESULTS.GRANTED) {
        setLoading(true);
        const contactsList = await Contacts.getAll();
        const sortedContacts = contactsList.sort((a, b) => {
          const nameA = a.displayName || 'unknown';
          const nameB = b.displayName || 'unknown';
          return nameA.localeCompare(nameB);
        });
        setContacts(sortedContacts);
        setFilteredContacts(sortedContacts);
      } else {
        Alert.alert('Permission Denied', 'Cannot access contacts without permission.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch contacts.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = contacts.filter(contact =>
        contact?.displayName?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  };

  const renderContactItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => {
        navigation.navigate('ContactChat', {
          image: item.hasThumbnail ? item.thumbnailPath : null,
          name: item.displayName,
          number: item.phoneNumbers[0]?.number,
        });
      }}
    >
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
      keyboardVerticalOffset={100}
    >
      <ImageBackground source={ground} style={styles.container}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
        >
          <Image source={add} tintColor={'white'} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>

        <View style={{ paddingHorizontal: 20 }}>
          <Text style={styles.title}>Your <Text style={styles.blueText}>Contacts</Text></Text>
          <Text style={styles.title}><Text style={styles.blueText}>Integration</Text> ensured</Text>
          <View style={styles.searchContainer}>
            <Image tintColor={'grey'} source={sea} style={{ height: 16, width: 16 }} />
            <TextInput
              placeholder="Search Contacts"
              placeholderTextColor={'lightgrey'}
              value={searchQuery}
              onChangeText={handleSearch}
              style={styles.searchInput}
            />
          </View>
        </View>

        <View style={{ flexGrow: 1, paddingHorizontal: 20 }}>
          {loading ? (
            <View>
              <LottieView source={require('../../assets/lottie/loading.json')} autoPlay loop style={{ height: 250, width: 360, alignSelf: 'center' }} />
              <Text style={styles.loadingText}>fetching contacts...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredContacts}
              keyExtractor={(item) => item.recordID}
              renderItem={renderContactItem}
              contentContainerStyle={{ paddingVertical: 8 }}
            />
          )}
        </View>

        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Group Call</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor={'grey'}
                placeholder="Enter Group Name"
                value={urName}
                onChangeText={setUrName}
                />
              <TextInput
                style={styles.input}
                placeholderTextColor={'grey'}
                placeholder="Join or Create Room"
                value={roomName}
                onChangeText={setRoomName}
              />
              <TouchableOpacity onPress={()=>{
                navigation.navigate('GroupChat',{urName:urName,roomName:roomName})
              }}  style={{justifyContent:'center',alignItems:'center',backgroundColor:'black',borderRadius:5}} >
                <Text style={{color:'white',paddingVertical:12}}>Join</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    color: 'black',
    fontWeight: '600',
    letterSpacing: 0.2,
    marginVertical: 5,
  },
  blueText: {
    color: '#0D69D7',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(143, 158, 163, 0.2)',
    borderRadius: 50,
    paddingHorizontal: 15,
    marginTop: 8,
  },
  searchInput: {
    fontSize: 16,
    color: 'black',
    paddingLeft: 8,
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: 'black',
    borderColor: '#0D69D7',
    borderWidth: 4,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: 8,
  },
  loadingText: {
    fontSize: 12,
    color: 'black',
    alignSelf: 'center',
    marginTop: -110,
  },
  contactItem: {
    flexDirection: 'row',
    paddingVertical: 12,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color:'black'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color:'black'
  },
});

export default Contactss;
