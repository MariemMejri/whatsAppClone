import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, CheckBox } from "react-native";
import firebase from "../../config";
import { useNavigation } from '@react-navigation/native';

const database = firebase.database();
const ref_groups = database.ref("Groups");
const ref_users = database.ref("Users"); // Reference to your users' database

export default function Groupe(props) {
  const currentId = props.route.params.currentId;

  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]); // List of available users
  const navigation = useNavigation();
  useEffect(() => {
    const groupListener = ref_groups.on("value", (snapshot) => {
      const groupList = [];
      snapshot.forEach((childSnapshot) => {
        const group = childSnapshot.val();
        if (Array.isArray(group.members) && group.members.includes(currentId)) {
          groupList.push(group); // Include only groups where the user is a member
        }
      });
      setGroups(groupList);
    });
  
    const userListener = ref_users.on("value", (snapshot) => {
      const userList = [];
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        userList.push({ id: childSnapshot.key, name: user.name }); // Assuming user data has 'name' and 'id'
      });
      setUsers(userList);
    });
  
    return () => {
      ref_groups.off("value", groupListener);
      ref_users.off("value", userListener);
    };
  }, [currentId]);
  
  
  const navigateToGroupChat = (groupId, groupName, currentId) => {
    if (groupId && groupName) {
      navigation.navigate("GroupChat", { groupId, groupName ,currentId});
    } else {
      console.error('Group ID or Group Name is undefined');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Groups</Text>

    

      {/* Display available users */}
      


      {/* Display existing groups */}
      <FlatList
        data={groups}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.groupCard}
            onPress={() => navigateToGroupChat(item.id, item.name,currentId)}
          >
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupMemberCount}>
              {Array.isArray(item.members) ? item.members.length : 0} members
            </Text>
          </TouchableOpacity>
        )}
        style={styles.groupList}
      />
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
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  groupList: {
    width: "100%",
  },
  groupCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  groupMemberCount: {
    fontSize: 14,
    color: "#666",
  },
});
