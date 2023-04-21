import { View, Text } from 'react-native'
import React from 'react'
import TimeAgo from 'react-native-timeago'

const SenderMessage = ({message}) => {
  return (
    <View className='bg-purple-600 rounded-lg rounded-tr-none px-5 py-3 mx-3 my-2 self-start ml-auto'
    >
      <Text
      className='text-white'
      >{message.message}</Text>
      {/* <TimeAgo time={Date(message.timestamp)} className='text-purple-400 '/> */}
    </View>
  )
}

export default SenderMessage