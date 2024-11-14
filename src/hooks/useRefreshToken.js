import axios from '../api/axios';
import { useAuthContext } from './contex'; 
import * as Keychain from 'react-native-keychain';

const useRefreshToken = () => {
    const { authState,setAuthState} = useAuthContext();
    const refresh= async () => {
        const data = {
        // Example data you want to send
        refreshToken: authState?.refreshToken,
        };
        try {
        const response = await axios.post('/ws-refresh-token', data,{
            withCredentials: true,
        });
        setAuthState({...authState,
            accessToken:response.data.access_token,
        });
        await Keychain.setGenericPassword(
            'token', 
            JSON.stringify({
              accessToken: response.data.access_token, 
              refreshToken:authState.refreshToken,
              authenticated:true
            })
          );
        console.log(response.data.accessToken)
        return response.data.accessToken;
        } catch (error) {
           // const errorMessage = JSON.parse(error.response.data.message);
            console.log("refresh token error",error.message);
            Keychain.resetGenericPassword()
            setAuthState({
                accessToken: null,
                refreshToken: null,
                authenticated: false,
            });
        }
    }
    return refresh
}

export default useRefreshToken;