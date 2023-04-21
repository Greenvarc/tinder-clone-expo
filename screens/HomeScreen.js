import { View, Text, StatusBar, Button, SafeAreaView, TouchableOpacity, Image, StyleSheet, useWindowDimensions } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth'
import {AntDesign,Entypo,Ionicons} from '@expo/vector-icons'
import Swiper from 'react-native-deck-swiper'
import { collection, collectionGroup, doc, DocumentSnapshot, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { db } from '../firebase'
import generateId from '../lib/generateId'

const data=[
  {
    firstName:'Naruto',
    lastName:'Uzumaki',
    job:'7 th Okage',
    photoUrl:'https://aniyuki.com/wp-content/uploads/2021/05/aniyuki-wallpaper-naruto-63.jpg',
    age:30,
    id:'123'
  },
  {
    firstName:'Shikamaru',
    lastName:'Nara',
    job:'Okage Advisor',
    photoUrl:'https://images.alphacoders.com/135/135643.jpg',
    age:33,
    id:'345'
  },
  {
    firstName:'Kakashi',
    lastName:'Hatake',
    job:'6th Okage , retired',
    photoUrl:'https://c4.wallpaperflare.com/wallpaper/404/527/706/naruto-kakashi-hatake-hd-wallpaper-preview.jpg',
    age:56,
    id:'7893'
  },
  {
    firstName:'Sasuke',
    lastName:'Uchiha',
    job:'6th Okage , retired',
    photoUrl:'https://c4.wallpaperflare.com/wallpaper/136/701/125/anime-anime-boys-uchiha-sasuke-naruto-shippuuden-wallpaper-preview.jpg',
    age:56,
    id:'9783'
  },
]


const HomeScreen = () => {
    const navigation=useNavigation()
    const {user,logout,loading}=useAuth()
    const swiperRef=useRef(null)
    const [profiles, setProfiles] = useState([])
    
    useLayoutEffect(
      ()=> 
      //check if user exists
      onSnapshot(doc(db,'users',user.uid),snaphot=>{
        if(!snaphot.exists()){
          //login but profile doesn't not exist in db
          navigation.navigate('Modal');
        }
      })
      ,[]
      )
      
    useEffect(()=>{
      let unsub
    
      const fetchCards=async()=>{
        //get all passes, only id ''s
        const passes = await getDocs(collection(db, "users",user.uid,'passes')).then(
          (snaphot)=>snaphot.docs.map((doc)=>doc.id )
        );
        const swipes = await getDocs(collection(db, "users",user.uid,'swipes')).then(
          (snaphot)=>snaphot.docs.map((doc)=>doc.id )
        );
        
        const passedUserIds=passes.length >0?passes :['test'];
        const swipedUserIds=swipes.length >0?swipes :['test'];
        //unsub=onSnapshot(collection(db,'users'),snaphot=>{ //old
        unsub=onSnapshot(query(collection(db,'users'),where('id','not-in',[...passedUserIds,...swipedUserIds])),
        (snaphot)=>{
          setProfiles(
            snaphot.docs
            .filter((doc)=>doc.id !== user?.uid)
            .map((doc=>({
              id:doc.id,
              ...doc.data()
            })))
          )
        })
      }
      fetchCards()
      return unsub
    },[db])

    //swipper functions
    const swipeLeft=(cardIndex)=>{
      if(!profiles[cardIndex]) return
      const userSwipped=profiles[cardIndex];

      //console.log('You have swapped ',userSwipped.displayName)
      //set a new swipe to db, add new  passes to a specific user(user.id),userSwipped.id as reference
      setDoc(doc(db,'users',user.uid,'passes',userSwipped.id),
      userSwipped)
      //console.log('swipped--left successfully')
    }
    const swipeRight=async(cardIndex)=>{
      if(!profiles[cardIndex]) return
      const userSwipped=profiles[cardIndex];
      //get userInfos
      const loggedUser=await (await getDoc(doc(db,'users',user.uid))).data();
      // check if the user swipped on you
      console.log('user------>',loggedUser)
      //check on his swipes
      getDoc(doc(db,'users',userSwipped.id,'swipes',user.uid)).then(
        (DocumentSnapshot)=>{
          console.log('pass  doc snap hot ---------->')
          if(DocumentSnapshot.exists()){
            //the user has matched with you before you mach with him
            console.log('Cool you match with ,if doc exist -->',userSwipped.displayName)
            //create a match
            setDoc(doc(db,'matches',generateId(user.uid,userSwipped.id)),{
              users:{
                [user.uid]:loggedUser,
                [userSwipped.id]:userSwipped
              },
              usersMatches:[user.uid,userSwipped.id],
              timestamp:serverTimestamp(),
            })
            navigation.navigate('Match',{
              loggedUser,
              userSwipped,
            })
            console.log('end ----------->')
          }else{
            //user has swiped first interaction before the two or didnot swipeon
            console.log(`You swippedon ${userSwipped.displayName} | ${userSwipped.job}`)
          }
        })

      setDoc(doc(db,'users',user.uid,'swipes',userSwipped.id),userSwipped)
    }

  return (
    <SafeAreaView className='flex-1 pt-5'>
        {/* header */}
        <View className='flex-row items-center justify-between px-5'>
            <TouchableOpacity
            onPress={logout}
             >
                <Image
                source={{uri:user?.photoURL}}
                className='h-10 w-10 rounded-full bg-gray-400'
                />
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>navigation.navigate('Modal')}
            >
                <Image
                source={require('../assets/Tinder__app_-Flame-Logo.wine-removebg-preview.png')}
                //style={{width:24,height:24}}
                className='w-20 h-20'
                />
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>navigation.navigate('Chat')}
            >
                <Ionicons name='chatbubble-sharp' size={30} color='#ff5864'/>
            </TouchableOpacity>

        </View>
        {/* end of Header */}

        {/* cards */}
        <View className='flex-1 -mt-6' >
          <Swiper
          ref={swiperRef} //to tag this component, to get its props or values
          containerStyle={{backgroundColor:"transparent"}}
          cards={profiles}
          stackSize= {5}
          cardIndex={0}
          //animateCardOpacity
          //infinite
          verticalSwipe={false}
          //overlayOpacityHorizontalThreshold={800}
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                label: {
                  color: 'red',
                  textAlign:'right',
                },
              }
            },
            right: {
              title: 'LIKE',
              style: {
                label: {
                  color: '#4ded30',
                },
              }
            },
          }}
          //functs
          onSwipedLeft={(cardIndex)=>{
            console.log('wripe passed')
            swipeLeft(cardIndex)
          }}
          onSwipedRight={(cardIndex)=>{
            //console.log('swipe match')
            swipeRight(cardIndex)
          }}
          renderCard={(card)=>
            card?(
              <View className='relative bg-white h-3/4 rounded-xl w-full'>
                <Image 
                source={{uri:card.photoURL}}
                className='absolute top-0 h-full w-full rounded-xl bg-gray-400'
                />
                <View
                style={styles.shadowCard}
                className='absolute bottom-0 bg-white w-full h-20 flex-row 
                justify-between items-center px-6 py-2 rounded-b-xl shadow-lg'>
                  <View>
                    <Text className='text-xl font-bold'>{card.firstName||card?.displayName} {card.lastName}</Text>
                    <Text>{card.job}</Text>
                  </View>
                  <Text className='text-2xl'>{card.age}</Text>
                </View>
              </View>
            ):(
              <View className='relative bg-white h-3/4 rounded-xl justify-center items-center shadow-xl' style={styles.shadowCard}>
                <Text className='font-bold pb-5'>No more profiles</Text>
                <Image
                className='h-20 w-20'
                height={100}
                width={100}
                source={{uri:'https://links.papareact.com/6gb'}}
                />
              </View>
            )
          }
          />
        </View>
     {/* end card */}

     {/* bottom buttons */}
     <View className='flex-row justify-evenly pb-5'>
          <TouchableOpacity
          //to swipe left by this button
          onPress={()=>swiperRef.current.swipeLeft()}
           className='items-center justify-center rounded-full w-16 h-16 bg-red-200'>
            <Entypo name='cross' size={24} color='red'/>
          </TouchableOpacity>

          <TouchableOpacity
          //to swipe left by this button
          onPress={()=>swiperRef.current.swipeRight()}
           className='items-center justify-center rounded-full w-16 h-16 bg-green-200'>
            <Entypo name='heart' color='green' size={24}/>
          </TouchableOpacity>
     </View>
    </SafeAreaView>
  )
}

export default HomeScreen

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