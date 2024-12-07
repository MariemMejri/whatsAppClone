import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import firebase from "../config";
import { supabase } from "../config"; // Import Supabase configuration
import * as ImagePicker from 'expo-image-picker'; // For image picking
import { useRoute } from '@react-navigation/native';

const database = firebase.database();
const ref_groups = database.ref("Groups");

export default function GroupChat({ navigation }) {
  const { groupId, groupName, currentId } = useRoute().params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userNames, setUserNames] = useState({});
  const [uploading, setUploading] = useState(false);
  const loadedMessages = useRef(new Set());

  // Fetch messages and user data
  useEffect(() => {
    const messageListener = ref_groups.child(groupId).child("messages").on("child_added", (snapshot) => {
      const message = snapshot.val();

      if (!loadedMessages.current.has(snapshot.key)) {
        loadedMessages.current.add(snapshot.key);
        setMessages((prevMessages) => [...prevMessages, message]);

        if (!userNames[message.senderId]) {
          const userRef = database.ref(`ListProfile/un_User${message.senderId}`);
          userRef.once("value", (snapshot) => {
            const userData = snapshot.val();
            if (userData) {
              setUserNames((prevNames) => ({
                ...prevNames,
                [message.senderId]: userData.name,
              }));
            }
          });
        }
      }
    });

    return () => {
      ref_groups.child(groupId).child("messages").off("child_added", messageListener);
    };
  }, [groupId, userNames]);
  const isValidImageUrl = (url) => {
    // Replace with a more robust validation (e.g., using url-validator)
    return url && url.startsWith('http') && (url.endsWith('.jpg') || url.endsWith('.png'));
  };
  const sendMessage = async () => {
    if (newMessage.trim()) {
      const message = {
        senderId: currentId,
        text: newMessage,
        timestamp: new Date().toISOString(),
      };

      ref_groups.child(groupId).child("messages").push(message);
      setNewMessage("");
    }
  };

  const pickAndUploadImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Permission to access gallery is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.cancelled) {
        setUploading(true);
        const imageUri = result.uri;

        // Upload image to Supabase
        const fileName = `${Date.now()}-${currentId}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("profilImage")
          .upload(fileName, {
            uri: imageUri,
            name: fileName,
            type: "image/jpeg",
          });

        if (uploadError) {
          console.error("Error uploading image to Supabase:", uploadError.message);
          Alert.alert("Upload failed", "Failed to upload image. Please try again.");
          setUploading(false);
          return;
        }

        // Get public URL from Supabase
        const { data: publicUrlData, error: publicUrlError } =
          supabase.storage.from("profilImage").getPublicUrl(fileName);

        if (publicUrlError) {
          console.error("Error fetching public URL:", publicUrlError.message);
          Alert.alert("URL retrieval failed", "Failed to retrieve image URL. Please try again.");
          setUploading(false);
          return;
        }

        const publicUrl = publicUrlData.publicUrl;
        console.log("Public URL:", publicUrl);

        // Save image link in Firebase
        const message = {
          senderId: currentId,
          imageUrl: publicUrl,
          timestamp: new Date().toISOString(),
        };

        ref_groups.child(groupId).child("messages").push(message);
        setUploading(false);
      }
    } catch (error) {
      console.error("Error picking or uploading image:", error.message);
      setUploading(false);
      Alert.alert("Error", "There was an issue picking or uploading the image.");
    }
  };

  const renderItem = ({ item }) => {
    const senderName = userNames[item.senderId] || "Unknown";

    const messageContent = item.text || isValidImageUrl(item.imageUrl) ? (
      <>
        {item.text && <Text style={styles.messageText}>{item.text}</Text>}
        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.messageImage}
            onError={(e) => console.error("Image loading error:", e.nativeEvent.error)}
          />
        )}
      </>
    ) : (
      <Text style={styles.messageError}>Invalid image URL</Text>
    );

    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageSender}>{senderName}</Text>
        {messageContent}
        <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{groupName}</Text>

      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        style={styles.messagesList}
      />

      <View style={styles.messageInputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
          onPress={pickAndUploadImage}
          disabled={uploading}
        >
          <Text style={styles.uploadButtonText}>{uploading ? "Uploading..." : "Upload"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  messagesList: {
    flex: 1,
    width: "100%",
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 1,
  },
  messageSender: {
    fontWeight: "bold",
  },
  messageText: {
    marginTop: 5,
    color: "#333",
  },
  messageImage: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 5,
  },
  messageTimestamp: {
    marginTop: 5,
    fontSize: 10,
    color: "#aaa",
  },
  messageInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  messageInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  uploadButtonDisabled: {
    backgroundColor: "#aaa",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
