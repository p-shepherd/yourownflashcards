import React, { useState, useEffect, useCallback } from "react";
import {
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
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import tinycolor from "tinycolor2";
import Dot from "./assets/dot.svg";
import Flash from "./assets/flash.svg";
import Logo from "./assets/newLogo.svg";
import SvgUri from "react-native-svg";
import { deviceWidth, deviceHeight } from "./styles";
import Profile from "./assets/profile.svg";
import Info from "./assets/info.svg";
import NetInfo from "@react-native-community/netinfo";

StatusBar.setTranslucent(true);
StatusBar.setBackgroundColor("white"); // Set this to match your app's background color if necessary

const MainScreen = () => {
  //variables for SetCategoriesAmount
  // SetSubcategoriesAmount
  // SetFlashcardsAmount
  // SetLearnedFlashcardsAmount|

  const [categoriesAmount, SetCategoriesAmount] = useState(0);
  const [subcategoriesAmount, SetSubcategoriesAmount] = useState(0);
  const [flashcardsAmount, SetFlashcardsAmount] = useState(0);
  const [learnedFlashcardsAmount, SetLearnedFlashcardsAmount] = useState(0);

  const [userData, setUserData] = useState([]);
  const navigation = useNavigation();
  const handleProfile = () => {
    navigation.navigate("ProfileScreen");
  };

  const handleTutorial = () => {
    navigation.navigate("TutorialScreen");
  };

  const handleSessionNavigation = async (subcategoryName, categoryName) => {
    try {
      // Update the lastClickedSubcategory and InCategory fields in the user's document

      // If the update is successful, navigate to the "Session" screen
      navigation.navigate("Session", {
        subcategoryNameSession: subcategoryName,
        categoryNameSession: categoryName,
        colorSession: sections.find((section) => section.title === categoryName)
          .color,
      });
    } catch (error) {
      console.error("Error updating document:", error);
      // Handle error or show an error message to the user
    }
  };

  const redirectCategory = () => {
    navigation.navigate("CreateCategory", { fetchData2 });
  };
  const redirectFlashcard = () => {
    navigation.navigate("FlashcardType");
  };

  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight : 0;

  const [modalY, setModalY] = useState(new Animated.Value(-deviceHeight));

  const openModal = () => {
    Animated.timing(modalY, {
      duration: 500,
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };
  const closeModal = () => {
    Animated.timing(modalY, {
      duration: 500,
      toValue: -deviceHeight,
      useNativeDriver: true,
    }).start();
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

  const uid = auth.currentUser.uid;

  const fetchData2 = async () => {
    try {
      const userRef = doc(firestore, "users", uid);
      const dataCollectionRef = collection(userRef, "data");
      const categoryQuerySnapshot = await getDocs(dataCollectionRef);
      const categories = [];

      let totalSubcategories = 0;
      let totalFlashcards = 0;
      let learnedFlashcards = 0;

      for (const categoryDoc of categoryQuerySnapshot.docs) {
        const categoryData = categoryDoc.data();
        console.log("Category Data:", categoryData); // Debug log for each category

        const subcategoryCollectionRef = collection(
          categoryDoc.ref,
          "subcategory"
        );
        const subcategoryQuerySnapshot = await getDocs(
          subcategoryCollectionRef
        );

        const subcategories = subcategoryQuerySnapshot.docs.map((subDoc) => {
          const subData = subDoc.data();
          console.log("Subcategory Data:", subData); // Debug log for each subcategory

          // Counting flashcards and learned flashcards
          const flashcards = subData.flashcards || [];
          totalFlashcards += flashcards.length;
          learnedFlashcards += flashcards.filter(
            (fc) => fc.bracket === 6
          ).length;

          return {
            name: subData.subcategoryName, // Ensure this field exists
          };
        });

        if (categoryData.title && categoryData.color) {
          // Check if title and color exist
          categories.unshift({
            title: categoryData.title,
            color: categoryData.color,
            sectioncolorstronger: makeColorStronger(categoryData.color),
            data: subcategories,
          });
        }

        // Counting subcategories
        totalSubcategories += subcategoryQuerySnapshot.size;
      }

      setUserData(categories);
      console.log("Fetched userData:", categories); // Debug log for final userData

      // Setting state for counts
      SetCategoriesAmount(categoryQuerySnapshot.size - 1);
      SetSubcategoriesAmount(totalSubcategories);
      SetFlashcardsAmount(totalFlashcards);
      SetLearnedFlashcardsAmount(learnedFlashcards);
    } catch (error) {
      console.error("Error getting document:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener("focus", () => {
        // Get the possible parameters from the navigation
        const routeParams = navigation
          .getState()
          .routes.find((route) => route.name === "MainScreen")?.params;

        if (routeParams?.dataUpdated) {
          console.log("that worked");
          fetchData2();

          // Optional: Reset the parameter so it doesn't refetch if it's not needed
          navigation.setParams({ dataUpdated: false });
        }
      });

      return unsubscribe;
    }, [navigation])
  );

  const makeColorStronger = (color) => {
    // This is an example, you can adjust the method and parameters as needed
    return tinycolor(color)
      .saturate(20) // Increase the saturation
      .lighten(-5) // Increase the brightness
      .toString(); // Convert it back to a string
  };

  const sections = userData.map((category) => ({
    title: category.title,
    color: category.color,
    sectioncolorstronger: makeColorStronger(category.color),
    data: category.data.map((subcategory) => ({
      name: subcategory.name, // Ensuring this matches the field name from `fetchData2`
      color: category.color,
    })),
  }));

  const calculateBrightness = (color) => {
    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);

    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  // Function to determine the text color (black or white) based on the background color
  const getTextColorBasedOnBackground = (backgroundColor) => {
    const brightness = calculateBrightness(backgroundColor);
    return brightness > 125 ? "black" : "white"; // Threshold set at 125 (adjust as needed)
  };

  const handleEditNavigation = async (itemName) => {
    const uid = auth.currentUser.uid;

    try {
      const userRef = doc(firestore, "users", uid);
      // Update the lastClickedSubcategory field in the user's document

      // If the update is successful, navigate to the "EditCategories" screen
      // Pass 'itemName' as a parameter to the 'EditCategories' screen
      navigation.navigate("EditCategories", {
        fetchData2: fetchData2,
        itemName: itemName,
        color: sections.find((section) => section.title === itemName).color,
      });
    } catch (error) {
      console.error("Error updating document:", error);
      // Handle error or show an error message to the user
    }
  };
  const breakpoint = 768;

  const logoWidth = deviceWidth > breakpoint ? 500 : 300;
  const logoHeight = deviceWidth > breakpoint ? 500 : 300;

  console.log(auth.currentUser?.email);
  console.log(auth.currentUser?.uid);
  return (
    <SafeAreaView style={[styles.container, { marginTop: statusBarHeight }]}>
      {/* top part of the screen with categories container slidedown */}
      <View style={styles.topFlex}>
        <TouchableOpacity onPress={openModal} style={styles.iconStyle}>
          <Image
            source={require("./assets/arrow_down.png")}
            style={styles.iconStyle}
          />
        </TouchableOpacity>
      </View>
      {/* middle part of the screen with some text and logo */}
      <View style={styles.middleFlex}>
        {/* <Text>Hello {auth.currentUser?.email}</Text> */}
        <View style={{ bottom: 0 }}>
          <Logo width={logoWidth} height={logoHeight} />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              marginTop: -deviceHeight * 0.04,
              marginRight: deviceWidth * 0.1,
            }}
            onPress={handleProfile}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Profile width="30" height="30" />
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: deviceHeight * 0.022,
                  fontWeight: "400",
                }}
              >
                My Profile
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: -deviceHeight * 0.04 }}
            onPress={handleTutorial}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Info width="30" height="30" />
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: deviceHeight * 0.022,
                  fontWeight: "400",
                }}
              >
                Tutorial
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: deviceHeight * 0.04,
            marginBottom: deviceHeight * 0.04,
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 10,
            borderWidth: 2,
            borderColor: "black",
            minHeight: deviceHeight * 0.2,
            minWidth: deviceWidth * 0.8,
            paddingHorizontal: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-around",
              paddingHorizontal: 10,
              marginTop: deviceHeight * 0.03,
            }}
          >
            <Text style={{ width: deviceWidth * 0.35, textAlign: "center" }}>
              Categories
            </Text>
            <Text style={{ width: deviceWidth * 0.4, textAlign: "center" }}>
              Subcategories
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-around",
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ width: deviceWidth * 0.35, textAlign: "center" }}>
              {categoriesAmount}{" "}
            </Text>
            <Text style={{ width: deviceWidth * 0.4, textAlign: "center" }}>
              {subcategoriesAmount}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-around",
              paddingHorizontal: 10,
              marginTop: deviceHeight * 0.03,
            }}
          >
            <Text style={{ width: deviceWidth * 0.35, textAlign: "center" }}>
              Flashcards{" "}
            </Text>
            <Text style={{ width: deviceWidth * 0.4, textAlign: "center" }}>
              Learned Flashcards
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-around",
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ width: deviceWidth * 0.35, textAlign: "center" }}>
              {flashcardsAmount}
            </Text>
            <Text style={{ width: deviceWidth * 0.4, textAlign: "center" }}>
              {learnedFlashcardsAmount}
            </Text>
          </View>
        </View>
      </View>
      {/* bottom part of the screen with buttons */}
      <View style={styles.bottomFlex}>
        <TouchableOpacity onPress={redirectCategory} style={styles.button}>
          <Text>Add Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={redirectFlashcard} style={styles.button}>
          <Text>Add Flashcards</Text>
        </TouchableOpacity>
      </View>

      {/* slide down view */}

      <Animated.View
        style={[
          styles.modal,
          breakpoint > deviceWidth ? { marginTop: 0 } : { marginTop: 30 }, // Apply marginTop only on iOS
          { transform: [{ translateY: modalY }] },
        ]}
      >
        <View style={styles.slideDown}>
          {/* categories and subcategories  */}
          <SectionList
            sections={sections}
            renderItem={({ item, section }) => (
              <TouchableOpacity
                onPress={() =>
                  handleSessionNavigation(item.name, section.title)
                }
                style={[styles.item, { backgroundColor: "white" }]}
              >
                <Flash
                  width="30"
                  height="30"
                  fill="none"
                  stroke={section.sectioncolorstronger}
                  style={styles.flash}
                />
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section }) => (
              <TouchableOpacity
                onPress={() => handleEditNavigation(section.title)}
                style={styles.headerTOp}
              >
                <Text
                  style={[
                    styles.sectionHeader,
                    {
                      // borderBottomWidth: 8,  // Adjust the width as needed
                      // borderBottomColor: section.color, // Change the color as needed
                      // color: 'black',

                      // borderBottomRightRadius: 100,

                      backgroundColor: section.color, // Background color of the section headers
                    },
                  ]}
                >
                  {section.title}
                </Text>
                <View
                  style={
                    {
                      // padding: 0,
                      // margin: 0,
                      // borderBottomWidth: 6,
                      // borderBottomColor: section.color,
                      // width: '100%', // Adjust this to change the length of the bottom border
                    }
                  }
                ></View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) =>
              `basicListEntry-${index}-${item.name}`
            }
          />

          {/* categories and subcategories  end */}
        </View>

        <View style={styles.slideDownBot}>
          <TouchableOpacity onPress={closeModal} style={styles.iconStyle}>
            <Image
              source={require("./assets/arrow_up.png")}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* slide down view */}
    </SafeAreaView>
  );
};

export default MainScreen;
