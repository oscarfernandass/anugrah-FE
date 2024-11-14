import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCOUNT_STORAGE_KEY = 'account' ;

const saveAccount = async (account) => {
    console.log("Try to save ",account)
    try {
        await AsyncStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(account));
    } catch (error) {
        console.log('Error saving account', error);
    }
}
const getAccount = async () => {
    try {
        const account = await AsyncStorage.getItem(ACCOUNT_STORAGE_KEY);
        console.log("saved account ",account)
        if (account) {
            return await JSON.parse(account); ;
        }
        return null;
    } catch (error) {
        console.log('Error saving account', error);
        return null;
    }
    
}
const deleteAccount = async () => {
    try {
        await AsyncStorage.removeItem(ACCOUNT_STORAGE_KEY);
    } catch (error) {
        console.log('Error deleting account', error);
    }
}

export { saveAccount, getAccount, deleteAccount };
