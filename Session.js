import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  Dimensions,
  View,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { StyleSheet } from "react-native";
import styles from "./styles";
import { SelectList } from "react-native-dropdown-select-list";
import { useNavigation } from "@react-navigation/core";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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
import { Svg, Path } from "react-native-svg";
import { deviceWidth, deviceHeight } from "./styles";
import Check from "./assets/check-svgrepo-com.svg";

import Box1 from "./assets/1flashbox.svg";
import Box2 from "./assets/2flashbox.svg";
import Box3 from "./assets/3flashbox.svg";
import Box4 from "./assets/4flashbox.svg";
import Box5 from "./assets/5flashbox.svg";
import Crown from "./assets/crown.svg";

import Wrong from "./assets/wrong.svg";
import Right from "./assets/right.svg";
import tinycolor from "tinycolor2";
import BoxA from "./assets/boxA.svg";
import BoxB from "./assets/boxB.svg";
import BoxC from "./assets/boxC.svg";
import BoxD from "./assets/boxD.svg";
import BoxE from "./assets/boxE.svg";

import CrownA from "./assets/crownA.svg";
import NetInfo from "@react-native-community/netinfo";

StatusBar.setTranslucent(true);
StatusBar.setBackgroundColor("white");
const { height, width } = Dimensions.get("window");
const Session = ({ route }) => {
  const { subcategoryNameSession, categoryNameSession, colorSession } =
    route.params;
  const [sessionFlashcards, setSessionFlashcards] = useState([]);
  const [currentDate, setCurrentDate] = useState("?");
  const navigation = useNavigation();
  const [numberTotal, setNumberTotal] = useState(0);
  const [numberCurrent, setNumberCurrent] = useState(0);
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [boxOne, setBoxOne] = useState("black");
  const [boxTwo, setBoxTwo] = useState("black");
  const [boxThree, setBoxThree] = useState("black");
  const [boxFour, setBoxFour] = useState("black");
  const [boxFive, setBoxFive] = useState("black");
  const [boxCrown, setBoxCrown] = useState("black");

  const [showLastClicked, setShowLastClicked] = useState("");
  const [colorTheme, setColorTheme] = useState("black");
  const [showRainbowCrown, setShowRainbowCrown] = useState(false);

  const [flashcardType, setFlashcardType] = useState("?");

  const [boxAOpacity, setBoxAOpacity] = useState("0.2");
  const [boxBOpacity, setBoxBOpacity] = useState("0.2");
  const [boxCOpacity, setBoxCOpacity] = useState("0.2");
  const [boxDOpacity, setBoxDOpacity] = useState("0.2");
  const [boxEOpacity, setBoxEOpacity] = useState("0.2");
  const [boxFOpacity, setBoxFOpacity] = useState("0.2");
  const [AColor, setAColor] = useState("black");
  const [BColor, setBColor] = useState("black");
  const [CColor, setCColor] = useState("black");
  const [DColor, setDColor] = useState("black");
  const [EColor, setEColor] = useState("black");
  const [FColor, setFColor] = useState("black");
  const [currentBracket, setCurrentBracket] = useState(0);

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

  const [flashcardFront, setFlashcardFront] = useState("");
  const [flashcardBack, setFlashcardBack] = useState("");

  const uid = auth.currentUser.uid;
  const [paths, setPaths] = useState([]);

  const [paths2, setPaths2] = useState([]);

  const [isClearButtonClicked, setClearButtonClicked] = useState(false);
  const renderFront = () => {
    // Check if the flashcardFront contains more than three commas
    if (flashcardFront.split(",").length > 4) {
      // Return the Svg component
      return (
        <View
          style={{
            backgroundColor: "white",
            width: deviceWidth * 0.9,
            height: deviceHeight * 0.35,
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            borderWidth: 2,
            borderColor: colorTheme,
          }}
        >
          <Svg viewBox={`0 0 ${deviceWidth * 0.9} ${deviceHeight * 0.35}`}>
            <Path
              d={flashcardFront}
              stroke={isClearButtonClicked ? "transparent" : "black"}
              fill={"transparent"}
              strokeWidth={3}
              strokeLinejoin={"round"}
              strokeLinecap={"round"}
            />
            {paths.length > 0 &&
              paths.map((item, index) => (
                <Path
                  key={`path-${index}`}
                  d={item}
                  stroke={isClearButtonClicked ? "transparent" : "black"}
                  fill={"transparent"}
                  strokeWidth={2}
                  strokeLinejoin={"round"}
                  strokeLinecap={"round"}
                />
              ))}
          </Svg>
        </View>
      );
    } else {
      return (
        <View
          style={{
            backgroundColor: "white",
            width: deviceWidth * 0.9,
            height: deviceHeight * 0.35,
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            borderWidth: 2,
            borderColor: colorTheme,
          }}
        >
          <Text style={styles.flashcardText}>{flashcardFront}</Text>
        </View>
      );
    }
  };

  const renderBack = () => {
    // Check if the flashcardFront contains more than three commas
    if (flashcardBack.split(",").length > 4) {
      // Return the Svg component
      return (
        <View
          style={{
            backgroundColor: "white",
            width: deviceWidth * 0.9,
            height: deviceHeight * 0.35,
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            borderWidth: 2,
            borderColor: colorTheme,
          }}
        >
          <Svg viewBox={`0 0 ${deviceWidth * 0.9} ${deviceHeight * 0.35}`}>
            <Path
              d={flashcardBack}
              stroke={isClearButtonClicked ? "transparent" : "black"}
              fill={"transparent"}
              strokeWidth={3}
              strokeLinejoin={"round"}
              strokeLinecap={"round"}
            />
            {paths2.length > 0 &&
              paths2.map((item, index) => (
                <Path
                  key={`path-${index}`}
                  d={item}
                  stroke={isClearButtonClicked ? "transparent" : "black"}
                  fill={"transparent"}
                  strokeWidth={2}
                  strokeLinejoin={"round"}
                  strokeLinecap={"round"}
                />
              ))}
          </Svg>
        </View>
      );
    } else {
      // Return the View with Text component
      return (
        <View
          style={{
            backgroundColor: "white",
            width: deviceWidth * 0.9,
            height: deviceHeight * 0.35,
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            borderWidth: 2,
            borderColor: colorTheme,
          }}
        >
          <Text style={styles.flashcardText}>{flashcardBack}</Text>
        </View>
      );
    }
  };

  const backHome = () => {
    navigation.navigate("MainScreen");
  };

  const [flashcardsCounts, setFlashcardsCounts] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  });

  const countFlashcards = (flashcardsHolder) => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    flashcardsHolder.forEach((flashcard) => {
      if (flashcard.bracket >= 1 && flashcard.bracket <= 6) {
        counts[flashcard.bracket]++;
      }
    });

    return counts;
  };

  // wylapuje dobre ilosci flashcardow (flashcard ammounts)
  const fetchData = async () => {
    try {
      // Direct reference to the subcategory document
      const subcategoryDocRef = doc(
        firestore,
        `users/${uid}/data/${categoryNameSession}/subcategory`,
        subcategoryNameSession
      );

      // Get the subcategory document
      const subcategoryDocSnap = await getDoc(subcategoryDocRef);

      if (subcategoryDocSnap.exists()) {
        const subcategoryData = subcategoryDocSnap.data();
        const flashcardsHolder = subcategoryData.flashcards || [];

        // Count flashcards based on their bracket
        const counts = countFlashcards(flashcardsHolder);
        setFlashcardsCounts(counts);

        // Set color theme
        if (colorSession) {
          setColorTheme(
            tinycolor(colorSession).darken(10).saturate(20).toString()
          );
        }

        if (flashcardsHolder.length < 1) {
          console.log("No flashcards");
        }
      } else {
        console.log("Subcategory not found!");
        navigation.navigate("MainScreen");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch flashcards for the session based on selected brackets
  const fetchFlashcardsByBrackets = async (selectedBrackets) => {
    try {
      // Direct reference to the subcategory document
      const subcategoryDocRef = doc(
        firestore,
        `users/${uid}/data/${categoryNameSession}/subcategory`,
        subcategoryNameSession
      );

      // Fetch the subcategory document
      const subcategoryDocSnap = await getDoc(subcategoryDocRef);

      if (subcategoryDocSnap.exists()) {
        const subcategoryData = subcategoryDocSnap.data();
        let flashcardsHolder = subcategoryData.flashcards || [];

        // Filter flashcards based on selected brackets
        flashcardsHolder = flashcardsHolder.filter((flashcard) =>
          selectedBrackets.includes(flashcard.bracket)
        );

        console.log(
          `${flashcardsHolder.length} flashcardsHolder.length in fetchFlashcardsByBrackets`
        );
        setSessionFlashcards(flashcardsHolder);
        if (numberTotal === 0) {
          setNumberTotal(flashcardsHolder.length);
        }

        // Handle setting the current flashcard details
        if (flashcardsHolder.length > 0) {
          const untrainedFlashcard = flashcardsHolder.find(
            (flashcard) => !flashcard.trained
          );
          if (untrainedFlashcard) {
            setCurrentFlashcard(untrainedFlashcard.bracket);
            setFlashcardFront(untrainedFlashcard.frontContent);
            setCurrentBracket(untrainedFlashcard.bracket);
            setCurrentDate(untrainedFlashcard.creationDate);
            setFlashcardBack(untrainedFlashcard.backContent);
          }
        }
      } else {
        console.log("Subcategory not found!");
        // Handle the case where the subcategory document doesn't exist
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  };

  const updateFlashcard = async (answeredRight, selectedBrackets) => {
    try {
      // Filter sessionFlashcards based on selected brackets
      let relevantFlashcards = sessionFlashcards.filter((flashcard) =>
        selectedBrackets.includes(flashcard.bracket)
      );

      // Find an untrained flashcard
      const untrainedFlashcard = relevantFlashcards.find(
        (flashcard) => !flashcard.trained
      );
      if (untrainedFlashcard) {
        untrainedFlashcard.trained = true;
        if (answeredRight && untrainedFlashcard.bracket <= 6) {
          setNumberCurrent(numberCurrent + 1);
          if (currentFlashcard == 1) {
            console.log("answered right");
            setBoxTwo("green");
            untrainedFlashcard.bracket++;
            setTimeout(() => {
              setBoxTwo("black");
            }, 1000);
          }
          if (currentFlashcard == 2) {
            console.log("answered right");
            setBoxThree("green");
            untrainedFlashcard.bracket++;
            setTimeout(() => {
              setBoxThree("black");
            }, 1000);
          }
          if (currentFlashcard == 3) {
            console.log("answered right");
            setBoxFour("green");
            untrainedFlashcard.bracket++;
            setTimeout(() => {
              setBoxFour("black");
            }, 1000);
          }
          if (currentFlashcard == 4) {
            console.log("answered right");
            setBoxFive("green");
            untrainedFlashcard.bracket++;
            setTimeout(() => {
              setBoxFive("black");
            }, 1000);
          }
          if (currentFlashcard == 5) {
            console.log("answered right");
            setShowRainbowCrown(true);
            setBoxCrown("green");
            untrainedFlashcard.bracket++;
            setTimeout(() => {
              setShowRainbowCrown(false);
              setBoxCrown("black");
            }, 1000);
          }
          if (currentFlashcard == 6) {
            console.log("answered right");
            setBoxCrown("green");
            setTimeout(() => {
              setBoxCrown("black");
            }, 1000);
          }
        } else if (!answeredRight && untrainedFlashcard.bracket > 1) {
          setNumberCurrent(numberCurrent + 1);
          if (currentFlashcard == 2) {
            console.log("answered wrong");
            setBoxOne("red");
            //wait for 1 second and set it back to black
            setTimeout(() => {
              setBoxOne("black");
            }, 1000);
          }

          if (currentFlashcard == 3) {
            console.log("answered right");
            setBoxTwo("red");
            setTimeout(() => {
              setBoxTwo("black");
            }, 1000);
          }
          if (currentFlashcard == 4) {
            console.log("answered right");
            setBoxThree("red");
            setTimeout(() => {
              setBoxThree("black");
            }, 1000);
          }
          if (currentFlashcard == 5) {
            console.log("answered right");
            setBoxFour("red");
            setTimeout(() => {
              setBoxFour("black");
            }, 1000);
          }
          untrainedFlashcard.bracket--;
        } else if (!answeredRight && untrainedFlashcard.bracket == 1) {
          setNumberCurrent(numberCurrent + 1);
          if (currentFlashcard == 1) {
            console.log("answered wrong");
            setBoxOne("red");

            setTimeout(() => {
              setBoxOne("black");
            }, 1000);
          }
        }

        // Update sessionFlashcards state
        setSessionFlashcards((currentFlashcards) =>
          currentFlashcards.map((flashcard) => {
            return flashcard.id === untrainedFlashcard.id
              ? untrainedFlashcard
              : flashcard;
          })
        );

        // console.log(sessionFlashcards);
        // console.log("");
        // console.log(relevantFlashcards);

        // Find the next untrained flashcard and update the state
        const nextUntrainedFlashcard = sessionFlashcards.find(
          (flashcard) =>
            !flashcard.trained && selectedBrackets.includes(flashcard.bracket)
        );
        if (nextUntrainedFlashcard) {
          setCurrentFlashcard(nextUntrainedFlashcard.bracket);
          setFlashcardFront(nextUntrainedFlashcard.frontContent);
          setCurrentBracket(nextUntrainedFlashcard.bracket);
          setCurrentDate(nextUntrainedFlashcard.creationDate);
          setFlashcardBack(nextUntrainedFlashcard.backContent);
        } else {
          setCurrentFlashcard(0);
          setFlashcardFront("");
          setCurrentBracket(0);
          setCurrentDate("");
          setFlashcardBack("");
        }

        // Check if all flashcards have been trained
        const allTrained = relevantFlashcards.every(
          (flashcard) => flashcard.trained
        );
        if (allTrained) {
          try {
            // Direct reference to the subcategory document
            const subcategoryDocRef = doc(
              firestore,
              `users/${uid}/data/${categoryNameSession}/subcategory`,
              subcategoryNameSession
            );

            // Fetch the subcategory document
            const subcategoryDocSnap = await getDoc(subcategoryDocRef);

            if (subcategoryDocSnap.exists()) {
              const subcategoryData = subcategoryDocSnap.data();
              const updatedFlashcards = subcategoryData.flashcards.map(
                (flashcard) => {
                  const sessionFlashcard = sessionFlashcards.find(
                    (sf) => sf.id === flashcard.id
                  );
                  if (sessionFlashcard) {
                    return { ...sessionFlashcard, trained: false };
                  }
                  return flashcard;
                }
              );

              // Update the subcategory document with the reset flashcards
              await updateDoc(subcategoryDocRef, {
                flashcards: updatedFlashcards,
              });
              console.log("Updated flashcards in Firestore.");
            }

            // Reset session states
            setNumberCurrent(0);
            setNumberTotal(0);
            setCheckboxes(checkboxesAfter);
            setFlashcardFront("");
            setFlashcardBack("");
            setModalVisible(true);
            fetchData();
          } catch (error) {
            console.error("Error updating Firestore:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error updating flashcards:", error);
    }
  };

  useEffect(() => {
    if (!categoryNameSession || !subcategoryNameSession) {
      navigation.navigate("MainScreen");
      alert("Please try again");
    } else {
      console.log("categoryNameSession: " + categoryNameSession);
      console.log("subcategoryNameSession: " + subcategoryNameSession);

      fetchData();
    }

    if (flashcardBack.split(",").length > 4) {
      setFlashcardType("drawn");
    } else {
      setFlashcardType("text");
    }

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
  }, [flashcardBack]); // Empty dependency array to run only on component mou
  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight : 0;

  const [modalVisible, setModalVisible] = useState(true);
  const [modalNo, setModalNo] = useState(false);

  const [checkboxes, setCheckboxes] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });
  const [checkboxesAfter, setCheckboxesAfter] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });

  // console.log(checkboxes)
  const handleCheckboxChange = (checkbox) => {
    const updatedCheckboxes = {
      ...checkboxes,
      [checkbox]: !checkboxes[checkbox],
    };
    setCheckboxes(updatedCheckboxes);

    if (checkbox === "1") {
      setAColor(updatedCheckboxes[checkbox] ? colorTheme : "black");
      setBoxAOpacity(updatedCheckboxes[checkbox] ? "1" : "0.2");
    }

    if (checkbox === "2") {
      setBColor(updatedCheckboxes[checkbox] ? colorTheme : "black");
      setBoxBOpacity(updatedCheckboxes[checkbox] ? "1" : "0.2");
    }

    if (checkbox === "3") {
      setCColor(updatedCheckboxes[checkbox] ? colorTheme : "black");
      setBoxCOpacity(updatedCheckboxes[checkbox] ? "1" : "0.2");
    }

    if (checkbox === "4") {
      setDColor(updatedCheckboxes[checkbox] ? colorTheme : "black");
      setBoxDOpacity(updatedCheckboxes[checkbox] ? "1" : "0.2");
    }

    if (checkbox === "5") {
      setEColor(updatedCheckboxes[checkbox] ? colorTheme : "black");
      setBoxEOpacity(updatedCheckboxes[checkbox] ? "1" : "0.2");
    }

    if (checkbox === "6") {
      setFColor(updatedCheckboxes[checkbox] ? colorTheme : "black");
      setBoxFOpacity(updatedCheckboxes[checkbox] ? "1" : "0.2");
    }
  };

  const startSession = () => {
    setAColor("black");
    setBColor("black");
    setCColor("black");
    setDColor("black");
    setEColor("black");
    setFColor("black");
    setBoxFOpacity("0.2");
    setBoxAOpacity("0.2");
    setBoxBOpacity("0.2");
    setBoxCOpacity("0.2");
    setBoxDOpacity("0.2");
    setBoxEOpacity("0.2");
    const selectedBrackets = Object.entries(checkboxes)
      .filter(([_, value]) => value)
      .map(([key]) => Number(key));
    // console.log(selectedBrackets)

    if (selectedBrackets.length > 0) {
      setModalVisible(false);
      fetchFlashcardsByBrackets(selectedBrackets); // Fetch flashcards for the session based on selected brackets
    } else {
    }
  };

  const selectedBrackets = Object.entries(checkboxes)
    .filter(([_, value]) => value)
    .map(([key]) => Number(key));

  const setBracketsToOne = async () => {
    try {
      // Direct reference to the subcategory document
      const subcategoryDocRef = doc(
        firestore,
        `users/${uid}/data/${categoryNameSession}/subcategory`,
        subcategoryNameSession
      );

      // Fetch the subcategory document
      const subcategoryDocSnap = await getDoc(subcategoryDocRef);

      if (subcategoryDocSnap.exists()) {
        const subcategoryData = subcategoryDocSnap.data();
        const updatedFlashcards = subcategoryData.flashcards.map(
          (flashcard) => {
            return flashcard.bracket === 6
              ? { ...flashcard, bracket: 1 }
              : flashcard;
          }
        );

        // Update the subcategory document with the modified flashcards
        await updateDoc(subcategoryDocRef, { flashcards: updatedFlashcards });

        // console.log(
        //   "All learned flashcards from box 6 have been moved back to box 1."
        // );
        alert(
          "All learned flashcards from box 6 have been moved back to box 1."
        );
      } else {
        console.log("Subcategory not found!");
      }

      // Reset states and fetch data
      setNumberCurrent(0);
      setNumberTotal(0);
      setCheckboxes(checkboxesAfter);
      setFlashcardFront("");
      setFlashcardBack("");
      fetchData();
      setModalVisible(true);
    } catch (error) {
      console.error("Error updating flashcards:", error);
    }
  };

  const breakpoint = 768;

  const checkboxContainerStyle =
    deviceWidth < breakpoint
      ? styles.checkboxContainer
      : styles.checkboxContainerForTablets;

  const checkboxStyle =
    deviceWidth < breakpoint ? styles.checkbox : styles.checkboxForTablets;

  const checkIconStyle = {
    position: "absolute",
    zIndex: 5,
    left: deviceWidth > breakpoint ? 20 : 15,
  };

  const checkWidth = deviceWidth > breakpoint ? 50 : 35;
  const checkHeight = deviceWidth > breakpoint ? 50 : 35;

  const iconWidth = deviceWidth > breakpoint ? 100 : 50;
  const iconHeight = deviceWidth > breakpoint ? 100 : 50;

  const showConfirmationAlert = () => {
    Alert.alert(
      "Reset Learned Flashcards",
      "Are you sure you want to reset all the learned flashcards? It will declass all your flashcards from box 6 (crown) to box 1",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => setBracketsToOne(),
        },
      ],
      { cancelable: false }
    );
  };
  const isLargeDevice = deviceWidth > breakpoint;

  // BoxA component properties
  const BoxAProps = {
    width: isLargeDevice ? 180 : 100,
    height: isLargeDevice ? 180 : 100,
    stroke: AColor,
    fill: "none",
    opacity: boxAOpacity,
  };

  // BoxB component properties
  const BoxBProps = {
    width: isLargeDevice ? 200 : 110,
    height: isLargeDevice ? 200 : 110,
    stroke: BColor,
    fill: "none",
    opacity: boxBOpacity,
  };

  // BoxC component properties
  const BoxCProps = {
    width: isLargeDevice ? 180 : 100,
    height: isLargeDevice ? 180 : 100,
    stroke: CColor,
    fill: "none",
    opacity: boxCOpacity,
  };

  // BoxD component properties
  const BoxDProps = {
    width: isLargeDevice ? 170 : 90,
    height: isLargeDevice ? 170 : 90,
    stroke: DColor,
    fill: "none",
    opacity: boxDOpacity,
  };

  // BoxE component properties
  const BoxEProps = {
    width: isLargeDevice ? 140 : 80,
    height: isLargeDevice ? 140 : 80,
    stroke: EColor,
    fill: "none",
    opacity: boxEOpacity,
  };

  // CrownA component properties
  const CrownAProps = {
    width: isLargeDevice ? 180 : 100,
    height: isLargeDevice ? 180 : 100,
    stroke: FColor,
    fill: "none",
    opacity: boxFOpacity,
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
        <Text
          style={{
            marginBottom: 20,
            marginTop: 10,
            color: colorTheme,
            fontSize: 25,
            fontWeight: 500,
          }}
        >
          {showLastClicked}
        </Text>

        <GestureFlipView width={deviceWidth * 0.9} height={deviceHeight * 0.35}>
          {renderFront()}
          {renderBack()}
        </GestureFlipView>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity
            onPress={() => updateFlashcard(false, selectedBrackets)}
            style={{ marginTop: 20, marginRight: 40 }}
          >
            <Wrong width="70" height="70" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => updateFlashcard(true, selectedBrackets)}
            style={{ marginTop: 20, marginLeft: 40 }}
          >
            <Right width="70" height="70" />
          </TouchableOpacity>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: 400, marginTop: 15 }}>
            Flashcard: {numberCurrent}/{numberTotal}
          </Text>
          <View
            style={{
              justifyContent: "center",
              alignItes: "center",
              marginTop: 30,
            }}
          >
            <Text style={{ fontSize: 16 }}>
              Flashcard box : {currentBracket}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <TouchableOpacity
              onPress={showConfirmationAlert}
              style={{
                backgroundColor: "#c0c0c0",
                width: deviceWidth * 0.7,
                height: deviceHeight * 0.05,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                opacity: 1,
              }}
            >
              <Text style={styles.clearButtonTextL}>
                Reset Learned Flashcards
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
          marginBottom: 20,
          padding: 0,
          margin: 0,
        }}
      >
        <Box1
          width={iconWidth}
          height={iconHeight}
          fill="none"
          stroke={boxOne}
        />
        <Box2
          width={iconWidth}
          height={iconHeight}
          fill="none"
          stroke={boxTwo}
        />
        <Box3
          width={iconWidth}
          height={iconHeight}
          fill="none"
          stroke={boxThree}
        />
        <Box4
          width={iconWidth}
          height={iconHeight}
          fill="none"
          stroke={boxFour}
        />
        <Box5
          width={iconWidth}
          height={iconHeight}
          fill="none"
          stroke={boxFive}
        />
        {/* {showRainbowCrown ? 
        <RainbowCrown width="50" height="50" /> :  */}
        <Crown
          width={iconWidth}
          height={iconHeight}
          fill="none"
          stroke={boxCrown}
        />
        {/* } */}
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalNo}
        onRequestClose={() => setModalNo(false)}
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => backHome()}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>

              <Text>
                There are no flashcards to learn with inside this subcategory...
                Come back after creating some flashcards!
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalOverlay}>
            {/* Add more SVGs as needed */}

            <View style={styles.modalContent}>
              <View
                style={{
                  position: "absolute",
                  top: isLargeDevice ? 20 : 10,
                  zIndex: 1,
                  left: 10,
                }}
              >
                <BoxA {...BoxAProps} />
              </View>
              <View
                style={{
                  position: "absolute",
                  top: 30,
                  zIndex: 1,
                  right: isLargeDevice ? 30 : 5,
                }}
              >
                <BoxB {...BoxBProps} />
              </View>
              <View
                style={{
                  position: "absolute",
                  top: isLargeDevice ? 430 : 305,
                  zIndex: 1,
                  left: isLargeDevice ? 70 : 25,
                }}
              >
                <BoxC {...BoxCProps} />
              </View>
              <View
                style={{
                  position: "absolute",
                  top: isLargeDevice ? 280 : 180,
                  zIndex: 1,
                  right: isLargeDevice ? 60 : 20,
                }}
              >
                <BoxD {...BoxDProps} />
              </View>
              <View
                style={{
                  position: "absolute",
                  top: isLargeDevice ? 265 : 170,
                  zIndex: 1,
                  left: isLargeDevice ? 50 : 10,
                }}
              >
                <BoxE {...BoxEProps} />
              </View>
              <View
                style={{
                  position: "absolute",
                  top: isLargeDevice ? 450 : 310,
                  zIndex: 1,
                  right: isLargeDevice ? 70 : 25,
                }}
              >
                <CrownA {...CrownAProps} />
              </View>
              {Object.keys(checkboxes).map((checkbox) => (
                <TouchableOpacity
                  key={checkbox}
                  style={[
                    checkboxContainerStyle,
                    flashcardsCounts[checkbox] < 1 && {
                      opacity: 0.35,
                      zIndex: 2,
                    },
                  ]}
                  onPress={() => handleCheckboxChange(checkbox)}
                  disabled={flashcardsCounts[checkbox] < 1}
                >
                  <Text
                    style={{ fontSize: deviceWidth > breakpoint ? 20 : 15 }}
                  >
                    {checkbox}
                  </Text>
                  <View
                    style={[
                      checkboxStyle,
                      {
                        backgroundColor: checkboxes[checkbox]
                          ? "#100c08"
                          : "white",
                        zIndex: 2,
                      },
                    ]}
                  />
                  <View style={checkIconStyle}>
                    <Check width={checkWidth} height={checkHeight} />
                  </View>
                  <Text
                    style={{ fontSize: deviceWidth > breakpoint ? 20 : 15 }}
                  >
                    ({flashcardsCounts[checkbox]})
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.startButton,
                  {
                    opacity: Object.values(checkboxes).some((value) => value)
                      ? 1
                      : 0.5,
                    marginTop: 10,
                    marginBottom: 10,
                    padding: 10,
                    backgroundColor: "#100c08",
                    borderRadius: 5,
                    zIndex: 2,
                  },
                ]}
                disabled={!Object.values(checkboxes).some((value) => value)}
                onPress={startSession}
              >
                <Text style={styles.startButtonText}>Start Session</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => backHome()}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default Session;
