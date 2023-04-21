import { View, Text, Button, ImageBackground, TouchableOpacity, TouchableHighlight, TouchableOpacityBase, StatusBar } from 'react-native'
import React, { useLayoutEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { useNavigation } from '@react-navigation/native'

const LoginScreen = () => {
    //promptAsync for google login
    const {promptAsync,loading}=useAuth()
    const navigation=useNavigation()

    useLayoutEffect(()=>{
        navigation.setOptions({
            headerShown:false
        })
    },[])
  return (
    <View className='flex-1'>
      <ImageBackground
        className='flex-1'
        resizeMode='cover'
        source={{uri:'https://tinder.com/static/tinder.png'}}
     >
        <TouchableOpacity
        onPress={()=>promptAsync()}
         className='absolute bottom-40 w-52 mx-[25%] bg-white p-4 rounded-2xl'>
            <Text className='font-semibold text-center'>Sign in and get swiping</Text>
        </TouchableOpacity>
    </ImageBackground>
    </View>
  )
}

export default LoginScreen