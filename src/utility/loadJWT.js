import { useCallback, useState } from "react";
import * as Keychain from 'react-native-keychain';
import { useAuthContext, useAccountContext } from "../hooks/Context.js";
import { getAccount } from "./saveInLocalStorage.js";
export const useLoadJWT = () => {
    const {authState ,setAuthState } = useAuthContext();
    const { setAccount } = useAccountContext();
    const [status, setStatus] = useState('loading');
    const loadJWT = useCallback(async () => {
        try {
            const value = await Keychain.getGenericPassword();
            //console.log("keychain router", value.password)
            if (value) {
                const jwt = JSON.parse(value.password);
                setAuthState({
                    accessToken: jwt.accessToken || null,
                    refreshToken: jwt.refreshToken || null,
                    authenticated: jwt.authenticated || false,
                });
                const account = await getAccount();
                if (account) {
                    setAccount(account);
                }
            }
            setStatus('success');
        } catch (error) {
            setStatus('error')
            console.log("keychain error", error)
            setAuthState({
                accessToken: null,
                refreshToken: null,
                authenticated: false,
            })
        }
    }, [])
    return [loadJWT, status]
}