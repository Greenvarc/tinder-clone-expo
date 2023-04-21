import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import useAuth from '../hooks/useAuth'
import { useNavigation } from '@react-navigation/native'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

const ModalScreen = () => {
    const {user} =useAuth()
    console.log('user',user)
    const navigation=useNavigation()
    const [image, setImage] = useState(null)
    const [job, setJob] = useState(null)
    const [age, setAge] = useState(null)

    const incopleteForm=!image||!job||!age;

    const updateUserProfile=()=>{
        setDoc(doc(db,'users',user?.uid),{
            id:user.uid,
            displayName:user.displayName,
            photoURL:image||user.photoURL,
            job:job,
            age:age,
            timestamp:serverTimestamp()
        })
        .then(()=>{
            navigation.navigate('Home')
        }).catch((error)=>{
            alert('error',error.message)
        })
    }

  return (
    <View className='flex-1 items-center pt-1'>
      <Image 
      resizeMode='contain'
      className='w-full h-20'
      source={{uri:'https://1000logos.net/wp-content/uploads/2018/07/Tinder-logo.png'}}
       />
    <Text className='text-xl text-gray-500 p-2 font-bold'>Welcome {user.displayName}</Text>
       <Text className='text-center p-4 font-bold text-red-400'>
        Step 1: The Profile Pic
       </Text>
       <TextInput
       value={image}
       onChangeText={setImage}
       className='text-center text-xl pb-2'
       placeholder='enter a profile pic URL'
        />

    <Text className='text-center p-4 font-bold text-red-400'>
        Step 2: The Job
       </Text>
       <TextInput
       value={job}
       onChangeText={setJob}
       className='text-center text-xl pb-2'
       placeholder='enter your occupation'
        />

    <Text className='text-center p-4 font-bold text-red-400'>
        Step 1: The Age
       </Text>
       <TextInput
       value={age}
       onChangeText={setAge}
       className='text-center text-xl pb-2'
       placeholder='enter your age'
       maxLength={3}
       keyboardType='numeric'
        />
    <TouchableOpacity
    disabled={incopleteForm}
    onPress={updateUserProfile}
     className={`w-64 p-3 rounded-xl absolute bottom-10 bg-red-400 ${incopleteForm ? 'bg-gray-400':'bg-red-400'}`}>
        <Text className='text-center text-white text-xl'>Update Profile</Text>
    </TouchableOpacity>
    </View>
  )
}

export default ModalScreen