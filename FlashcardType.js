import React, {useEffect} from 'react';
import {  StyleSheet, Text, View, StatusBar, Platform, KeyboardAvoidingView, TextInput, TouchableOpacity, SafeAreaView, Image } from 'react-native'
import {useNavigation} from '@react-navigation/core';
import { deviceWidth } from './styles';
import styles from './styles';
import NetInfo from "@react-native-community/netinfo";
StatusBar.setTranslucent(true);
StatusBar.setBackgroundColor('white'); // Set this to match your app's background color if necessary

const FlashcardType = () => {

    const navigation = useNavigation();
  
    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
    const redirectCreate1 = () => {
        navigation.navigate('CreateFlashcard')
    }
    const redirectCreate2 = () => {
        navigation.navigate('CreateFlashcardHandwritten')
    }
    const backHome = () => {
        navigation.navigate("MainScreen")
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
<Text style={{ textAlign: 'left', fontSize: 20, padding: 10, paddingTop: 5 }}><Image source={require('./assets/arrow_left.png')} style={styles.iconStyle3} />Back to MainScreen</Text>
        </TouchableOpacity>
        
        
     
        <View style={styles.buttonHolder}>
      <TouchableOpacity
        style={styles.touchable}
        onPress={redirectCreate1}
      >
        <Text style={styles.text}>Create Text Flashcard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.touchable}
        onPress={redirectCreate2}
      >
        <Text style={styles.text}>Create Handwritten Flashcard</Text>
      </TouchableOpacity>
      </View>
</View>
</SafeAreaView>
  );
};


export default FlashcardType;