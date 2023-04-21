import { View, Text, TextInput, Button, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, FlatList, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import Header from '../components/Header'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAuth from '../hooks/useAuth'
import getMatchuserInfo from '../lib/getMAtchUserInfo'
import { useRoute } from '@react-navigation/native'
import SenderMessage from '../components/SenderMessage'
import ReceiverMessage from '../components/ReceiverMessage'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const MessageScreen = () => {
    const {user}=useAuth()
    const {params}=useRoute()
    const {matchDetails}=params;
    const [input, onChangeInput] = useState(null)
    const [messages, setMessages] = useState([])

    useEffect(
        ()=>
        onSnapshot(query(collection(db,'matches',matchDetails.id,'messages'),orderBy
        ('timestamp','desc')
        ),snapshot=>setMessages(snapshot.docs.map(doc=>({
            id:doc.id,
            ...doc.data()
        })))
        )
        
    ,[matchDetails,db])
    console.log('messages ---------->',messages[0]?.userId===user.uid)
    const sendMessage=()=>{
        addDoc(collection(db,'matches',matchDetails.id,'messages'),{
            timestamp:serverTimestamp(),
            userId:user.uid,
            displayName:user.displayName,
            photoURL:matchDetails.users[user.uid].photoURL,
            message:input
        })
        onChangeInput('')
    }

  return (
    <SafeAreaView className='flex-1'>
        <Header callEnabled title={getMatchuserInfo(matchDetails?.users,user.uid).displayName} />
        <KeyboardAvoidingView
        behavior={Platform.OS==='ios'?'padding':'height'}
        className='flex-1'
        keyboardVerticalOffset={10}
        >
            {/* messages part*/}
            <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            >
                <FlatList
                    
                    data={messages}
                    className='pl-4'
                    keyExtractor={(item)=>item.id}
                    renderItem={({item:message})=>message.userId==user.uid ? (
                        <SenderMessage key={message.id}  message={message}/>
                    ):(
                        <ReceiverMessage key={message.id}  message={message}/> 
                    )}
                />
            </TouchableWithoutFeedback>
            {/* chat input */}
            <View
            className='flex-row justify-between items-center border-t border-gray-200 px-5 py-2'
            >
                <TextInput
                    className='h-10 text-lg'
                    placeholder='Send Message'
                    onChangeText={onChangeInput}
                    value={input}
                    onSubmitEditing={sendMessage}
                />
                <TouchableOpacity onPress={sendMessage}>
                   <FontAwesome name="send" size={24} color="#ff5864" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>

    </SafeAreaView>
  )
}

export default MessageScreen