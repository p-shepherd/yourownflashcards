import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
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
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

import { SelectList } from "react-native-dropdown-select-list";
import { useNavigation } from "@react-navigation/core";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { auth, firestore } from "./firebase";

import GestureFlipView from "react-native-gesture-flip-card";
import { Svg, Path } from "react-native-svg";
import { deviceWidth, deviceHeight } from "./styles";
import styles from "./styles";
import NetInfo from "@react-native-community/netinfo";

StatusBar.setTranslucent(true);
StatusBar.setBackgroundColor("white");

const EditSubcategories = ({ route }) => {
  const [selected2, setSelected2] = useState("");
  const [paths, setPaths] = useState([]);

  const [category, setCategory] = useState("");
  const { fetchData2, itemName, color, categoryName } = route.params;
  const [categoryName2, setCategoryName2] = useState("");
  const [paths2, setPaths2] = useState([]);

  console.log(categoryName2 + "itsme");
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);

  const [data, setData] = useState([]);

  const [selected, setSelected] = useState("");
  const [lastClicked, setLastClicked] = useState("");
  const [color2, setColor2] = useState("");

  const uid = auth.currentUser.uid;

  useEffect(() => {
    if (!fetchData2 || !itemName || !categoryName) {
      navigation.navigate("MainScreen");
      alert("Please select a category to edit");
    } else {
      // Set your states
      setSelected(itemName);
      setLastClicked(itemName);
      setColor2(color);
      setCategoryName2(categoryName);
      setNameShow(itemName);
      console.log("fetchData2", fetchData2);
      console.log("itemName", itemName);
      console.log("categoryName2", categoryName2); // Check if categoryName2 is set
      const timer = setTimeout(() => {
        fetchDataSub();
      }, 1000);

      fetchDataMove();

      // Clear the timer when the component unmounts
      return () => clearTimeout(timer);
    }

    // Setting up the network listener
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        // User has lost internet connection
        // Log out the user and redirect to login screen
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

    // Cleanup function to unsubscribe from network changes when component unmounts
    return () => {
      unsubscribe();
    };
  }, [fetchData2, itemName, categoryName2]);
  const backHome = () => {
    navigation.navigate("EditCategories", { fetchData2 });
    fetchData2();
  };
  const makeSureDeleteSub = () => {
    Alert.alert(
      "Delete Subcategory",
      "Are you sure you want to delete this subcategory? All flashcards in this subcategory will be deleted.",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => deleteSubcategory(),
        },
      ],
      { cancelable: false }
    );
  };

  const fetchDataSub = async () => {
    try {
      // Direct reference to the subcategory document
      const subcategoryDocRef = doc(
        firestore,
        `users/${uid}/data/${categoryName2}/subcategory`,
        lastClicked
      );

      // Get the subcategory document
      const subcategoryDocSnap = await getDoc(subcategoryDocRef);

      if (subcategoryDocSnap.exists()) {
        const subcategoryData = subcategoryDocSnap.data();

        // Set the states with the fetched subcategory data

        setFlashcards(subcategoryData.flashcards || []);
      } else {
        console.log("Subcategory not found!");
      }
    } catch (error) {
      console.error("Error fetching subcategory data:", error);
    }
  };

  const handleSelect = (value) => {
    // Extracting the text before '('
    const endIndex = value.indexOf("(");
    let selectedValue3 = value;
    if (endIndex > 0) {
      selectedValue3 = value.substring(0, endIndex).trim();
    }
    setSelected2(selectedValue3);
    console.log(selected2);
    // Extracting the text inside '()'
    const match = value.match(/\((.*?)\)/);
    if (match && match[1]) {
      setCategory(match[1]);
      console.log(category);
    } else {
      setCategory("");
    }
  };

  const fetchDataMove = async () => {
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

      // Set the formatted data to state
      setData(formattedData);
    } catch (error) {
      console.error("Error getting document:", error);
    }
  };

  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight : 0;

  const [nameShow, setNameShow] = useState("");

  const [flashcards, setFlashcards] = useState([]);

  console.log(flashcards);
  const alphanumericAndEmojiRegex = /^[A-Za-z\s\p{Emoji}]+$/u;
  const saveChanges = async () => {
    try {
      if (!alphanumericAndEmojiRegex.test(selected)) {
        alert(
          "Invalid subcategory name. Only alphanumeric characters and emojis are allowed."
        );
        return;
      }

      const oldSubcategoryRef = doc(
        firestore,
        `users/${uid}/data/${categoryName2}/subcategory`,
        lastClicked
      );
      const newSubcategoryRef = doc(
        firestore,
        `users/${uid}/data/${categoryName2}/subcategory`,
        selected
      );

      const oldSubcategorySnap = await getDoc(oldSubcategoryRef);
      if (oldSubcategorySnap.exists()) {
        const oldSubcategoryData = oldSubcategorySnap.data();
        oldSubcategoryData.subcategoryName = selected; // Update the subcategoryName to selected
        await setDoc(newSubcategoryRef, oldSubcategoryData);
      } else {
        console.log("Original subcategory document not found!");
        return;
      }

      await deleteDoc(oldSubcategoryRef);

      console.log("Subcategory copied and original deleted successfully");
      fetchData2(); // Refresh data
      navigation.navigate("MainScreen"); // Navigate to MainScreen
    } catch (error) {
      console.error("Error in saveChanges:", error);
    }
  };

  const deleteSubcategory = async () => {
    try {
      // Direct reference to the subcategory document
      const subcategoryDocRef = doc(
        firestore,
        `users/${uid}/data/${categoryName2}/subcategory`,
        lastClicked
      );

      // Delete the subcategory document
      await deleteDoc(subcategoryDocRef);
      console.log("Subcategory deleted successfully");
      alert("Subcategory deleted successfully");

      // Update the data and navigate
      fetchDataSub(); // Adjust this function as needed to reflect the deletion
      navigation.navigate("MainScreen", { fetchData2 });
      fetchData2();
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  const visibleModal = () => {
    setModalVisible(true);
  };

  const deleteFlashcard = (flashcardId) => {
    Alert.alert(
      "Delete Flashcard",
      "Are you sure you want to delete this flashcard?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => confirmDelete(flashcardId),
        },
      ],
      { cancelable: false }
    );
  };

  const confirmDelete = async (flashcardId) => {
    try {
      // Direct reference to the subcategory document
      const subcategoryDocRef = doc(
        firestore,
        `users/${uid}/data/${categoryName2}/subcategory`,
        lastClicked
      );

      // Fetch the subcategory document
      const subcategoryDocSnap = await getDoc(subcategoryDocRef);

      if (subcategoryDocSnap.exists()) {
        const subcategoryData = subcategoryDocSnap.data();
        const updatedFlashcards = subcategoryData.flashcards.filter(
          (fc) => fc.id !== flashcardId
        );

        // Update the subcategory document with the new flashcards array
        await updateDoc(subcategoryDocRef, { flashcards: updatedFlashcards });
        console.log("Flashcard deleted successfully");
        alert("Flashcard deleted successfully");

        fetchDataSub(); // Refresh the data after deletion
      } else {
        console.log("Subcategory not found for deletion");
      }
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    }
  };

  const moveFlashcards = async () => {
    try {
      const oldSubcategoryRef = doc(
        firestore,
        `users/${uid}/data/${categoryName2}/subcategory`,
        lastClicked
      );
      const newSubcategoryRef = doc(
        firestore,
        `users/${uid}/data/${categoryName2}/subcategory`,
        selected2
      );

      // Get flashcards from the old (source) subcategory
      const oldSubcategorySnap = await getDoc(oldSubcategoryRef);
      let sourceFlashcards = [];
      if (oldSubcategorySnap.exists()) {
        sourceFlashcards = oldSubcategorySnap.data().flashcards || [];
      }

      // Get flashcards from the new (destination) subcategory
      const newSubcategorySnap = await getDoc(newSubcategoryRef);
      let destFlashcards = [];
      if (newSubcategorySnap.exists()) {
        destFlashcards = newSubcategorySnap.data().flashcards || [];
      }

      if (lastClicked === selected2) {
        alert("You cannot move flashcards to the same subcategory!");
        return;
      }

      // Combine flashcards and update the destination subcategory
      const updatedDestFlashcards = [...destFlashcards, ...sourceFlashcards];
      await updateDoc(newSubcategoryRef, { flashcards: updatedDestFlashcards });

      // Clear flashcards from the source subcategory
      await updateDoc(oldSubcategoryRef, { flashcards: [] });

      console.log("Flashcards moved successfully");
      fetchDataSub();
      setModalVisible(false);
    } catch (error) {
      console.error("Error moving flashcards:", error);
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
            Back to Editing Category
          </Text>
        </TouchableOpacity>

        <TextInput
          style={{
            marginTop: 50,
            borderBottomColor: color2,
            borderWidth: 3,
            borderTopColor: "#fefefa",
            borderLeftColor: "#fefefa",
            borderRightColor: "#fefefa",
            fontSize: 20,
            fontWeight: "bold",
            borderRadius: 10,
            width: 250,
            height: 50,
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
          value={selected}
          onChangeText={(text) => setSelected(text)}
          // Add other props as needed, like placeholder, style, etc.
        />

        <TouchableOpacity
          onPress={makeSureDeleteSub}
          style={{
            marginTop: 60,
            marginBottom: 40,
            borderColor: "red",
            borderWidth: 1,
            backgroundColor: "white",
            borderRadius: 10,
            width: 220,
            height: 50,
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <Text>Delete this subcategory</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={visibleModal}
          style={{
            marginTop: 0,
            borderColor: "darkblue",
            borderWidth: 1,
            backgroundColor: "white",
            borderRadius: 10,
            width: 220,
            height: 50,
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <Text>Move flashcards </Text>
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalOverlay}>
              <View
                style={[styles.modalContent, { height: 550, marginTop: 50 }]}
              >
                <View style={styles.selectList}>
                  <Text style={styles.textList}> Select subcategory</Text>
                  <SelectList
                    setSelected={handleSelect}
                    data={data}
                    save="value"
                    boxStyles={{ backgroundColor: "white" }}
                    dropdownStyles={{ backgroundColor: "white" }}
                  />
                </View>
                <TouchableOpacity
                  style={styles.buttonLogin}
                  onPress={moveFlashcards}
                >
                  <Text style={styles.clearButtonTextL}>Move Flashcards</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.buttonRegister,
                    { marginTop: 20, width: 100, height: 50 },
                  ]}
                  //close modal
                  onPress={() => setModalVisible(false)}
                >
                  <Text
                    style={[
                      styles.clearButtonText,
                      { fontSize: 15, fontWeight: 400 },
                    ]}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 500,
            margin: 5,
            marginTop: 20,
            borderBottomColor: "black",
            borderBottomWidth: 2,
          }}
        >
          Click a flashcard you want to delete
        </Text>
        <ScrollView>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-around",
              marginLeft: 0,
            }}
          >
            {flashcards.map((flashcard, index) => {
              let displayBackContent = flashcard.backContent;
              let displayFrontContent = flashcard.frontContent;

              let displayTrained = flashcard.trained;

              // Check the number of commas in both frontContent and backContent
              const commaCountFront = (flashcard.frontContent.match(/,/g) || [])
                .length;
              const commaCountBack = (flashcard.backContent.match(/,/g) || [])
                .length;

              // If either has more than 3 commas, set display values to "svg"
              if (commaCountFront > 3 || commaCountBack > 3) {
                displayBackContent = "svg";
                displayFrontContent = "svg";
              }

              if (flashcard.trained) {
                displayTrained = "trained";
              }

              if (!flashcard.trained) {
                displayTrained = "untrained";
              }

              const renderBack = () => {
                // Check if the flashcardFront contains more than three commas
                if (displayBackContent === "svg") {
                  // Return the Svg component

                  return (
                    <View style={styles.dziambo2}>
                      <Svg
                        viewBox={`0 0 ${deviceWidth * 0.9} ${
                          deviceHeight * 0.35
                        }`}
                      >
                        <Path
                          d={flashcard.backContent}
                          stroke={"black"}
                          fill={"transparent"}
                          strokeWidth={2}
                          strokeLinejoin={"round"}
                          strokeLinecap={"round"}
                        />
                        {paths2.length > 0 &&
                          paths2.map((item, index) => (
                            <Path
                              key={`path-${index}`}
                              d={item}
                              stroke={"black"}
                              fill={"transparent"}
                              strokeWidth={0.5}
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
                    <View style={styles.dziambo2}>
                      <Text style={styles.flashcardText}>
                        {displayBackContent}
                      </Text>
                    </View>
                  );
                }
              };

              const renderFront = () => {
                // Check if the flashcardFront contains more than three commas
                if (displayFrontContent === "svg") {
                  // Return the Svg component
                  return (
                    <View style={styles.dziambo2}>
                      <Svg
                        viewBox={`0 0 ${deviceWidth * 0.9} ${
                          deviceHeight * 0.35
                        }`}
                      >
                        <Path
                          d={flashcard.frontContent}
                          stroke={"black"}
                          fill={"transparent"}
                          strokeWidth={2}
                          strokeLinejoin={"round"}
                          strokeLinecap={"round"}
                        />
                        {paths.length > 0 &&
                          paths.map((item, index) => (
                            <Path
                              key={`path-${index}`}
                              d={item}
                              stroke={"black"}
                              fill={"transparent"}
                              strokeWidth={0.5}
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
                    <View style={styles.dziambo2}>
                      <Text style={styles.flashcardText}>
                        {displayFrontContent}
                      </Text>
                    </View>
                  );
                }
              };

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => deleteFlashcard(flashcard.id)}
                  style={{
                    width: deviceWidth * 0.49, // Each button takes up slightly less than half the width
                    marginLeft: 0,
                    marginTop: 20,
                    // Add other styles as needed
                  }}
                >
                  <GestureFlipView
                    width={deviceWidth * 0.48}
                    height={deviceHeight * 0.15}
                  >
                    {renderBack()}
                    {renderFront()}
                  </GestureFlipView>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
      <TouchableOpacity
        onPress={saveChanges}
        style={{ backgroundColor: "lightyellow", padding: 20 }}
      >
        <Text style={[styles.clearButtonText, { textAlign: "center" }]}>
          Save Subcategory Changes
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EditSubcategories;
