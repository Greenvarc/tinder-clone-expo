import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { View, Text, StatusBar } from 'react-native'
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { async } from '@firebase/util';

const  AuthContext=createContext({
    //inistialstates
})


//auth configs
export const config={
    expoClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    expoClientId: '448560574039-m6evqf3enlodcmc8lerr42fdduncnp3c.apps.googleusercontent.com',
    iosClientId: '448560574039-lq3rbda09a575rhib97469oea6kk2254.apps.googleusercontent.com',
    androidClientId: '448560574039-k2bbn0qcppmfggarqbh8j6kjj4to0k85.apps.googleusercontent.com',
    webClientId: '448560574039-m6evqf3enlodcmc8lerr42fdduncnp3c.apps.googleusercontent.com',
    // scopes:["profile","email"],
    // permissions:["public_profile","email","gender","location"]
}

export const AuthProvider = ({children}) => {
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)
    const [loadingState, setLoadingState] = useState(true)
    const [loading, setLoading] = useState(false)

    useEffect(()=>
        onAuthStateChanged(auth,(user)=>{
            if(user){
                //logged in
                setUser(user);
                console.log('user is in')
            }
            else{
                //logged out
                setUser(null);
                console.log('user went out')
            }
            console.log('user is',user)
            setLoadingState(false)
        })
    ,[])
//auth stuffs
//logout ..
    const logout=()=>{
        setLoading(true)
        signOut(auth)
        .catch((error)=>setError(error))
        .finally(()=>setLoading(false))
    }
//logins stuffs
    const [request, response, promptAsync] = Google.useAuthRequest(config);

  useEffect(() => {
    console.log('started ... ')
    setLoading(true)
    if (response?.type === 'success') {
      const { accessToken,idToken } = response?.authentication;
      const credentials= GoogleAuthProvider.credential(idToken,accessToken)
      
      //sign in in firebase
      signInWithCredential(auth,credentials)
      setLoading(false)
    }
    
    else {
        setLoading(false)
        return setError(response)
    }
    console.log('error',error?.error)
    console.log('response',response)
    //??
    setLoading(false)
    return ;

    
}, [response]);

//to cash our values
// const memoValue=useMemo(()=>{
//     return {
//         user,
//         loading,
//         error,
//         promptAsync,
//         logout,
//    }
// },[user,loading,error])

const memoValue={
    user,
    loading,
    error,
    promptAsync,
    logout,
}

return (
    <AuthContext.Provider value={memoValue}>
      {!loadingState&&children}
    </AuthContext.Provider>
  )
}
export default function useAuth(){
    return useContext(AuthContext)
}