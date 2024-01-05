import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
  ScrollView,
} from "react-native";
import styles from "./styles";
import ColorPicker from "react-native-wheel-color-picker";
import { useNavigation } from "@react-navigation/core";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { auth, firestore } from "./firebase";
import tinycolor from "tinycolor2";

import Plus from "./assets/plus-circle-svgrepo-com.svg";
import NetInfo from "@react-native-community/netinfo";

StatusBar.setTranslucent(true);
StatusBar.setBackgroundColor("white");

const CreateCategory = ({ route }) => {
  const navigation = useNavigation();
  const [color, setColor] = useState("#ADAFFF");
  const [selectedColor, setSelectedColor] = useState("");
  const [colorPickerVisible, setColorPickerVisible] = useState(true);
  const [subcategories, setSubcategories] = useState([""]); // Initial list with one empty subcategory
  const [categoryName, setCategoryName] = useState("");
  const { fetchData2 } = route.params;
  const generateBrightColor = () => {
    const randomColor = tinycolor.random();
    // Adjust the color to ensure it's bright
    const brightColor = randomColor.brighten().saturate().toHexString();
    return brightColor;
  };
  useEffect(() => {
    // Existing logic to generate and set a new bright color
    setColor(generateBrightColor());

    // toggle colorPickerVisible
    setColorPickerVisible(false);
    const timer = setTimeout(() => {
      setColorPickerVisible(true);
    }, 1);

    // Clean up the timeout when the component unmounts
    const netInfoUnsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        // User has lost internet connection
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
      // Clear the color picker timeout
      netInfoUnsubscribe(); // Unsubscribe from network changes
    };
  }, []);

  const backHome = () => {
    navigation.navigate("MainScreen");
  };
  const onColorChange = (color) => {
    setColor(color);
  };

  const toggleColorPicker = () => {
    setColorPickerVisible(!colorPickerVisible);
  };

  const addSubcategory = () => {
    setSubcategories([...subcategories, ""]); // Add a new empty subcategory
  };

  const handleInputFocus = () => {
    // Hide the color picker when the input is focused
    setColorPickerVisible(false);
  };

  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight : 0;

  //push newly created categories and subcategories to firebase

  const handleSubmit = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        //  check for trailing spaces and validate names
        const checkForTrailingSpaceAndValidate = (name, type) => {
          if (/ $/.test(name)) {
            alert(
              `Your ${type} name "${name}" ends with a space. Please remove any trailing spaces.`
            );
            return null;
          }

          const alphanumericAndEmojiRegex = /^[A-Za-z\s\p{Emoji}]+$/u;
          if (!alphanumericAndEmojiRegex.test(name)) {
            alert(
              `Invalid characters in ${type} "${name}". Only English alphabet characters, spaces, and emojis are allowed.`
            );
            return null;
          }
          return name;
        };

        const trimmedCategoryName = checkForTrailingSpaceAndValidate(
          categoryName.trim(),
          "category"
        );
        if (!trimmedCategoryName) return;

        // Reference to the data subcollection
        const dataCollectionRef = collection(
          firestore,
          `users/${user.uid}/data`
        );

        // Get all documents in the data subcollection to check the number of categories
        const dataCollectionSnapshot = await getDocs(dataCollectionRef);
        if (dataCollectionSnapshot.docs.length >= 20) {
          alert("You cannot create more than 20 categories, sorry 😔");

          return;
        }

        // Check for existing category with the same name
        const categoryDocRef = doc(
          firestore,
          `users/${user.uid}/data`,
          trimmedCategoryName
        );
        const categoryDocSnap = await getDoc(categoryDocRef);
        if (categoryDocSnap.exists()) {
          alert("A category with this name already exists.");
          return;
        }

        // Category data structure
        const categoryData = {
          titleid: `${trimmedCategoryName + user.uid}`,
          title: trimmedCategoryName,
          dateOfCreation: new Date().toDateString(),
          color: selectedColor,
        };

        // Create the category document
        await setDoc(categoryDocRef, categoryData);
        console.log("Category data added successfully");

        // Create subcategories
        for (const subcat of subcategories) {
          const validatedSubcat = checkForTrailingSpaceAndValidate(
            subcat,
            "subcategory"
          );
          if (!validatedSubcat) continue;

          const subcategoryCollectionRef = collection(
            categoryDocRef,
            "subcategory"
          );
          const subcategoryDocRef = doc(
            subcategoryCollectionRef,
            validatedSubcat
          );

          const subcategoryData = {
            flashcards: [],
            subcategoryName: validatedSubcat,
          };

          await setDoc(subcategoryDocRef, subcategoryData);
        }

        console.log("Subcategory data added successfully");
        fetchData2();
        navigation.navigate("MainScreen", { dataUpdated: true });
      } catch (error) {
        console.error("Error adding category data:", error);
      }
    } else {
      console.error("User is not authenticated");
    }
  };

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
        <TouchableOpacity onPress={toggleColorPicker}>
          <Text style={{ textAlign: "center", fontSize: 20 }}>
            Select Color{" "}
            <Image
              source={require("./assets/arrow_down.png")}
              style={styles.iconStyle2}
            />
          </Text>
        </TouchableOpacity>
        {colorPickerVisible && (
          <View style={styles.colorPicker}>
            <ColorPicker
              color={color}
              onColorChange={(color) => onColorChange(color)}
              onColorChangeComplete={(colorSelection) =>
                setSelectedColor(colorSelection)
              }
              thumbSize={30}
              sliderSize={0}
              noSnap={true}
              sliderHidden={true}
              row={false}
              palette={[
                "#778899",
                "#ff6347",
                "#ee82ee",
                "#ADAFFF",
                "#6495ed",
                "#00c85d",
                "#a8e4a0",
                "#ffdb58",
                "#ffe4b5",
              ]}
            />
          </View>
        )}
        <ScrollView style={styles.colorPicker2}>
          <View style={styles.textContainer}>
            <Text style={styles.text3}>
              Categories act like a folder, for subcategories, where you can
              store your flashcards
            </Text>
            <TextInput
              onFocus={handleInputFocus}
              placeholder="Enter Category Name"
              style={styles.inputCategory}
              value={categoryName}
              onChangeText={(text) => setCategoryName(text)}
            />

            {subcategories.map((subcategory, index) => (
              <TextInput
                onFocus={handleInputFocus}
                key={index}
                placeholder={`Enter Subcategory ${index + 1} Name`}
                style={styles.inputCategory2}
                value={subcategory}
                onChangeText={(text) => {
                  const newSubcategories = [...subcategories];
                  newSubcategories[index] = text;
                  setSubcategories(newSubcategories);
                }}
              />
            ))}
            <TouchableOpacity style={styles.addButton} onPress={addSubcategory}>
              <Text style={styles.buttonText}>
                Click to add more subcategories
              </Text>
              <Plus width="35" height="35" fill="none" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.buttonLogin, { width: 100 }]}
            >
              <Text style={styles.clearButtonTextL}>Create</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CreateCategory;
