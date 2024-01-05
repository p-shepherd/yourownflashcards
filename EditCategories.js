import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  SectionList,
  Dimensions,
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
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

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
  deleteDoc,
} from "firebase/firestore";
import { auth, firestore } from "./firebase";

import NetInfo from "@react-native-community/netinfo";
import { deviceWidth, deviceHeight } from "./styles";

StatusBar.setTranslucent(true);
StatusBar.setBackgroundColor("white");

const EditCategories = ({ route, navigation }) => {
  const { fetchData2, itemName, color } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [SubcategoryName, setSubcategoryName] = useState("");

  const [selected, setSelected] = useState("");

  const [lastClicked, setLastClicked] = useState("");
  const [color2, setColor2] = useState("");

  const uid = auth.currentUser.uid;

  const makeSureDelete = () => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category? This action cannot be undone. All flashcards in this category subcategories will be deleted.",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => deleteCategory(),
        },
      ],
      { cancelable: false }
    );
  };

  const backHome = () => {
    navigation.navigate("MainScreen", { fetchData2 });
    fetchData2();
  };
  useEffect(() => {
    if (!fetchData2 || !itemName) {
      navigation.navigate("MainScreen");
      alert("Please select a category to edit");
    } else {
      console.log("fetchData2", fetchData2);
      console.log("itemName", itemName);
      setSelected(itemName);
      setLastClicked(itemName);
      setColor2(color);
    }
    fetchData();

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

  const [userData, setUserData] = useState([]);
  const fetchData = async () => {
    try {
      // Use 'itemName' to get the specific category document reference
      const categoryDocRef = doc(firestore, `users/${uid}/data/${itemName}`);

      // Reference to the subcategory subcollection
      const subcategoryCollectionRef = collection(
        categoryDocRef,
        "subcategory"
      );
      const subcategoryQuerySnapshot = await getDocs(subcategoryCollectionRef);

      // Map subcategories to sections
      const subcategories = subcategoryQuerySnapshot.docs.map((doc) => {
        const subcategoryData = doc.data();
        return {
          name: subcategoryData.subcategoryName, // Assuming the field is named 'subcategoryName'
        };
      });

      const sections = [
        {
          title: itemName,
          color: color2, // Use the color passed from the previous screen or state
          data: subcategories,
        },
      ];

      setUserData(sections); // Set the fetched data to state
    } catch (error) {
      console.error("Error getting subcategory data:", error);
    }
  };

  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight : 0;

  const handleEditSubcategoryNavigation = async (itemName, lastClicked) => {
    try {
      // Update the lastClickedSubcategory field in the user's document

      // If the update is successful, navigate to the "Session" screen
      navigation.navigate("EditSubcategories", {
        fetchData2: fetchData2,
        itemName: itemName,
        categoryName: lastClicked,
        color: color2,
      });
    } catch (error) {
      console.error("Error updating document:", error);
      // Handle error or show an error message to the user
    }
  };

  const alphanumericAndEmojiRegex = /^[A-Za-z\s\p{Emoji}]+$/u;
  // console.log(selected + "selected");
  // console.log(lastClicked);
  const saveChanges = async () => {
    try {
      const dataCollectionRef = collection(firestore, `users/${uid}/data`);
      const categoryQuerySnapshot = await getDocs(dataCollectionRef);

      // Check for name validity
      if (!alphanumericAndEmojiRegex.test(selected)) {
        alert(
          "Invalid category name. Only alphanumeric characters and emojis are allowed."
        );
        return;
      }

      // Check if the new category name is already taken
      const isNameTaken = categoryQuerySnapshot.docs.some((doc) => {
        const categoryData = doc.data();
        return categoryData.title === selected && doc.id !== lastClicked;
      });

      if (isNameTaken) {
        alert(
          "A category with this name already exists. Please choose a different name."
        );
        return;
      }

      const oldCategoryRef = doc(firestore, `users/${uid}/data`, lastClicked);
      const newCategoryRef = doc(firestore, `users/${uid}/data`, selected);

      // Copying the old category document to the new category document
      const oldCategorySnap = await getDoc(oldCategoryRef);
      if (oldCategorySnap.exists()) {
        const oldCategoryData = oldCategorySnap.data();
        oldCategoryData.title = selected; // Update the title field
        await setDoc(newCategoryRef, oldCategoryData); // Set the updated data in the new document
      } else {
        console.log("Original category document not found!");
        return;
      }

      // Reference to the subcategories in the old and new category documents
      const oldSubcategoriesRef = collection(oldCategoryRef, "subcategory");
      const newSubcategoriesRef = collection(newCategoryRef, "subcategory");

      // Get and copy each subcategory document
      const subcategoriesSnapshot = await getDocs(oldSubcategoriesRef);
      for (const subcategoryDoc of subcategoriesSnapshot.docs) {
        const newSubcategoryRef = doc(newSubcategoriesRef, subcategoryDoc.id);
        await setDoc(newSubcategoryRef, subcategoryDoc.data());
      }

      // Delete the original category document along with its subcollections
      // Note: This operation is complex and should be done with caution
      // Delete the subcategories first
      for (const subcategoryDoc of subcategoriesSnapshot.docs) {
        const subcategoryRef = doc(oldSubcategoriesRef, subcategoryDoc.id);
        await deleteDoc(subcategoryRef);
      }
      // Finally, delete the category document itself
      await deleteDoc(oldCategoryRef);

      console.log(
        "Category and subcategories copied and original deleted successfully"
      );
      fetchData2();
      navigation.navigate("MainScreen", { dataUpdated: true });
    } catch (error) {
      console.error("Error in saveChanges:", error);
    }
  };
  const visibleModal = () => {
    setModalVisible(true);
  };

  //create subcategory inside this category

  const createSubcategory = async () => {
    try {
      // Reference to the category document
      const categoryDocRef = doc(firestore, `users/${uid}/data`, lastClicked);

      // Reference to the subcategory subcollection
      const subcategoryCollectionRef = collection(
        categoryDocRef,
        "subcategory"
      );

      // Check if subcategory already exists
      const subcategoryQuerySnapshot = await getDocs(subcategoryCollectionRef);
      const subcategoryExists = subcategoryQuerySnapshot.docs.some(
        (doc) => doc.data().subcategoryName === SubcategoryName
      );

      if (!subcategoryExists) {
        // New subcategory document reference with SubcategoryName as the ID
        const newSubcategoryDocRef = doc(
          subcategoryCollectionRef,
          SubcategoryName
        );

        // New subcategory object
        const newSubcategoryData = {
          subcategoryName: SubcategoryName,
          flashcards: [], // Initially empty array for flashcards
        };

        // Add the new subcategory document
        await setDoc(newSubcategoryDocRef, newSubcategoryData);

        console.log("Subcategory created successfully");
        fetchData(); // Update the local data after creation
        //go back to mainscreen
        fetchData2();
        navigation.navigate("MainScreen", { fetchData2 });
      } else {
        console.log("Subcategory already exists");
        alert("Subcategory already exists");
      }
    } catch (error) {
      console.error("Error creating subcategory:", error);
    } finally {
      setModalVisible(false); // Hide the modal in any case
      setSubcategoryName(""); // Clear the input field
    }
  };

  const breakpoint = 768;

  const fontStyle = deviceWidth > breakpoint ? 25 : 18;
  const fontStyle2 = deviceWidth > breakpoint ? 28 : 20;
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

        <TextInput
          style={{
            marginTop: 50,
            borderBottomColor: userData.length > 0 ? color2 : "lightblue",
            borderWidth: 5,
            borderTopColor: "#fefefa",
            borderLeftColor: "#fefefa",
            borderRightColor: "#fefefa",
            fontSize: deviceHeight * 0.029,
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

        <TouchableOpacity style={{ marginTop: 50 }}>
          <Text style={{ fontSize: fontStyle2, fontWeight: "400" }}>
            Subcategories
          </Text>
        </TouchableOpacity>

        <SectionList
          style={{ marginTop: 10 }}
          sections={userData}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                handleEditSubcategoryNavigation(item.name, lastClicked)
              }
              style={{
                borderBottomColor: userData.length > 0 ? color2 : "lightblue",
                borderWidth: 3,
                borderTopColor: "#fefefa",
                borderLeftColor: "#fefefa",
                borderRightColor: "#fefefa",
              }}
            >
              <Text
                style={{
                  marginTop: 15,
                  textAlign: "center",
                  fontSize: fontStyle,
                  padding: 3,
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => `basicListEntry-${index}-${item.name}`}
        />
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
          <Text>Add a subcategory</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={makeSureDelete}
          style={{
            marginTop: 50,
            marginBottom: 70,
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
          <Text>Delete this category</Text>
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { height: 250 }]}>
                <TextInput
                  placeholder="Enter Subcategory Name"
                  style={styles.inputCategory}
                  value={SubcategoryName}
                  onChangeText={(text) => setSubcategoryName(text)}
                />
                <TouchableOpacity
                  style={[styles.buttonLogin, { marginTop: 10 }]}
                  onPress={createSubcategory}
                >
                  <Text style={styles.startButtonText}>Create Subcategory</Text>
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
      </View>
      <TouchableOpacity
        onPress={saveChanges}
        style={{ backgroundColor: "lightyellow", padding: 20 }}
      >
        <Text style={[styles.clearButtonText, { textAlign: "center" }]}>
          Save Category Changes
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EditCategories;
