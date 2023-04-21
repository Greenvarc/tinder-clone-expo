import { View, Text, Image } from 'react-native'
import React from 'react'
import TimeAgo from 'react-native-timeago';

const ReceiverMessage = ({message}) => {
  console.log(Date(message.timestamp))
  return (
    <View className='bg-red-400 rounded-lg rounded-tr-none px-5 py-3 mx-3 my-2 self-start ml-14'
    >
        <Image 
        className='h-12 w-12 rounded-full absolute top-0 -left-14'
        source={{uri:message.photoURL}}
        />
      <Text
      className='text-white'
      >{message.message}</Text>
      {/* <TimeAgo time={Date(message.timestamp)} className='text-red-500 alse'/> */}
    </View>
  )
}

export default ReceiverMessage