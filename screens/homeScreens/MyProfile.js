import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  Alert,
} from "react-native";
import firebase, { supabase } from "../../config";

const database = firebase.database();

export default function MyProfil(props) {
  const currentId = props.route.params?.currentId;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState(null); // Current profile image
  const [localImage, setLocalImage] = useState(null); // Selected image to upload

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = database.ref(`ListProfile/un_User${currentId}`);
      userRef.on("value", (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          setName(userData.name || "");
          setEmail(userData.email || "");
          setPhone(userData.phone || "");
          setProfileImage(userData.Image || null); // Update for case sensitivity
        }
      });

      return () => userRef.off("value");
    };

    fetchUserData();
  }, [currentId]);




  const uploadImage = async (uri) => {
    console.log("Image URI:", uri);  // Vérifiez l'URL de l'image
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log("Image fetched successfully");
      
      const { data, error } = await supabase.storage
        .from("profilImage")
        .upload(`profile_${currentId}`, blob, { upsert: true });
  
      if (error) {
        console.error("Image upload failed:", error);
        Alert.alert("Error", "Failed to upload image.");
        return null;
      }
  
      const { data: publicUrl } = supabase.storage
        .from("profilImage")
        .getPublicUrl(`profile_${currentId}`);
  
      console.log("Image uploaded successfully:", publicUrl.publicUrl);
      return publicUrl.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image.");
      return null;
    }
  };

  

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setLocalImage(result.assets[0].uri); // Store local image for preview and upload
    }
  };

  const handleSave = async () => {
    try {
      const userRef = database.ref(`ListProfile/un_User${currentId}`);
      const updatedData = {
        name,
        phone,
      };

      if (localImage) {
        const imageUrl = await uploadImage(localImage);
        if (imageUrl) {
          updatedData.Image = imageUrl; // Save the new image URL
        }
      }

      await userRef.update(updatedData);
      Alert.alert("Success", "Profile updated successfully!");
      setProfileImage(localImage || profileImage); // Update displayed image
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/flower.jpg")}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Text style={styles.header}>My Account</Text>

      <TouchableHighlight onPress={pickImage}>
        <Image
          source={
            localImage
              ? { uri: localImage }
              : profileImage
              ? { uri: profileImage }
              : require("../../assets/flower.jpg")
          }
          style={styles.profileImage}
        />
      </TouchableHighlight>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor="#fff"
        style={styles.textInput}
      />
      <TextInput
        value={email}
        editable={false} // Email should not be editable for profile updates
        placeholder="Email"
        placeholderTextColor="#fff"
        style={styles.textInput}
      />
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone"
        placeholderTextColor="#fff"
        keyboardType="phone-pad"
        style={styles.textInput}
      />

      <TouchableHighlight onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save changes</Text>
      </TouchableHighlight>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  textInput: {
    width: "80%",
    height: 50,
    backgroundColor: "#00000050",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    width: "80%",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 80,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#c6a3c6",
    fontSize: 18,
    fontWeight: "bold",
  },
});













//
//
//import * as ImagePicker from "expo-image-picker";
//import { StatusBar } from "expo-status-bar";
//import React, { useState } from "react";
//import {
//  Image,
//  ImageBackground,
//  StyleSheet,
//  Text,
//  TextInput,
//  TouchableHighlight,
//} from "react-native";
//import firebase, { supabase } from "../../config";
//const database = firebase.database();
//
//export default function MyProfil(props) {
//  const currentId = props.route.params?.currentId;
//  const [nom, setNom] = useState();
//  const [prenom, setPrenom] = useState();
//  const [telephone, setTelephone] = useState();
//
//  const [isDefaultImage, setisDefaultImage] = useState(true);
//  const [uriLocalImage, seturiLocalImage] = useState();
//
//  const uploadImage = async (uri) => {
//    const response = await fetch(uri);
//    const blob = await response.blob();
//    const arraybuffer = await new Response(blob).arrayBuffer();
//
//    console.log(arraybuffer);
//
//    await supabase.storage
//      .from("profilImage")
//      .upload("image" + currentId, arraybuffer);
//
//    const { data } = supabase.storage
//      .from("profilImage")
//      .getPublicUrl("image" + currentId);
//
//    return data;
//  };
//
//  const pickImage = async () => {
//    // No permissions request is necessary for launching the image library
//    let result = await ImagePicker.launchImageLibraryAsync({
//      mediaTypes: ImagePicker.MediaTypeOptions.All,
//      allowsEditing: true,
//      aspect: [4, 3],
//      quality: 1,
//    });
//
//    if (!result.canceled) {
//      setisDefaultImage(false);
//      seturiLocalImage(result.assets[0].uri);
//    }
//  };
//
//  return (
//    <ImageBackground
//      source={require("../../assets/flower.jpg")}
//      style={styles.container}
//    >
//      <StatusBar style="light" />
//      <Text style={styles.textstyle}>My Account</Text>
//      <TouchableHighlight
//        onPress={() => {
//          pickImage();
//        }}
//      >
//        <Image
//          source={
//            isDefaultImage
//              ? require("../../assets/flower.jpg")
//              : { uri: uriLocalImage }
//          }
//          style={{
//            borderRadius: 100,
//            height: 200,
//            width: 200,
//          }}
//        />
//      </TouchableHighlight>
//
//      <TextInput
//        onChangeText={(text) => {
//          setNom(text);
//        }}
//        textAlign="center"
//        placeholderTextColor="#fff"
//        placeholder="Nom"
//        keyboardType="name-phone-pad"
//        style={styles.textinputstyle}
//      ></TextInput>
//      <TextInput
//        onChangeText={(text) => {
//          setPrenom(text);
//        }}
//        textAlign="center"
//        placeholderTextColor="#fff"
//        placeholder="Prenom"
//        keyboardType="name-phone-pad"
//        style={styles.textinputstyle}
//      ></TextInput>
//      <TextInput
//        onChangeText={(text) => {
//          setTelephone(text);
//        }}
//        placeholderTextColor="#fff"
//        textAlign="center"
//        placeholder="Numero"
//        style={styles.textinputstyle}
//      ></TextInput>
//      <TouchableHighlight
//        onPress={async() => {
//          const ref_listProfile = database.ref("ListProfile");
//          const key = ref_listProfile.push().key;
//          const ref_un_profil = ref_listProfile.child("un_Profil" + key);
//          let linkImage = null;
//      if (uriLocalImage) {
//        linkImage = await uploadImage(uriLocalImage); // Upload the image and get the URL
//      }
//          ref_un_profil.set({
//            id: key,
//            nom,
//            prenom,
//            telephone,
//            linkImage, 
//          }).then(() => {
//            console.log("Profile saved successfully!");
//            // You can add a success message or navigation here
//          })
//          .catch((error) => {
//            console.error("Error saving profile:", error.message);
//          });
//        }}
//        activeOpacity={0.5}
//        underlayColor="#c6a3c6"
//        style={{
//          marginBottom: 10,
//          borderColor: "#00f",
//          borderWidth: 2,
//          backgroundColor: "#08f6",
//          textstyle: "italic",
//          fontSize: 24,
//          height: 60,
//          width: "50%",
//          justifyContent: "center",
//          alignItems: "center",
//          borderRadius: 5,
//          marginTop: 20,
//        }}
//      >
//        <Text
//          style={{
//            color: "#FFF",
//            fontSize: 24,
//          }}
//        >
//          Save
//        </Text>
//      </TouchableHighlight>
//    </ImageBackground>
//  );
//}
//const styles = StyleSheet.create({
//  textinputstyle: {
//    fontWeight: "bold",
//    backgroundColor: "#0004",
//    fontSize: 20,
//    color: "#fff",
//    width: "75%",
//    height: 50,
//    borderRadius: 10,
//    margin: 5,
//  },
//  textstyle: {
//    fontSize: 40,
//    fontFamily: "serif",
//    color: "#fff",
//    fontWeight: "bold",
//  },
//  container: {
//    color: "#c6a3c6",
//    flex: 1,
//    backgroundColor: "#fff",
//    alignItems: "center",
//    justifyContent: "center",
//  },
//});
//