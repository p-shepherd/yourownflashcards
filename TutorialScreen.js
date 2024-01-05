import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  StatusBar,
  SectionList,
  Dimensions,
  SafeAreaView,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Animated,
  Platform,
} from "react-native";

import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import styles from "./styles";

import { auth, firestore } from "./firebase";
import { useNavigation } from "@react-navigation/core";
import { useFocusEffect } from "@react-navigation/native";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import tinycolor from "tinycolor2";
import Dot from "./assets/dot.svg";
import Flash from "./assets/flash.svg";
import Logo from "./assets/newLogo.svg";
import SvgUri from "react-native-svg";
import { deviceWidth, deviceHeight } from "./styles";
import Profile from "./assets/profile.svg";
import NetInfo from "@react-native-community/netinfo";
StatusBar.setTranslucent(true);
StatusBar.setBackgroundColor("white"); // Set this to match your app's background color if necessary

const TutorialScreen = () => {
  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight : 0;

  const navigation = useNavigation();

  const backHome = () => {
    navigation.navigate("MainScreen");
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        // User has lost internet connection
        // Log out the user and redirect to login screen
        // (You may also want to save the current state before logging out)
        auth
          .signOut()
          .then(() => {
            navigation.navigate("LoginScreen");
          })
          .catch((error) => {
            console.error("Logout error", error);
            alert(
              "Your internet connection has been lost. Please log in again."
            );
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
          <Text
            style={{
              textAlign: "left",
              fontSize: 20,
              padding: 10,
              paddingTop: 5,
            }}
          >
            <Image
              source={require("./assets/arrow_left.png")}
              style={styles.iconStyle3}
            />
            Back to MainScreen
          </Text>
        </TouchableOpacity>

        <ScrollView style={{ flex: 1, padding: 20 }}>
          {/* contact me text  */}
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Contact Me</Text>
          <View
            style={{
              marginTop: 20,
              alignItems: "center", // Centers the text horizontally
              marginBottom: 20, // Adds space at the bottom (optional)
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: "#628395",
                fontWeight: "bold",
                letterSpacing: 0.5,
                textAlign: "center",
              }}
            >
              If you have any questions or feedback, please contact me at:
            </Text>
            <Text></Text>
            <Text
              style={{
                fontSize: 18,
                color: "#628395",
                fontWeight: "bold",
                letterSpacing: 0.5,
                textAlign: "center",
              }}
            >
              pshepherd.dev@gmail.com
            </Text>
          </View>

          <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}>
            Tutorial
          </Text>

          <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
            How to Start?
          </Text>

          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
            1. Create a Category with Subcategories
          </Text>
          <Text style={{ marginTop: 18 }}>
            Begin by setting up a main category and adding any subcategories you
            need.
          </Text>

          <Image
            style={{
              width: deviceWidth * 0.5,
              height: deviceHeight * 0.5,
              marginTop: 20,
            }}
            source={require("./assets/addCategories.png")}
          />

          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
            2. Create Flashcards
          </Text>
          <Text style={{ marginTop: 18 }}>
            Next, make your flashcards. These can be text-based or drawn. Place
            them in your chosen subcategories.
          </Text>
          <Image
            style={{
              width: deviceWidth * 0.5,
              height: deviceHeight * 0.5,
              marginTop: 20,
            }}
            source={require("./assets/addFlashcards.png")}
          />

          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
            3. Start Learning
          </Text>
          <Text style={{ marginTop: 18 }}>
            Open your learning tab and select a subcategory to begin studying
            with.
          </Text>

          <Image
            style={{
              width: deviceWidth * 0.5,
              height: deviceHeight * 0.5,
              marginTop: 20,
            }}
            source={require("./assets/Learning.gif")}
          />

          <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
            How Does Learning Work?
          </Text>

          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
            {" "}
            This app uses the "Leitner method" for learning with flashcards.
          </Text>

          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
            1. Initial Assignment
          </Text>
          <Text style={{ marginTop: 18 }}>
            All new flashcards start in Box 1. You'll see six boxes in total.
          </Text>

          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
            2. Box Selection
          </Text>
          <Image
            style={{
              width: deviceWidth * 0.5,
              height: deviceHeight * 0.5,
              marginTop: 20,
            }}
            source={require("./assets/boxes.png")}
          />
          <Text style={{ marginTop: 18 }}>
            Choose which boxes you want to study from. You can view the number
            of flashcards in each box.
          </Text>

          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
            3. Learning Session
          </Text>
          <Image
            style={{
              width: deviceWidth * 0.5,
              height: deviceHeight * 0.5,
              marginTop: 20,
            }}
            source={require("./assets/flip.gif")}
          />
          <Text style={{ marginTop: 18 }}>
            During a session, swipe to flip flashcards. Tap either the 'X' or
            'Check' button to indicate if you guessed the content correctly.
          </Text>

          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
            4. Progressing Cards
          </Text>
          <Text style={{ marginTop: 18 }}>
            If your guess is correct, the card moves to the next higher box (up
            to Box 6). Incorrect guesses mean the card stays in its current box
            or moves one box down.
          </Text>

          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
            5. Session Tracking
          </Text>
          <Text style={{ marginTop: 18 }}>
            Track your progress with information like the number of remaining
            flashcards and the box number of the current card.
          </Text>

          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
            6. Reset Option
          </Text>
          <Text style={{ marginTop: 18 }}>
            You can reset all cards in Box 6 back to Box 1 if you wish. Note:
            Flashcard progress is saved only when a session is fully completed.
            Exiting early won't save your progress.
          </Text>

          <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
            How to Edit Your Categories?
          </Text>
          <Text style={{ marginTop: 18 }}>
            Access this by expanding the learning tab and selecting the category
            you wish to update.
          </Text>

          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
            Edit Subategories
          </Text>
          <Image
            style={{
              width: deviceWidth * 0.5,
              height: deviceHeight * 0.5,
              marginTop: 20,
            }}
            source={require("./assets/editCategories.png")}
          />
          <Text style={{ marginTop: 20 }}>- Delete a category</Text>
          <Text style={{ marginTop: 20 }}>- Update a category's name</Text>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
            Edit Subcategories
          </Text>
          <Image
            style={{
              width: deviceWidth * 0.5,
              height: deviceHeight * 0.5,
              marginTop: 20,
            }}
            source={require("./assets/editSubcategory.png")}
          />
          <Text style={{ marginTop: 20 }}>
            - Add, rename, or delete subcategories
          </Text>
          <Text style={{ marginTop: 20 }}>- Delete flashcards</Text>
          <Text style={{ marginTop: 20 }}>
            - Move flashcards between subcategories
          </Text>

          <TouchableOpacity
            onPress={() => {
              /* Implement navigation or action */
            }}
          >
            <Text style={{ color: "blue", marginTop: 20 }}>
              Go to Categories
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default TutorialScreen;
