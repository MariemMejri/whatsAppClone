import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  ImageBackground,
  StyleSheet,
  Image,
  Text,
  View,
  Button,
  TextInput,
  TouchableHighlight,
} from "react-native";
import firebase, { supabase } from "../config"; // Firebase config import

const auth = firebase.auth();
const database = firebase.database();

export default function NewUser(props) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [phone, setPhone] = useState("");

  const [isDefaultImage, setisDefaultImage] = useState(true);
  const [uriLocalImage, seturiLocalImage] = useState();

  const uploadImage = async (uri, userId) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const arraybuffer = await new Response(blob).arrayBuffer();

    console.log(arraybuffer);

    // Use userId instead of currentId
    await supabase.storage
      .from("profilImage")
      .upload("image" + userId, arraybuffer);

    const { data } = supabase.storage
      .from("profilImage")
      .getPublicUrl("image" + userId);

    return data.publicUrl;
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setisDefaultImage(false);
      seturiLocalImage(result.assets[0].uri);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/flower.jpg")}
      blurRadius={3}
      style={styles.container}
    >
      <View style={styles.container1}>
        <Text style={styles.textStyle}>Create New User</Text>

        <TouchableHighlight
          onPress={() => {
            pickImage();
          }}
        >
          <Image
            source={
              isDefaultImage
                ? require("../assets/flower.jpg")
                : { uri: uriLocalImage }
            }
            style={{
              borderRadius: 100,
              height: 150,
              width: 150,
              marginBottom: 20,
            }}
          />
        </TouchableHighlight>

        <TextInput
          value={email}
          onChangeText={(txt) => setEmail(txt)}
          keyboardType="email-address"
          placeholder="email"
          style={styles.textInputStyle}
        />

        <TextInput
          value={pwd}
          onChangeText={(txt) => setPwd(txt)}
          placeholder="password"
          secureTextEntry={true}
          style={styles.textInputStyle}
        />

        <TextInput
          value={confirmPwd}
          onChangeText={(txt) => setConfirmPwd(txt)}
          placeholder="confirm password"
          secureTextEntry={true}
          style={styles.textInputStyle}
        />

        <TextInput
          value={phone}
          onChangeText={(txt) => setPhone(txt)}
          keyboardType="phone-pad"
          placeholder="Phone Number"
          style={styles.textInputStyle}
        />

        <View style={styles.container2}>
          <Button
            color={"#c6a3c6"}
            onPress={async () => {
              if (confirmPwd === pwd) {
                auth
                  .createUserWithEmailAndPassword(email, pwd)
                  .then(async (userCredential) => {
                    const user = userCredential.user;
                    const userId = user.uid; // Get the user's UID
                    const userName = email.split("@")[0]; // Example username
                    const userEmail = user.email;

                    let linkImage = null;
                    if (uriLocalImage) {
                      linkImage = await uploadImage(uriLocalImage, userId); // Pass userId
                    }

                    // Save user data to the Firebase Realtime Database
                    const userRef = database.ref("ListProfile");
                    const ref_un_user = userRef.child("un_User" + userId);
                    ref_un_user
                      .set({
                        id: userId,
                        name: userName,
                        email: userEmail,
                        phone: phone,
                        Image: linkImage, // Save the image link
                      })
                      .then(() => {
                        console.log("Profile saved successfully!");
                        // Navigate to Home page
                        props.navigation.replace("Home", { currentId: userId });
                      })
                      .catch((error) => {
                        console.error("Error saving profile:", error.message);
                      });
                  })
                  .catch((error) => {
                    alert(error.message);
                  });
              } else {
                alert("Passwords do not match.");
              }
            }}
            title="Submit"
          />

          <Button color={"#c6a3c6"} onPress={() => {}} title="Back" />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center", // align hor
    justifyContent: "center", // vertical
  },
  container1: {
    backgroundColor: "#0002",
    height: 600,
    marginBottom: 10,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  container2: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    marginBottom: 10,
  },
  textStyle: {
    fontSize: 32,
    color: "#fff",
    marginBottom: 10,
  },
  textInputStyle: {
    borderRadius: 10,
    padding: 10,
    height: 45,
    width: "80%",
    marginBottom: 10,
    backgroundColor: "#fff",
  },
});
