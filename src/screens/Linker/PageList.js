import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PageList = () => {
    const navigation = useNavigation();
    const [pages, setPages] = useState([]); // Store all pages data

    useFocusEffect(
        React.useCallback(() => {
            loadPages();
        }, [])
    );

    const loadPages = async () => {
        try {
            const storedPages = await AsyncStorage.getItem('pages');
            const parsedPages = storedPages ? JSON.parse(storedPages) : [];
            setPages(parsedPages);
        } catch (error) {
            console.error("Failed to load pages:", error);
        }
    };
    
    

    const switchToPage = (id) => {
        navigation.push('Linker', { pageId: id });
    };
    

    return (
        <View style={styles.pageListContainer}>
            {pages.length > 0 ? (
                pages.map((page) => (
                    <TouchableOpacity
                        key={page.id}
                        style={styles.pageListItem}
                        onPress={() => switchToPage(page.id)}
                    >
                        <Text style={{ fontSize: 16, color: 'black' }}>{page.name}</Text>
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={{ color: 'black' }}>No pages found</Text> // Show a message if no pages are available
            )}
        </View>
    );
};

export default PageList;

const styles = StyleSheet.create({
    pageListContainer: {
        flex:1,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        
    },
    pageListItem: {
        padding: 10,
        backgroundColor: '#0D69D7',
        marginVertical: 5,
        borderRadius: 5,
    },
});
