import React, {createContext, useContext, useState } from "react"
import * as Keychain from 'react-native-keychain';
import prof from '../assets/images/prof.png'

export const AuthContext=createContext()

export const useAuthContext=()=>{
    const context=useContext(AuthContext)
    if(!context){
        throw new Error('useAuthContext must be used within a authContext')
    }
    return context
}
export const ContexProvider=({children})=> {
    const [toggle,setToggle]=useState(false)
    const [authState,setAuthState]=useState(
        {
            accessToken: null,
            refreshToken: null,
            authenticated: false,
        }
    )
    const getAccessToken = () => {
        return authState.accessToken;
    };

    const logout=()=>{
        Keychain.resetGenericPassword()
        setAuthState({
            accessToken: null,
            refreshToken: null,
            authenticated: false,
        })   
    }
  return (
    <AuthContext.Provider value={{authState,logout,setAuthState,getAccessToken,toggle,setToggle}}>
        {children}
    </AuthContext.Provider>
  )
}


// Acccount context
export const AccountContext=createContext()

export const useAccountContext=()=>{
    const context=useContext(AccountContext)
    if(!context){
        throw new Error('useAccountContext must be used within a AccountContext')
    }
    return context
}

export const AccountProvider=({children})=> {
    const [account,setAccount]=useState({
        first_name : 'guest' ,
        last_name : '',
        email : '',
        phone : '',
        profileSrc : prof ,
        accountIs : 'guest'
    })
    const logoutAccount = ()=>{
        setAccount({
            first_name : 'guest' ,
            last_name : '',
            email : '',
            phone : '',
            profileSrc : prof ,
            accountIs : 'guest'
        })
    }
    const getId = () => {
        if(account?.id)
            return account.id;
        else return null;
    };
    
  return (
    <AccountContext.Provider value={{account,setAccount, logoutAccount, getId}}>
        {children}
    </AccountContext.Provider>
  )
}