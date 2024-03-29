import React, { useState, useEffect, useRef } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
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
import { v4 as uuidv4 } from "uuid";
import styles from "./styles";
import { SelectList } from "react-native-dropdown-select-list";
import { useNavigation } from "@react-navigation/core";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  query,
  getDocs,
} from "firebase/firestore";
import { auth, firestore } from "./firebase";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import GestureFlipView from "react-native-gesture-flip-card";
import "react-native-get-random-values";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { deviceWidth, deviceHeight } from "./styles";
import NetInfo from "@react-native-community/netinfo";
StatusBar.setTranslucent(true);
StatusBar.setBackgroundColor("white");

const CreateFlashcard = () => {
  const [category, setCategory] = useState("");

  const navigation = useNavigation();

  const backHome = async () => {
    await pushFlashcardstoDatabase();
    navigation.navigate("MainScreen");
  };

  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight : 0;

  const spin = useSharedValue(0);

  const rStyle = useAnimatedStyle(() => {
    const spinVal = interpolate(spin.value, [0, 1], [0, -180]);
    return {
      transform: [
        {
          rotateY: withTiming(`${spinVal}deg`, { duration: 500 }),
        },
      ],
    };
  }, []);

  const bStyle = useAnimatedStyle(() => {
    const spinVal = interpolate(spin.value, [0, 1], [-180, -360]);
    return {
      transform: [
        {
          rotateY: withTiming(`${spinVal}deg`, { duration: 500 }),
        },
      ],
    };
  }, []);

  const [selected, setSelected] = useState("");

  const [flashcardFront, setFlashcardFront] = useState("");
  const [flashcardBack, setFlashcardBack] = useState("");

  const [waitingFlashcards, setWaitingFlashcards] = useState([]);

  const uid = auth.currentUser.uid;

  const [data, setData] = useState([]);

  const renderFront = () => {
    return (
      <View style={styles.dziambo}>
        <Text style={styles.flashcardText}>{flashcardFront}</Text>
      </View>
    );
  };

  const renderBack = () => {
    return (
      <View style={styles.dziambo}>
        <Text style={styles.flashcardText}>{flashcardBack}</Text>
      </View>
    );
  };

  const pushFlashcardstoDatabase = async () => {
    console.log("pushing flashcards to database");
    if (waitingFlashcards.length === 0 || !selected) {
      return; // Do nothing if there are no flashcards to push or no category selected
    }

    const subcategoryDocRef = doc(
      firestore,
      `users/${uid}/data/${category}/subcategory`,
      selected
    );

    try {
      const subcategoryDocSnap = await getDoc(subcategoryDocRef);
      const flashcardsHolder = subcategoryDocSnap.exists()
        ? subcategoryDocSnap.data().flashcards || []
        : [];

      // Add the waiting flashcards and update the document
      flashcardsHolder.push(...waitingFlashcards);
      await updateDoc(subcategoryDocRef, { flashcards: flashcardsHolder });

      setWaitingFlashcards([]); // Clear the waitingFlashcards array
    } catch (error) {
      console.error("Error pushing flashcards to database:", error);
    }
  };

  const createF = async () => {
    // Check if flashcard content is empty
    if (flashcardFront.length === 0 || flashcardBack.length === 0) {
      alert("Flashcards cannot be empty");
      return;
    }

    // Check if a subcategory is selected
    if (!selected) {
      alert("Please select a subcategory");
      return;
    }

    try {
      // Direct reference to the subcategory document

      // Create the new flashcard
      const newFlashcard = {
        id: `${new Date().getTime()}-${Math.floor(
          Math.random() * 1000
        )}-${flashcardFront}-${flashcardBack}`,
        frontContent: flashcardFront,
        backContent: flashcardBack,
        creationDate: new Date().toISOString(),
        bracket: 1,
        trained: false,
      };

      //push flashcards to waitingFlashcards
      setWaitingFlashcards([...waitingFlashcards, newFlashcard]);

      // Reset input fields
      setFlashcardBack("");
      setFlashcardFront("");
    } catch (error) {
      console.error("Error in createF:", error);
    }
  };

  //take information from firestore, about what subcategories are available, for the select list

  useEffect(() => {
    let isMounted = true; // Flag to manage cleanup and avoid setting state on unmounted component
    console.log("useEffect called");
    const fetchData = async () => {
      try {
        const userRef = doc(firestore, "users", uid);
        const dataCollectionRef = collection(userRef, "data");
        const categoryQuerySnapshot = await getDocs(dataCollectionRef);

        let formattedData = [];

        for (const categoryDoc of categoryQuerySnapshot.docs) {
          const categoryData = categoryDoc.data();
          const categoryName = categoryData.title;

          const subcategoryCollectionRef = collection(
            categoryDoc.ref,
            "subcategory"
          );
          const subcategoryQuerySnapshot = await getDocs(
            subcategoryCollectionRef
          );

          for (const subcategoryDoc of subcategoryQuerySnapshot.docs) {
            const subcategoryData = subcategoryDoc.data();
            const subcategoryName = subcategoryData.subcategoryName;

            // Include category name in the format: "Subcategory(Category)"
            formattedData.push({
              key: subcategoryDoc.id,
              value: `${subcategoryName} (${categoryName})`,
            });
          }
        }

        if (isMounted) {
          setData(formattedData); // Set the formatted data to state
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    if (uid) {
      fetchData(); // Call the function only if uid is present
    }

    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      if (!state.isConnected && isMounted) {
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

    const unsubscribeBeforeRemove = navigation.addListener(
      "beforeRemove",
      async (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Push flashcards to the database
        await pushFlashcardstoDatabase();

        // After flashcards are pushed, continue with the default behavior
        navigation.dispatch(e.data.action);
      }
    );

    return () => {
      isMounted = false;
      unsubscribeNetInfo(); // Cleanup NetInfo subscription
      unsubscribeBeforeRemove(); // Cleanup navigation listener
    };
  }, [uid, navigation]); // Dependency array ensures useEffect is called again if uid changes

  const textInputRef = useRef(null);
  const textInputRef2 = useRef(null);

  const handleSelect = async (value) => {
    await pushFlashcardstoDatabase();
    // Extracting the text before '('
    const endIndex = value.indexOf("(");
    let selectedValue = value;
    if (endIndex > 0) {
      selectedValue = value.substring(0, endIndex).trim();
    }
    setSelected(selectedValue);

    // Extracting the text inside '()'
    const match = value.match(/\((.*?)\)/);
    if (match && match[1]) {
      setCategory(match[1]);
    } else {
      setCategory("");
    }
  };

  // console.log(selected + "selected");
  // console.log(category);

  const [isInteractingWithCard, setIsInteractingWithCard] = useState(false);

  const breakpoint = 768;

  const isBreakpointCrossed = deviceWidth < breakpoint;

  const [focusSide, setFocusSide] = useState("front");

  const scrollViewRef = useRef();

  const handleFocus = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
    setFocusSide("front");
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };
  const handleFocus2 = () => {
    if (textInputRef2.current) {
      textInputRef2.current.focus();
    }
    setFocusSide("back");
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  // Function to render GestureFlipView based on focus
  const renderGestureFlipView = () => {
    return (
      <GestureFlipView
        onStartShouldSetResponder={() => setIsInteractingWithCard(true)}
        onResponderRelease={() => setIsInteractingWithCard(false)}
        width={deviceWidth * 0.9}
        height={deviceHeight * 0.35}
        style={{ backgroundColor: "blue" }}
      >
        {focusSide === "front" ? renderFront() : renderBack()}
        {focusSide === "front" ? renderBack() : renderFront()}
      </GestureFlipView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { marginTop: statusBarHeight }]}>
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        scrollEnabled={isBreakpointCrossed}
        style={{ backgroundColor: "#fefefa" }}
      >
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
          <View style={styles.flashcardContainer}>
            <View
              style={[styles.selectList, { marginBottom: deviceHeight * 0.03 }]}
            >
              <Text style={styles.textList}> Select subcategory</Text>
              <SelectList
                setSelected={handleSelect}
                data={data}
                save="value"
                placeholder="Select subcategory"
                boxStyles={{ backgroundColor: "white" }}
                dropdownStyles={{ backgroundColor: "white" }}
              />
            </View>
          </View>

          {renderGestureFlipView()}
          <TextInput
            ref={textInputRef}
            onFocus={handleFocus}
            placeholder="Enter front flashcard's text"
            style={[styles.inputCategory, { marginTop: deviceHeight * 0.04 }]}
            value={flashcardFront}
            onChangeText={(text) => setFlashcardFront(text)}
          />
          <TextInput
            ref={textInputRef2}
            onFocus={handleFocus2}
            placeholder="Enter back flashcard's text"
            style={styles.inputCategory}
            value={flashcardBack}
            onChangeText={(text) => setFlashcardBack(text)}
          />

          <TouchableOpacity
            ref={textInputRef}
            onPress={createF}
            style={[styles.buttonLogin, { width: 100, marginTop: 20 }]}
          >
            <Text style={styles.clearButtonTextL}>Create</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default CreateFlashcard;
