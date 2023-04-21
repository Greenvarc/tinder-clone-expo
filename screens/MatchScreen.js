import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'

const MatchScreen = () => {
    const navigation=useNavigation()
    const {params}=useRoute()

    const {loggedUser,userSwipped}=params;

  return (
    <View className='h-full bg-red-500 pt-20' style={{opacity:0.89}}>
      <View className='justify-center px-10 pt-20 '>
        <Image
        source={{uri:'https://links.papareact.com/mg9'}}
        className='w-full h-20'
         />
         <Text className='text-white text-center mt-5'>
          You and {userSwipped.displayName} have liked each other.
         </Text>
         <View className='flex-row justify-evenly mt-5'>
            <Image 
              className='h-32 w-32 rounded-full'
              source={{uri:loggedUser.photoURL}}
            />
            <Image 
            className='h-32 w-32 rounded-full'
            source={{uri:userSwipped.photoURL}}
            />
         </View>
      </View>
      <TouchableOpacity
      onPress={()=>{
        navigation.goBack()
        navigation.navigate('Chat')
      }}
       className='bg-white m-5 px-10 py-8 rounded-full mt-20'>
        <Text className='text-center'>Send a message</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MatchScreen