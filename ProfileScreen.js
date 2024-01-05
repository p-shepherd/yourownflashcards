import React, { useState, useEffect, useCallback} from 'react';
import {StatusBar, SectionList, Dimensions, SafeAreaView, Image, StyleSheet, View, TouchableOpacity, Text, Animated, Platform } from 'react-native';

import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import styles from './styles';

import {auth, firestore} from './firebase';
import {useNavigation} from '@react-navigation/core';
import { useFocusEffect } from '@react-navigation/native';
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import tinycolor from 'tinycolor2';
import Dot from './assets/dot.svg';
import Flash from './assets/flash.svg';
import Logo from './assets/newLogo.svg';
import SvgUri from 'react-native-svg'
import {deviceWidth, deviceHeight} from './styles';
import Profile from './assets/profile.svg';
import NetInfo from "@react-native-community/netinfo";
StatusBar.setTranslucent(true);
StatusBar.setBackgroundColor('white'); // Set this to match your app's background color if necessary




const ProfileScreen = () => {

    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  
  const navigation = useNavigation();

  const backHome = () => {
      
    navigation.navigate('MainScreen')
    
  }
  const handleLogout = () => {
    auth
    .signOut()
    .then(() => {
      navigation.navigate("LoginScreen")
    })
    .catch((error) => {
      alert(error.message);
      console.error(error);
    });
  }

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        // User has lost internet connection
        // Log out the user and redirect to login screen
        // (You may also want to save the current state before logging out)
        auth.signOut().then(() => {
          navigation.navigate('LoginScreen');
        }).catch(error => {
          console.error("Logout error", error);
          alert("Your internet connection has been lost. Please log in again.");
        });
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, []);
  

  
  return (
    
    <SafeAreaView style={[styles.container, { marginTop: statusBarHeight }]}>

<View style={styles.loginContainer2}>
        <TouchableOpacity onPress={backHome} style={styles.backToMain}>
          <Text style={{ textAlign: 'left', fontSize: 20, padding: 10, paddingTop: 5 }}>
            <Image source={require('./assets/arrow_left.png')} style={styles.iconStyle3} />
            Back to MainScreen
          </Text>
        </TouchableOpacity>

        <Text style={{fontSize:deviceHeight*0.03,marginTop: 100,}}>Email:</Text>
        <Text style={{fontSize:deviceHeight*0.02}}> {auth.currentUser?.email}</Text>

        <TouchableOpacity onPress={handleLogout} style={{marginTop: 100, backgroundColor:'lightgrey', borderWidth: 1,
    borderColor: 'black', borderRadius: 20, minWidth: deviceWidth*0.2, minHeight: deviceHeight*0.04
    , justifyContent: 'center', alignItems: 'center'}}><Text>Log Out</Text></TouchableOpacity>
      
    

       </View>
      </SafeAreaView>
    
  );
}



export default ProfileScreen;
