import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth'
import getMatchuserInfo from '../lib/getMAtchUserInfo'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'

const ChatRow = ({matchDetails}) => {
    const navigation=useNavigation()
    const {user}=useAuth()
    const [matchUserInfo, setMatchUserInfo] = useState(null)
    const [lastMessage, setLastMessage] = useState('')

    useEffect(()=>{
        setMatchUserInfo(getMatchuserInfo(matchDetails.users,user.uid))
    },[matchDetails,user])
    
    useEffect(()=>
      onSnapshot(query(collection(db,'matches',matchDetails.id,'messages'),
      orderBy('timestamp','desc')
      ),snapshot=>setLastMessage(snapshot.docs[0]?.data().message)
      )
    ,[matchDetails,user])
  return (
    <TouchableOpacity
    onPress={()=>navigation.navigate('Message',{
      matchDetails
    })}
    style={styles.shadowCard}
    className='flex-row  items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg'
    >
      <Image
        className='rounded-full h-16 w-16 mr-4'
        source={{uri:matchUserInfo?.photoURL}}
       />
       <View className=''>
          <Text className='text-lg font-semibold'>{matchUserInfo?.displayName}</Text>
          <Text>{lastMessage|| "Say Hi"}</Text>
       </View>
    </TouchableOpacity>
  )
}

export default ChatRow
const styles=StyleSheet.create({
  shadowCard:{
    shadowColor:'#000',
    shadowOffset:{
      width:0,
      height:1,
    },
    shadowOpacity:0.2,
     shadowRadius:1.41,
    elevation:2,
  }
})