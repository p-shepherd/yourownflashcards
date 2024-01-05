import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import styles from './styles'
import { deviceHeight } from './styles';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import MainScreen from './MainScreen';
import CreateCategory from './CreateCategory'
import CreateFlashcard from './CreateFlashcard'
import Session from './Session'
import Canvas from './Canvas'
import FlashcardType from './FlashcardType'
import CreateFlashcardHandwritten from './CreateFlashcardHandwritten';
import EditCategories from './EditCategories';
import EditSubcategories from './EditSubcategories';
import ProfileScreen from './ProfileScreen';
import TutorialScreen from './TutorialScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen options={{headerShown: false}} name="LoginScreen" component={LoginScreen} />
      <Stack.Screen options={{headerShown: false}}  name="MainScreen" component={MainScreen} />
      <Stack.Screen options={{headerShown: false}}  name="CreateCategory" component={CreateCategory} />
      <Stack.Screen options={{headerShown: false}}  name="CreateFlashcard" component={CreateFlashcard} />
      <Stack.Screen options={{headerShown: false}}  name="Session" component={Session} />

       <Stack.Screen options={{headerShown: false}}  name="Canvas" component={Canvas} />
       <Stack.Screen options={{headerShown: false}}  name="FlashcardType" component={FlashcardType} />
       <Stack.Screen options={{headerShown: false}}  name="CreateFlashcardHandwritten" component={CreateFlashcardHandwritten} />
       <Stack.Screen options={{headerShown: false}}  name="EditCategories" component={EditCategories} />
       <Stack.Screen options={{headerShown: false}}  name="EditSubcategories" component={EditSubcategories} />
        <Stack.Screen options={{headerShown: false}}  name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen options={{headerShown: false}}  name="TutorialScreen" component={TutorialScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  )
}

export default App

