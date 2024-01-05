import {
  Modal,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React from "react";
import styles from "./styles";
import { deviceHeight, deviceWidth } from "./styles";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, firestore } from "./firebase";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import Logo from "./assets/newLogo.svg";

StatusBar.setTranslucent(true);
StatusBar.setBackgroundColor("white"); // Set this to match your app's background color if necessary

const LoginScreen = () => {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, navigate to the main screen
        // Ensure to check for email verification if necessary
        if (user.emailVerified) {
          navigation.navigate("MainScreen", { dataUpdated: true });
        }
      } else {
        // No user is signed in, stay on the login screen
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight : 0;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(true);
  const [modalForgot, setModalForgot] = useState(false);
  const [forgotText, setForgotText] = useState("");

  const navigation = useNavigation();

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("User created:", user);

        // Sending email verification
        sendEmailVerification(user)
          .then(() => {
            console.log("Email verification sent");
          })
          .catch((verificationError) => {
            console.error("Email verification error:", verificationError);
          });

        // Reference to the user's document in 'users' collection
        const userRef = doc(firestore, "users", user.uid);

        // User's basic info
        const userInfo = {
          email: user.email,
          uid: user.uid,
          lastClickedSubcategory: "",
          InCategory: "",
          lastClickedCategory: "",
          lastClickedSubcategoryEdit: "",
          flashcardsAmount: 0,
        };

        setDoc(userRef, userInfo)
          .then(() => {
            console.log("User basic info written to Firestore:", userInfo);

            // Reference to a document in 'data' subcollection
            const dataDocRef = doc(
              firestore,
              `users/${user.uid}/data/initialData`
            );

            // Data to be written to the subcollection document
            const initialData = {
              // ... data fields
            };

            // Writing data to the 'data' subcollection
            setDoc(dataDocRef, initialData)
              .then(() => {
                console.log("Data written to subcollection:", initialData);
              })
              .catch((error) => {
                console.error("Error writing to subcollection:", error);
              });
          })
          .catch((firestoreError) => {
            console.error("Firestore write error:", firestoreError);
          });
        setPassword("");
        setEmail("");
        alert("Please check your email to verify your account");
      })

      .catch((error) => {
        console.error("User registration error:", error);
      });
  };
  const resetPassword = async () => {
    if (forgotText.trim() === "") {
      alert("Please enter your email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, forgotText);
      alert("Password reset email sent. Please check your inbox.");
      setModalForgot(false);
      setForgotText("");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      alert("Error sending password reset email. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login button clicked");

    // navigation.navigate("MainScreen");

    try {
      await signInWithEmailAndPassword(auth, email, password);

      const user = auth.currentUser; // Get the current user
      console.log(user.emailVerified);
      if (user && user.emailVerified) {
        // User is authenticated and their email is verified
        setEmail("");
        setPassword("");
        navigation.navigate("MainScreen", { dataUpdated: true });
      } else {
        // User is not authenticated or email is not verified
        console.error(
          "Login error: User is not authenticated or email is not verified"
        );
        setLoginSuccess(false);
        // Reset loginSuccess to true after 3 seconds
        setTimeout(() => {
          setLoginSuccess(true);
        }, 30000);
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginSuccess(false);
      setPassword("");
      // Reset loginSuccess to true after 3 seconds
      setTimeout(() => {
        setLoginSuccess(true);
      }, 10000);
    }
  };
  const breakpoint = 768;
  const logoWidth = deviceWidth > breakpoint ? 500 : 300;
  const logoHeight = deviceWidth > breakpoint ? 500 : 300;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={[styles.loginContainer, { marginTop: statusBarHeight }]}
      >
        <View style={styles.inputContainerLogin}>
          <View
            style={{
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Logo width={logoWidth} height={logoHeight} />
          </View>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.inputL}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.inputL}
            secureTextEntry
          />
        </View>
        {!loginSuccess && (
          <Text style={styles.errorM}>
            Login failed. Wrong e-mail or password. Please try again. You may
            need to confirm your email if you haven't yet.
          </Text>
        )}

        <View style={styles.buttonLoginContainer}>
          <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
            <Text style={styles.clearButtonTextL}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRegisterContainer}>
          <TouchableOpacity
            style={styles.buttonRegister}
            onPress={handleSignUp}
          >
            <Text style={styles.clearButtonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalForgot(true)}
            style={{
              marginTop: 20,
              height: deviceHeight * 0.05,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Forgot your password? Click here.</Text>
          </TouchableOpacity>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalForgot}
            onRequestClose={() => setModalForgot(false)}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modalOverlay}>
                <View
                  style={[
                    styles.modalContent,
                    {
                      justifyContent: "center",
                      alignItems: "center",
                      height: deviceHeight * 0.3,
                    },
                  ]}
                >
                  {/* Close Button */}
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalForgot(false)}
                  >
                    <Text style={styles.closeButtonText}>X</Text>
                  </TouchableOpacity>
                  <Text style={{ marginBottom: 10, textAlign: "center" }}>
                    If You've just registered, make sure that you confirmed your
                    registration email.
                  </Text>
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor={"#000"}
                    style={styles.inputCategory5}
                    value={forgotText}
                    onChangeText={(text) => setForgotText(text)}
                  />
                  <TouchableOpacity
                    onPress={resetPassword}
                    style={[
                      styles.buttonLogin,
                      {
                        width: deviceWidth * 0.5,
                        height: deviceHeight * 0.065,
                        marginTop: 10,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.clearButtonTextL,
                        { fontSize: deviceHeight * 0.02 },
                      ]}
                    >
                      Reset Password
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
