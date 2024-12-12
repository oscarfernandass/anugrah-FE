import React, { useState } from 'react';
import RNFS from 'react-native-fs'; // Import the file system module
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import Sound from 'react-native-sound';
import { TextToVoice } from '../../api/api';

const TextToVoicePage = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!text.trim()) {
            Alert.alert('Error', 'Please enter some text.');
            return;
        }

        setLoading(true);
        try {
            const response = await TextToVoice({ text: text });
            if (response?.audio_base64) {
                playAudio(response?.audio_base64);
            } else {
                Alert.alert('Error', 'Invalid response from server.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch audio.');
        } finally {
            setLoading(false);
        }
    };


    const playAudio = async (audioBase64: string) => {
        try {
            // Create a temporary file path
            const path = `${RNFS.TemporaryDirectoryPath}/audio.mp3`;

            // Write the Base64 audio data to the file
            await RNFS.writeFile(path, audioBase64, 'base64');

            // Load and play the audio file
            const sound = new Sound(path, '', (error) => {
                if (error) {
                    console.error('Failed to load audio:', error);
                    Alert.alert('Error', 'Failed to play audio.');
                    return;
                }
                sound.play(() => sound.release()); // Play the audio and release resources when done
            });
        } catch (error) {
            console.error('Failed to process audio:', error);
            Alert.alert('Error', 'Failed to play audio.');
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your <Text style={styles.blueText}>emotional speaker</Text></Text>
            <Text style={styles.title}><Text style={styles.blueText}>share</Text> through text</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter text"
                placeholderTextColor={'grey'}
                value={text}
                onChangeText={setText}
                multiline
            />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Send" onPress={handleSend} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
        textAlignVertical: 'top',
        color: 'black'
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
});

export default TextToVoicePage;
