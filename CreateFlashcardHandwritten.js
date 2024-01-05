import React, { useState, useEffect, useRef } from "react";
import {
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
  Dimensions,
} from "react-native";
import { Svg, Path } from "react-native-svg";
import styles, { deviceHeight, deviceWidth } from "./styles";
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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NetInfo from "@react-native-community/netinfo";
const { height, width } = Dimensions.get("window");

StatusBar.setTranslucent(true);
StatusBar.setBackgroundColor("white");

const CreateFlashcardHandwritten = () => {
  const [focusSide, setFocusSide] = useState("front");
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Generate two random numbers for the path
  const randomNum1 = getRandomInt(10, 99); // Replace 10 and 99 with your desired range
  const randomNum2 = getRandomInt(10, 99); // Replace 10 and 99 with your desired range

  const [category, setCategory] = useState("");

  const [selected, setSelected] = useState("");

  const [flashcardFront, setFlashcardFront] = useState("");
  const [flashcardBack, setFlashcardBack] = useState("");

  const uid = auth.currentUser.uid;

  const [data, setData] = useState([]);

  const createF = async () => {
    if (!selected) {
      alert("Pick a subcategory where you want to add the flashcard");
      return;
    }

    try {
      // Direct reference to the subcategory document
      const subcategoryDocRef = doc(
        firestore,
        `users/${uid}/data/${category}/subcategory`,
        selected
      );

      // Fetch existing flashcards
      const subcategoryDocSnap = await getDoc(subcategoryDocRef);
      const flashcardsHolder = subcategoryDocSnap.exists()
        ? subcategoryDocSnap.data().flashcards || []
        : [];

      // Create the new SVG flashcard
      const newFlashcard = {
        id: `${new Date().getTime()}-${Math.floor(Math.random() * 1000)}-${
          flashcardFront.length
        }-${flashcardBack.length}`,
        frontContent: paths.join(" "),
        backContent: paths2.join(" "),
        bracket: 1,
        trained: false,
        creationDate: new Date().toISOString(),
      };

      // Add the new flashcard and update the document
      flashcardsHolder.push(newFlashcard);
      await updateDoc(subcategoryDocRef, { flashcards: flashcardsHolder });

      // Reset input fields for SVG paths
      setPaths([`M47,${randomNum1}`]);
      setPaths2([`M43,${randomNum2}`]);
    } catch (error) {
      console.error("Error in createF:", error);
    }
  };

  //take information from firestore, about what subcategories are available, for the select list

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = doc(firestore, "users", uid);
        const dataCollectionRef = collection(userRef, "data");
        const categoryQuerySnapshot = await getDocs(dataCollectionRef);

        let formattedData = [];

        for (const categoryDoc of categoryQuerySnapshot.docs) {
          const categoryData = categoryDoc.data();
          const categoryName = categoryData.title; // Assuming the field is 'title'

          const subcategoryCollectionRef = collection(
            categoryDoc.ref,
            "subcategory"
          );
          const subcategoryQuerySnapshot = await getDocs(
            subcategoryCollectionRef
          );

          for (const subcategoryDoc of subcategoryQuerySnapshot.docs) {
            const subcategoryData = subcategoryDoc.data();
            const subcategoryName = subcategoryData.subcategoryName; // Assuming the field is 'subcategoryName'

            // Include category name in the format: "Subcategory(Category)"
            formattedData.push({
              key: subcategoryDoc.id,
              value: `${subcategoryName} (${categoryName})`,
            });
          }
        }

        // Set the formatted data to state
        setData(formattedData);
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    fetchData(); // Call the function on component mount

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

  const navigation = useNavigation();

  const backHome = () => {
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

  // for svg canvas

  const [paths, setPaths] = useState([`M47,${randomNum1}`]);
  const [currentPath, setCurrentPath] = useState([]);
  const [isClearButtonClicked, setClearButtonClicked] = useState(false);

  const [paths2, setPaths2] = useState([`M43,${randomNum2}`]);
  const [currentPath2, setCurrentPath2] = useState([]);

  const onTouchEnd = () => {
    paths.push(currentPath);
    setCurrentPath([]);
    setClearButtonClicked(false);
  };

  const onTouchMove = (event) => {
    const newPath = [...currentPath];
    const locationX = event.nativeEvent.locationX;
    const locationY = event.nativeEvent.locationY;
    const newPoint = `${newPath.length === 0 ? "M" : ""}${locationX.toFixed(
      0
    )},${locationY.toFixed(0)} `;
    newPath.push(newPoint);
    setCurrentPath(newPath);
  };

  const onTouchEnd2 = () => {
    paths2.push(currentPath2);
    setCurrentPath2([]);
    setClearButtonClicked(false);
  };

  const onTouchMove2 = (event) => {
    const newPath2 = [...currentPath2];
    const locationX2 = event.nativeEvent.locationX;
    const locationY2 = event.nativeEvent.locationY;
    const newPoint2 = `${newPath2.length === 0 ? "M" : ""}${locationX2.toFixed(
      0
    )},${locationY2.toFixed(0)} `;
    newPath2.push(newPoint2);
    setCurrentPath2(newPath2);
  };

  const handleClearButtonClick = () => {
    setCurrentPath([]);
    setCurrentPath2([]);
    setPaths([`M47,${randomNum1}`]);
    setPaths2([`M43,${randomNum2}`]);
    setClearButtonClicked(true);
  };

  const svgContent = (
    <View style={styles.dziambo}>
      <Svg>
        <Path
          d={paths.join("")}
          stroke={isClearButtonClicked ? "black" : "black"}
          fill={"transparent"}
          strokeWidth={3}
          strokeLinejoin={"round"}
          strokeLinecap={"round"}
        />
        {paths.length > 0 &&
          paths.map((item, index) => (
            <Path
              key={`path-${index}`}
              d={currentPath.join("")}
              stroke={isClearButtonClicked ? "black" : "black"}
              fill={"transparent"}
              strokeWidth={2}
              strokeLinejoin={"round"}
              strokeLinecap={"round"}
            />
          ))}
      </Svg>
    </View>
  );

  const renderFront = () => {
    return svgContent;
  };

  const svgContent2 = (
    <View style={styles.dziambo}>
      <Svg>
        <Path
          d={paths2.join("")}
          stroke={isClearButtonClicked ? "black" : "black"}
          fill={"transparent"}
          strokeWidth={3}
          strokeLinejoin={"round"}
          strokeLinecap={"round"}
        />
        {paths2.length > 0 &&
          paths2.map((item, index) => (
            <Path
              key={`path-${index}`}
              d={currentPath2.join("")}
              stroke={isClearButtonClicked ? "black" : "black"}
              fill={"transparent"}
              strokeWidth={2}
              strokeLinejoin={"round"}
              strokeLinecap={"round"}
            />
          ))}
      </Svg>
    </View>
  );

  const renderBack = () => {
    return svgContent2;
  };

  const [showSvgContainer, setShowSvgContainer] = useState(true);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);

  // Function to toggle the SVG container visibility
  const toggleSvgContainer = () => {
    setShowSvgContainer(!showSvgContainer);
    setFocusSide(focusSide === "back" ? "front" : "back");
  };

  console.log(currentPath);
  console.log(paths + "path");

  const handleSelect = (value) => {
    // Extracting the text before '('
    const endIndex = value.indexOf("(");
    let selectedValue = value;
    if (endIndex > 0) {
      selectedValue = value.substring(0, endIndex).trim();
    }
    setSelected(selectedValue); // Assuming setSelected is your state setting function

    // Extracting the text inside '()'
    const match = value.match(/\((.*?)\)/);
    if (match && match[1]) {
      setCategory(match[1]); // Assuming setCategoryName is your state setting function
    } else {
      // Handle cases where there are no parentheses or no text within them
      setCategory(""); // or any default value you prefer
    }
  };

  console.log(paths2 + "path2");
  console.log(paths + "path");
  console.log(currentPath + "currentPath");
  console.log(currentPath2 + "currentPath2");
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
        <View style={styles.flashcardContainer}>
          <View style={styles.selectList2}>
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
        <GestureFlipView width={deviceWidth * 0.9} height={deviceHeight * 0.35}>
          {focusSide === "front" ? renderBack() : renderFront()}
          {focusSide === "front" ? renderFront() : renderBack()}
        </GestureFlipView>
        {/* */}

        <Text>Draw Below</Text>

        {showSvgContainer ? (
          <View
            style={styles.dziambo}
            onTouchMove={onTouchMove2}
            onTouchEnd={onTouchEnd2}
          >
            <Svg>
              <Path
                d={paths2.join("")}
                stroke={isClearButtonClicked ? "black" : "black"}
                fill={"transparent"}
                strokeWidth={3}
                strokeLinejoin={"round"}
                strokeLinecap={"round"}
              />
              {paths2.length > 0 &&
                paths2.map((item, index) => (
                  <Path
                    key={`path-${index}`}
                    d={currentPath2.join("")}
                    stroke={isClearButtonClicked ? "black" : "black"}
                    fill={"transparent"}
                    strokeWidth={2}
                    strokeLinejoin={"round"}
                    strokeLinecap={"round"}
                  />
                ))}
            </Svg>
          </View>
        ) : (
          <View
            style={styles.dziambo}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <Svg>
              <Path
                d={paths.join("")}
                stroke={isClearButtonClicked ? "black" : "black"}
                fill={"transparent"}
                strokeWidth={3}
                strokeLinejoin={"round"}
                strokeLinecap={"round"}
              />
              {paths.length > 0 &&
                paths.map((item, index) => (
                  <Path
                    key={`path-${index}`}
                    d={currentPath.join("")}
                    stroke={isClearButtonClicked ? "black" : "black"}
                    fill={"transparent"}
                    strokeWidth={2}
                    strokeLinejoin={"round"}
                    strokeLinecap={"round"}
                  />
                ))}
            </Svg>
          </View>
        )}
        <View style={styles.downIn}>
          <TouchableOpacity
            onPress={toggleSvgContainer}
            style={[
              styles.buttonRegister,
              { width: 120, marginTop: 10, marginHorizontal: 5 },
            ]}
          >
            <Text style={styles.clearButtonText}>
              Flip {showSvgContainer ? "Front" : "Back"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttonLogin,
              { width: 120, marginTop: 10, marginHorizontal: 5 },
            ]}
            onPress={createF}
          >
            <Text style={styles.clearButtonTextL}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttonRegister,
              { width: 120, marginTop: 10, marginHorizontal: 5 },
            ]}
            onPress={handleClearButtonClick}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateFlashcardHandwritten;
